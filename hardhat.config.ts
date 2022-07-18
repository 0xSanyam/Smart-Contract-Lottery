import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "dotenv/config";
import "solidity-coverage";
import "hardhat-deploy";
import "solidity-coverage";
import { HardhatUserConfig } from "hardhat/config";

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CURR_API = process.env.COINMARKETCAP_API_KEY!;
const API_KEY = process.env.ETHERSCAN_API_KEY!;

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        rinkeby: {
            chainId: 4,
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
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
    etherscan: {
        apiKey: API_KEY,
    },
    gasReporter: {
        enabled: false,
        currency: "INR",
        coinmarketcap: CURR_API,
        outputFile: "gas-report.txt",
        noColors: true,
    },
    mocha: {
        timeout: 300000, // 300 seconds
    },
};

export default config;