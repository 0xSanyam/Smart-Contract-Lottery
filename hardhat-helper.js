const { ethers } = require("hardhat");

const networks = {
    default: {
        name: "hardhat",
    },
    80001: {
        name: "matic",
        vrfCoordinator: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
        entryFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        subscriptionId: "YOUR_SUBSCRIPTION_ID",
        callbackGasLimit: "500000",
        interval: "300",
    },
    31337: {
        name: "localhost",
        entryFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        callbackGasLimit: "500000",
        interval: "120",
    },
};

const localChains = ["hardhat", "localhost"];

module.exports = {
    networks,
    localChains,
};
