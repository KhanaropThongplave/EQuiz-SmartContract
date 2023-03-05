import hre, { ethers } from "hardhat";
import { EQuizToken__factory } from "../typechain-types";
import addressUtils from "../utils/addresses";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const EQuizTokenFactory = (await ethers.getContractFactory(
    "EQuizToken"
  )) as EQuizToken__factory;

  const EQuizTokenContract = await EQuizTokenFactory.deploy();

  await EQuizTokenContract.deployed();
  await addressUtils.saveAddresses(hre.network.name, {
    EQuizToken: EQuizTokenContract.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});