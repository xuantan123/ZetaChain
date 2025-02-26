/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-verify");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.7.0",
      },
      {
        version: "0.8.4",
      },
      {
        version: "0.4.18",
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.8.20",
      }
     ]
  },
  networks: {
    berachain: {
      url: process.env.URL || "https://rpc.berachain.com",  
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80094, 
      gasPrice: 1000000000
    },
  },
  etherscan: {
    apiKey: {
      berachain: "berachain_bartio", // apiKey is not required, just set a placeholder
    },
  },
  mocha: {
    timeout: 300000 // 60 giây thay vì 40 giây
  }
};
