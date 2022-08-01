/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CURR_API = process.env.COINMARKETCAP_API_KEY;
const API_KEY = process.env.POLYGONSCAN_API_KEY;

module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        matic: {
            chainId: 80001,
            blockConfirmations: 5,
            url: POLYGON_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
        player: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "INR",
        coinmarketcap: CURR_API,
        outputFile: "gas-report.txt",
        noColors: true,
        token: "MATIC",
    },
    contractSizer: {
        runOnCompile: false,
        only: ["lottery"],
    },
    mocha: {
        timeout: 300000, // 300 seconds
    },
};
