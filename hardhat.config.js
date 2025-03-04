/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-verify");

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
    zetachain: {
      url: process.env.URL ,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 7001,
    },
  },
  // etherscan: {
  //   apiKey: "berachain_bartio", // Không cần API key, chỉ đặt placeholder
  //   customChains: [
  //     {
  //       network: "berachain", // Đặt trùng với `networks.berachain`
  //       chainId: 80084,
  //       urls: {
  //         apiURL: "https://api.routescan.io/v2/network/testnet/evm/80084/etherscan",
  //         browserURL: "https://bartio.beratrail.io",
  //       },
  //     },
  //   ],
  // },
};

