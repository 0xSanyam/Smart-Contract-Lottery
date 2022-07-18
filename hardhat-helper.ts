import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export interface networkItem {
    name?:string,
    vrfCoordinator?: string,
    entryFee?: BigNumber,
    gasLane?: string,
    subscriptionId?: string,
    callbackGasLimit?: string,
    interval?: string
};

export interface networkInfo {
    [key: number]: networkItem
};

export const networks: networkInfo = {
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

export const localChains = ["hardhat", "localhost"];
export const BLOCK_CONFIRMATIONS = 5;