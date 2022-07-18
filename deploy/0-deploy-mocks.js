const { network, ethers } = require("hardhat");
const { localChains } = require("../hardhat-helper");

const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 LINK per request (doc)
const GAS_PRICE_LINK = 1e9; // Calculated value (LINK per gas)

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (localChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");

        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        });
        log("Mocks Deployed!");
        log("=============================================");
    }
};

module.exports.tags = ["all", "mocks"];
