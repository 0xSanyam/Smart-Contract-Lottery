const { network, ethers } = require("hardhat");
const { localChains, networks } = require("../hardhat-helper");
const { verify } = require("../utils/verify");

const VRF_SUB_FUND_Amount = ethers.utils.parseEther("5");

module.exports = async function ({ getNamedAccounts, deployments }) {
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
        vrfCoordinatorV2Address = networks[chainId]["vrfCoordinator"];
        subscriptionId = networks[chainId]["subscriptionId"];
    }

    const entryFee = networks[chainId]["entryFee"];
    const gasLane = networks[chainId]["gasLane"];
    const callbackGasLimit = networks[chainId]["callbackGasLimit"];
    const interval = networks[chainId]["interval"];
    const args = [
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
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (!localChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        log("Verifying...");
        await verify(lottery.address, args);
    }

    log("=====================================================");
};

module.exports.tags = ["all", "lottery"];
