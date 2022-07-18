const { ethers } = require("hardhat");

const networks = {
    4: {
        name: "rinkeby",
        vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        entryFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subscriptionId: "YOUR_SUBSCRIPTIONID",
        callbackGasLimit: "500000",
        interval: "300",
    },
    31337: {
        name: "hardhat",
        entryFee: ethers.utils.parseEther("500"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "120",
    },
};

const localChains = ["hardhat", "localhost"];

module.exports = {
    networks,
    localChains,
};
