const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("BeraSwap Liquidity Tests", function () {
    let router;
    let signer;
    let provider;

    // BeraChain Configuration
    const BERA_RPC = process.env.URL;
    const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS; // Your deployed router address
    
    // Token addresses on BeraChain
    const BERA = "0xc8677673D08203AD5c6738F8a75D155aE78c645E"; // Native BERA token
    const HONEY = "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce"; // HONEY token address

    before(async function () {
        // Connect to BeraChain
        provider = new ethers.providers.JsonRpcProvider(BERA_RPC);
        
        // Get signer using private key
        const privateKey = process.env.PRIVATE_KEY;
        signer = new ethers.Wallet(privateKey, provider);

        // Connect to your deployed router
        router = await ethers.getContractAt("IBeraSwapRouter", ROUTER_ADDRESS, signer);
    });

    describe("Add Liquidity", function () {
        it("Should add BERA-HONEY liquidity", async function () {
            // Amount of tokens to add
            const honeyAmount = ethers.utils.parseEther("10"); // 10 HONEY
            const beraAmount = ethers.utils.parseEther("0.1"); // 0.1 BERA

            try {
                // First approve HONEY tokens
                const IERC20_ABI = [
                    "function approve(address spender, uint256 amount) external returns (bool)",
                    "function allowance(address owner, address spender) external view returns (uint256)",
                    "function balanceOf(address account) external view returns (uint256)"
                ];
                
                const honeyToken = new ethers.Contract(HONEY, IERC20_ABI, signer);
                await honeyToken.approve(ROUTER_ADDRESS, honeyAmount);
                console.log("Approved HONEY tokens");

                // Set slippage tolerance (1%)
                const minHoneyAmount = honeyAmount.mul(99).div(100);
                const minBeraAmount = beraAmount.mul(99).div(100);

                // Set deadline to 20 minutes from now
                const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

                // Add liquidity
                const tx = await router.addLiquidity(
                    BERA,
                    HONEY, // token address
                    honeyAmount, // token amount
                    minHoneyAmount, // min token amount
                    minBeraAmount, // min ETH amount
                    signer.address, // recipient
                    deadline, // deadline
                    { value: beraAmount } // BERA value to add
                );

                console.log("Adding liquidity...");
                const receipt = await tx.wait();
                console.log("Liquidity added! Transaction:", tx.hash);

                // Get pair address and verify reserves
                const FACTORY_ABI = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"];
                const factory = await router.factory();
                const factoryContract = new ethers.Contract(factory, FACTORY_ABI, signer);
                const pairAddress = await factoryContract.getPair(BERA, HONEY);

                const PAIR_ABI = [
                    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
                    "function balanceOf(address owner) external view returns (uint256)"
                ];
                const pair = new ethers.Contract(pairAddress, PAIR_ABI, signer);

                // Get and log reserves
                const reserves = await pair.getReserves();
                console.log("Pool Reserves:");
                console.log("BERA:", ethers.utils.formatEther(reserves[0]));
                console.log("HONEY:", ethers.utils.formatEther(reserves[1]));

                // Get LP tokens balance
                const lpBalance = await pair.balanceOf(signer.address);
                console.log("LP Tokens received:", ethers.utils.formatEther(lpBalance));

                expect(lpBalance).to.be.gt(0);
            } catch (error) {
                console.error("Error details:", error);
                throw error;
            }
        });

        it("Should verify liquidity was added correctly", async function () {
            try {
                // Get pair info using minimal ABI
                const factory = await router.factory();
                const FACTORY_ABI = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"];
                const factoryContract = new ethers.Contract(factory, FACTORY_ABI, signer);
                const pairAddress = await factoryContract.getPair(BERA, HONEY);

                const PAIR_ABI = [
                    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
                    "function balanceOf(address owner) external view returns (uint256)"
                ];
                const pair = new ethers.Contract(pairAddress, PAIR_ABI, signer);

                // Check reserves
                const reserves = await pair.getReserves();
                expect(reserves[0]).to.be.gt(0);
                expect(reserves[1]).to.be.gt(0);

                // Check LP token balance
                const lpBalance = await pair.balanceOf(signer.address);
                expect(lpBalance).to.be.gt(0);

                console.log("Verification successful!");
                console.log("Current reserves:", {
                    BERA: ethers.utils.formatEther(reserves[0]),
                    HONEY: ethers.utils.formatEther(reserves[1])
                });
            } catch (error) {
                console.error("Verification failed:", error);
                throw error;
            }
        });
    });
});
