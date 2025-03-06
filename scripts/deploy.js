const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); 
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const factory = "0x03f5E481D452f145C90CB08751C631a4E33eE776";
  const wZetaAddress = "0x5F0b1a82749cb4E2278EC87F8BF6B618dC71a8bf"; 

  const ZetaSwapRouter = await hre.ethers.getContractFactory("ZetaSwapRouter");
  const router = await ZetaSwapRouter.deploy(factory, wZetaAddress);
  await router.deployed();
  console.log("Router deployed at:", router.address);

  const ZetaToken = await hre.ethers.getContractFactory("Zetaworld");
  const token = await ZetaToken.deploy(deployer.address);
  await token.deployed();
  console.log("Token deployed at:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
