import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const { mnemonic } = require("./secrets.json");

const config: HardhatUserConfig = {
  solidity: {
    settings: {
      optimizer: {
        runs: 200,
        enabled: true,
      },
    },
    compilers: [
      {
        version: "0.8.9",
      },
    ],
  },
  etherscan: {
    apiKey: "XAPI8WHPUDQF9NRBH51NBYD68Y8X3SUYFG",
  },
  networks: {
    hardhat: {},
    sepolia_testnet: {
      url: `https://rpc.sepolia.org`,
      accounts: { mnemonic: mnemonic },
    },
  },
};

export default config;
