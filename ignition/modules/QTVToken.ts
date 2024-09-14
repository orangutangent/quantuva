import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const contracts = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0xCcb2B635EEC9bbC5cB351b6eC906041D28115F6A",
];

const MAX_SUPPLY = ethers.parseUnits("100000", 18);

const tokenModule = buildModule("QTVToken", (m) => {
  const initialAddresses = m.getParameter("initialAddresses", contracts);
  console.log(initialAddresses);
  const amount = m.getParameter("amount", MAX_SUPPLY);
  console.log(amount);
  const QTVToken = m.contract("Quantuva", [initialAddresses, MAX_SUPPLY]);
  return { QTVToken };
});

export default tokenModule;
