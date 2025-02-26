const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); 
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const BeraSwapFactory = await hre.ethers.getContractFactory("BeraFactory");
  const factory = await BeraSwapFactory.deploy(deployer.address); 
  await factory.deployed();
  console.log("Factory deployed at:", factory.address);

  const wethAddress = "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590"; 

  const BeraSwapRouter = await hre.ethers.getContractFactory("BeraSwapRouter");
  const router = await BeraSwapRouter.deploy(factory.address, wethAddress);
  await router.deployed();
  console.log("Router deployed at:", router.address);

  const BeraToken = await hre.ethers.getContractFactory("Beraworld");
  const token = await BeraToken.deploy(deployer.address);
  await token.deployed();
  console.log("Token deployed at:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
