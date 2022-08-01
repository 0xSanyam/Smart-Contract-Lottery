import { network, ethers } from "hardhat";
import { localChains, networks, BLOCK_CONFIRMATIONS } from "../hardhat-helper";
import { DeployFunction } from "hardhat-deploy/types";
import verify from "../utils/verify";

const VRF_SUB_FUND_Amount = ethers.utils.parseEther("5");

const deployLottery: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    let vrfCoordinatorV2Address, subscriptionId;
    const chainId = network.config.chainId;

    if (localChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_Amount);
    } else {
        vrfCoordinatorV2Address = networks[chainId!]["vrfCoordinator"];
        subscriptionId = networks[chainId!]["subscriptionId"];
    }

    
    // ! --> Non Null assertion operator

    const entryFee = networks[chainId!]["entryFee"];
    const gasLane = networks[chainId!]["gasLane"];
    const callbackGasLimit = networks[chainId!]["callbackGasLimit"];
    const interval = networks[chainId!]["interval"];
    const blockConfirmation = localChains.includes(network.name) ? 1 : BLOCK_CONFIRMATIONS;
    const args: any[] = [
        vrfCoordinatorV2Address,
        entryFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ];
    const lottery = await deploy("lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: blockConfirmation || 1,
    });

    if (!localChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        log("Verifying...");
        await verify(lottery.address, args);
    }

    log("=====================================================");
};

export default deployLottery;
deployLottery.tags = ["all", "lottery"];
