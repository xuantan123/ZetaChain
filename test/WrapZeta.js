const { ethers } = require("ethers");
require("dotenv").config();

// Cấu hình
const PRIVATE_KEY = process.env.PRIVATE_KEY; // 🔑 Thay bằng private key của bạn
const RPC_URL = process.env.URL; // 🔗 RPC network của bạn
const WBERA_CONTRACT = "0x5F0b1a82749cb4E2278EC87F8BF6B618dC71a8bf"; // 🎯 Contract WBERA

// Khởi tạo provider và signer
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Gọi hàm deposit để wrap BERA thành WBERA
async function wrapBERA(amount) {
    const wbera = new ethers.Contract(
        WBERA_CONTRACT,
        [
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "address"
                },
                {
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "allowance",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "guy",
                  "type": "address"
                },
                {
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [
                {
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "decimals",
              "outputs": [
                {
                  "name": "",
                  "type": "uint8"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [],
              "name": "deposit",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "dst",
                  "type": "address"
                },
                {
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "transfer",
              "outputs": [
                {
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "src",
                  "type": "address"
                },
                {
                  "name": "dst",
                  "type": "address"
                },
                {
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "transferFrom",
              "outputs": [
                {
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "withdraw",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "name": "src",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "name": "guy",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "Approval",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "name": "dst",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "Deposit",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "name": "src",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "name": "dst",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "name": "src",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "name": "wad",
                  "type": "uint256"
                }
              ],
              "name": "Withdrawal",
              "type": "event"
            },
            {
              "type": "fallback"
            }
          ],
        wallet
    );

    const tx = await wbera.deposit({ value: ethers.utils.parseEther(amount) });
    console.log(`🔄 Đang wrap ${amount} BERA thành WBERA...`);
    await tx.wait();
    console.log("✅ Wrap thành công!");
}

// Chạy wrap 1 BERA
wrapBERA("3.0").catch(console.error);
