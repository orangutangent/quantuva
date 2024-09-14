import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("QTVToken", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();

    const QTVToken = await ethers.getContractFactory("Quantuva", owner);

    const qtvToken = await QTVToken.deploy(
      [owner.address, user.address],
      ethers.parseUnits("1000000", 18)
    );

    await qtvToken.waitForDeployment();

    return { qtvToken, owner, user };
  }

  it("should be deployed correctly", async function () {
    const { qtvToken } = await loadFixture(deployFixture);
    expect(await qtvToken.name()).to.equal("Quantuva");
    expect(await qtvToken.totalSupply()).to.equal(
      ethers.parseUnits("200000", 18)
    );
  });

  it("should mint token", async function () {
    const { qtvToken, owner } = await loadFixture(deployFixture);
    await qtvToken.mint(owner.address, ethers.parseUnits("1000", 18));
    expect(await qtvToken.balanceOf(owner.address)).to.equal(
      ethers.parseUnits("101000", 18)
    );
  });

  it("should not mint over max supply", async function () {
    const { qtvToken, owner } = await loadFixture(deployFixture);
    await expect(
      qtvToken.mint(owner.address, ethers.parseUnits("1000000", 18))
    ).to.revertedWith("Minting exceeds max supply");
  });

  it("should not mint by not owner", async function () {
    const { qtvToken, user } = await loadFixture(deployFixture);
    await expect(
      qtvToken.connect(user).mint(user.address, ethers.parseUnits("1000", 18))
    ).to.reverted;
  });
  it("should transfer tokens", async function () {
    const { qtvToken, owner, user } = await loadFixture(deployFixture);
    await qtvToken.transfer(user.address, ethers.parseUnits("500", 18));
    expect(await qtvToken.balanceOf(owner.address)).to.equal(
      ethers.parseUnits("99500", 18)
    );
    expect(await qtvToken.balanceOf(user.address)).to.equal(
      ethers.parseUnits("100500", 18)
    );
  });

  it("should approve and transfer tokens via transferFrom", async function () {
    const { qtvToken, owner, user } = await loadFixture(deployFixture);
    await qtvToken.approve(user.address, ethers.parseUnits("1000", 18));

    await qtvToken
      .connect(user)
      .transferFrom(owner.address, user.address, ethers.parseUnits("500", 18));

    expect(await qtvToken.balanceOf(owner.address)).to.equal(
      ethers.parseUnits("99500", 18)
    );
    expect(await qtvToken.balanceOf(user.address)).to.equal(
      ethers.parseUnits("100500", 18)
    );
  });

  it("should reduce allowance after transferFrom", async function () {
    const { qtvToken, owner, user } = await loadFixture(deployFixture);
    await qtvToken.approve(user.address, ethers.parseUnits("1000", 18));

    await qtvToken
      .connect(user)
      .transferFrom(owner.address, user.address, ethers.parseUnits("500", 18));

    expect(await qtvToken.allowance(owner.address, user.address)).to.equal(
      ethers.parseUnits("500", 18)
    );
  });
});
