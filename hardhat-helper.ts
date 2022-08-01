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
        name: "hardhat",
        entryFee: ethers.utils.parseEther("0.01"),
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "120",
    },
};

export const localChains = ["hardhat", "localhost"];
export const BLOCK_CONFIRMATIONS = 5;
