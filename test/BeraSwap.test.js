const { expect } = require("chai");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("BeraSwap Liquidity Tests", function () {
    let router, signer, provider, honeyToken;

    // BeraChain Configuration
    const BERA_RPC = process.env.URL;
    const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS; // Địa chỉ router đã deploy
    
    // Token addresses
    const WBERA = "0x6969696969696969696969696969696969696969"; // Token native BERA
    const HONEY = "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce"; // Token HONEY đã deploy

    // ABI cho HONEY token (bạn cần thay thế ABI chính xác của hợp đồng)
    const HONEY_ABI = [
        {
          "type": "constructor",
          "inputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "DEFAULT_ADMIN_ROLE",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "DOMAIN_SEPARATOR",
          "inputs": [],
          "outputs": [
            {
              "name": "result",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "UPGRADE_INTERFACE_VERSION",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "string",
              "internalType": "string"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "allowance",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "spender",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {
              "name": "spender",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "burn",
          "inputs": [
            {
              "name": "from",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "decimals",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint8",
              "internalType": "uint8"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "factory",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "getRoleAdmin",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "grantRole",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "account",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "hasRole",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "account",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "initialize",
          "inputs": [
            {
              "name": "_governance",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "_factory",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "mint",
          "inputs": [
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "name",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "string",
              "internalType": "string"
            }
          ],
          "stateMutability": "pure"
        },
        {
          "type": "function",
          "name": "nonces",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "permit",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "spender",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "value",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "deadline",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "v",
              "type": "uint8",
              "internalType": "uint8"
            },
            {
              "name": "r",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "s",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "proxiableUUID",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "renounceRole",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "callerConfirmation",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "revokeRole",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "account",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "supportsInterface",
          "inputs": [
            {
              "name": "interfaceId",
              "type": "bytes4",
              "internalType": "bytes4"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "symbol",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "string",
              "internalType": "string"
            }
          ],
          "stateMutability": "pure"
        },
        {
          "type": "function",
          "name": "totalSupply",
          "inputs": [],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "transfer",
          "inputs": [
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "transferFrom",
          "inputs": [
            {
              "name": "from",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "upgradeToAndCall",
          "inputs": [
            {
              "name": "newImplementation",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "data",
              "type": "bytes",
              "internalType": "bytes"
            }
          ],
          "outputs": [],
          "stateMutability": "payable"
        },
        {
          "type": "event",
          "name": "Approval",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "spender",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "Initialized",
          "inputs": [
            {
              "name": "version",
              "type": "uint64",
              "indexed": false,
              "internalType": "uint64"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "RoleAdminChanged",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "indexed": true,
              "internalType": "bytes32"
            },
            {
              "name": "previousAdminRole",
              "type": "bytes32",
              "indexed": true,
              "internalType": "bytes32"
            },
            {
              "name": "newAdminRole",
              "type": "bytes32",
              "indexed": true,
              "internalType": "bytes32"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "RoleGranted",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "indexed": true,
              "internalType": "bytes32"
            },
            {
              "name": "account",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "sender",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "RoleRevoked",
          "inputs": [
            {
              "name": "role",
              "type": "bytes32",
              "indexed": true,
              "internalType": "bytes32"
            },
            {
              "name": "account",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "sender",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "Transfer",
          "inputs": [
            {
              "name": "from",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "to",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "Upgraded",
          "inputs": [
            {
              "name": "implementation",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            }
          ],
          "anonymous": false
        },
        {
          "type": "error",
          "name": "AccessControlBadConfirmation",
          "inputs": []
        },
        {
          "type": "error",
          "name": "AccessControlUnauthorizedAccount",
          "inputs": [
            {
              "name": "account",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "neededRole",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ]
        },
        {
          "type": "error",
          "name": "AddressEmptyCode",
          "inputs": [
            {
              "name": "target",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "AllowanceOverflow",
          "inputs": []
        },
        {
          "type": "error",
          "name": "AllowanceUnderflow",
          "inputs": []
        },
        {
          "type": "error",
          "name": "AmountOutOfRange",
          "inputs": []
        },
        {
          "type": "error",
          "name": "AssetIsBadCollateral",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "AssetIsNotBadCollateral",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "AssetNotRegistered",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "ERC1967InvalidImplementation",
          "inputs": [
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "ERC1967NonPayable",
          "inputs": []
        },
        {
          "type": "error",
          "name": "ExceedGlobalCap",
          "inputs": []
        },
        {
          "type": "error",
          "name": "ExceedRelativeCap",
          "inputs": []
        },
        {
          "type": "error",
          "name": "FailedCall",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InsufficientAllowance",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InsufficientAssets",
          "inputs": [
            {
              "name": "assets",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "shares",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "type": "error",
          "name": "InsufficientBalance",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InsufficientRecapitalizeAmount",
          "inputs": [
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "type": "error",
          "name": "InvalidInitialization",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InvalidPermit",
          "inputs": []
        },
        {
          "type": "error",
          "name": "LiquidationDisabled",
          "inputs": []
        },
        {
          "type": "error",
          "name": "LiquidationWithReferenceCollateral",
          "inputs": []
        },
        {
          "type": "error",
          "name": "MismatchedOwner",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "expectedOwner",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "NotFactory",
          "inputs": []
        },
        {
          "type": "error",
          "name": "NotInitializing",
          "inputs": []
        },
        {
          "type": "error",
          "name": "NotPegged",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "OverOneHundredPercentRate",
          "inputs": [
            {
              "name": "rate",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "type": "error",
          "name": "PermitExpired",
          "inputs": []
        },
        {
          "type": "error",
          "name": "RecapitalizeNotNeeded",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "TotalSupplyOverflow",
          "inputs": []
        },
        {
          "type": "error",
          "name": "UUPSUnauthorizedCallContext",
          "inputs": []
        },
        {
          "type": "error",
          "name": "UUPSUnsupportedProxiableUUID",
          "inputs": [
            {
              "name": "slot",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ]
        },
        {
          "type": "error",
          "name": "UnauthorizedCaller",
          "inputs": [
            {
              "name": "caller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "expectedCaller",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "UnderNinetyEightPercentRate",
          "inputs": [
            {
              "name": "rate",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "type": "error",
          "name": "UnexpectedBasketModeStatus",
          "inputs": []
        },
        {
          "type": "error",
          "name": "VaultAlreadyRegistered",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        },
        {
          "type": "error",
          "name": "VaultPaused",
          "inputs": []
        },
        {
          "type": "error",
          "name": "ZeroAddress",
          "inputs": []
        },
        {
          "type": "error",
          "name": "ZeroAmount",
          "inputs": []
        },
        {
          "type": "error",
          "name": "ZeroWeight",
          "inputs": [
            {
              "name": "asset",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ];
    const WBERA_ABI = [
        {
          "type": "receive",
          "stateMutability": "payable"
        },
        {
          "type": "function",
          "name": "DOMAIN_SEPARATOR",
          "inputs": [],
          "outputs": [
            {
              "name": "result",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "allowance",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "spender",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {
              "name": "spender",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "decimals",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint8",
              "internalType": "uint8"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "deposit",
          "inputs": [],
          "outputs": [],
          "stateMutability": "payable"
        },
        {
          "type": "function",
          "name": "name",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "string",
              "internalType": "string"
            }
          ],
          "stateMutability": "pure"
        },
        {
          "type": "function",
          "name": "nonces",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            }
          ],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "permit",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "spender",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "value",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "deadline",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "v",
              "type": "uint8",
              "internalType": "uint8"
            },
            {
              "name": "r",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "s",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "symbol",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "string",
              "internalType": "string"
            }
          ],
          "stateMutability": "pure"
        },
        {
          "type": "function",
          "name": "totalSupply",
          "inputs": [],
          "outputs": [
            {
              "name": "result",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "transfer",
          "inputs": [
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "transferFrom",
          "inputs": [
            {
              "name": "from",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "bool",
              "internalType": "bool"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "withdraw",
          "inputs": [
            {
              "name": "amount",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "event",
          "name": "Approval",
          "inputs": [
            {
              "name": "owner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "spender",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "Deposit",
          "inputs": [
            {
              "name": "from",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "Transfer",
          "inputs": [
            {
              "name": "from",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "to",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        },
        {
          "type": "event",
          "name": "Withdrawal",
          "inputs": [
            {
              "name": "to",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        },
        {
          "type": "error",
          "name": "AllowanceOverflow",
          "inputs": []
        },
        {
          "type": "error",
          "name": "AllowanceUnderflow",
          "inputs": []
        },
        {
          "type": "error",
          "name": "ETHTransferFailed",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InsufficientAllowance",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InsufficientBalance",
          "inputs": []
        },
        {
          "type": "error",
          "name": "InvalidPermit",
          "inputs": []
        },
        {
          "type": "error",
          "name": "PermitExpired",
          "inputs": []
        },
        {
          "type": "error",
          "name": "TotalSupplyOverflow",
          "inputs": []
        }
      ];
    before(async function () {
        provider = new ethers.providers.JsonRpcProvider(BERA_RPC);

        const privateKey = process.env.PRIVATE_KEY;
        signer = new ethers.Wallet(privateKey, provider);

        router = await ethers.getContractAt("IBeraSwapRouter", ROUTER_ADDRESS, signer);

        honeyToken = new ethers.Contract(HONEY, HONEY_ABI, signer);
        wberaToken = new ethers.Contract(WBERA, WBERA_ABI, signer);
    });

    describe("Add Liquidity", function () {
        it("Should mint, approve HONEY and add WBERA-HONEY liquidity", async function () {
            const honeyAmount = ethers.utils.parseEther("10"); // 10 HONEY
            const beraAmount = ethers.utils.parseEther("1"); // 0.01 BERA

            try {
                // 1️⃣ Mint HONEY token
                console.log("🚀 Minting HONEY tokens...");
                const mintTx = await honeyToken.mint(signer.address, honeyAmount);
                await mintTx.wait();
                console.log("✅ Minted 10 HONEY tokens");

                // 2️⃣ Wrap BERA thành WBERA
                console.log("🚀 Wrapping BERA to WBERA...");
                const wrapTx = await wberaToken.deposit({ value: beraAmount });
                await wrapTx.wait();
                console.log("✅ Wrapped BERA to WBERA");

                // 3️⃣ Approve HONEY
                console.log("🚀 Approving HONEY tokens for Router...");
                const approveHoneyTx = await honeyToken.approve(ROUTER_ADDRESS, honeyAmount);
                await approveHoneyTx.wait();
                console.log("✅ Approved HONEY tokens");

                // 4️⃣ Approve WBERA
                console.log("🚀 Approving WBERA tokens for Router...");
                const approveWberaTx = await wberaToken.approve(ROUTER_ADDRESS, beraAmount);
                await approveWberaTx.wait();
                console.log("✅ Approved WBERA tokens");
                
                const honeyBalance = await honeyToken.balanceOf(signer.address);
                const wberaBalance = await wberaToken.balanceOf(signer.address);
                console.log(`HONEY Balance: ${ethers.utils.formatEther(honeyBalance)}`);
                console.log(`WBERA Balance: ${ethers.utils.formatEther(wberaBalance)}`);
                
                // 5️⃣ Xác định trượt giá (slippage)
                const minHoneyAmount = honeyAmount.mul(99).div(100);
                const minBeraAmount = beraAmount.mul(99).div(100);

                // 6️⃣ Thiết lập deadline (20 phút)
                const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

                // 7️⃣ Gọi addLiquidity với WBERA thay vì BERA
                console.log("🚀 Adding liquidity...");
                const tx = await router.addLiquidity(
                    WBERA,
                    HONEY,
                    beraAmount, // 🛑 Đã wrap thành WBERA
                    honeyAmount,
                    minBeraAmount,
                    minHoneyAmount,
                    signer.address,
                    deadline,
                    { gasLimit: 3000000 }
                );

                const receipt = await tx.wait();
                console.log("✅ Liquidity added! Transaction:", tx.hash);

                expect(receipt.status).to.equal(1);
            } catch (error) {
                console.error("❌ Error details:", error);
                throw error;
            }
        });
    });
});
