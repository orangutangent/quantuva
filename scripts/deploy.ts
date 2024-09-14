import { ethers } from "hardhat";
import { Quantuva__factory } from "../typechain-types";
import fs from "fs";

const main = async () => {
  const [owner] = await ethers.getSigners();

  const QTVToken = await ethers.getContractFactory("Quantuva", owner);

  const qtvToken = await QTVToken.deploy(
    [
      "0xCcb2B635EEC9bbC5cB351b6eC906041D28115F6A",
      "0xF717059Be4d9E485d12E633DfC51eFFe8813fe75",
    ],
    ethers.parseUnits("1000000", 18)
  );

  await qtvToken.waitForDeployment();

  const data = {
    address: await qtvToken.getAddress(),
    abi: Quantuva__factory.abi,
  };

  fs.writeFileSync("./data/QTVToken.json", JSON.stringify(data));

  console.log(await qtvToken.name());

  console.log("QTVToken deployed to:", await qtvToken.getAddress());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
