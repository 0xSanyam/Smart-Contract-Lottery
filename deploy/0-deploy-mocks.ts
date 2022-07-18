import { network, ethers } from "hardhat";
import { localChains } from "../hardhat-helper";
import {DeployFunction} from "hardhat-deploy/types";

const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 LINK per request (doc)
const GAS_PRICE_LINK = 1e9; // Calculated value (LINK per gas)

const deployMock: DeployFunction = async ({ getNamedAccounts, deployments }) => {
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

        log("You are deploying to a local network, you'll need a local network running to interact");
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        );
        log("=============================================");
    }
};

export default deployMock;
deployMock.tags = ["all", "mocks"];