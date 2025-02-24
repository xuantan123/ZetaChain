/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

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
    berachian : {
      url: "wss://bartio.drpc.org", 
      accounts: [process.env.PRIVATE_KEY], 
      chainId: 80094, 
    },
  },
  mocha: {
    timeout: 300000 // 60 giây thay vì 40 giây
  }
};
