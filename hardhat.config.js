/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require('@nomiclabs/hardhat-ethers');
const { ethers } = require("ethers");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
      {
        version: "0.6.6",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
      {
        version: "0.7.0",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
      {
        version: "0.8.4",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
      {
        version: "0.4.18",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
      {
        version: "0.8.0",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
      {
        version: "0.8.20",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
     ],
  },
  networks: {
    berachain : {
      url: process.env.URL || "https://berachain-testnet-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000,
    },
  },
};

