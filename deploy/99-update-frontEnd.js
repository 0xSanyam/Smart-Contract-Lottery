const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESS_LOC = "../lottery/constants/contractAddress.json";
const FRONT_END_ABI_LOC = "../lottery/constants/abi.json";

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating Front End");
        await updateContractAddress();
        await updateAbi();
    }
};

async function updateContractAddress() {
    const lottery = await ethers.getContract("lottery");
    const chainId = network.config.chainId.toString();
    const currentAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_LOC, "utf8"));
    if (chainId in currentAddress) {
        if (!currentAddress[chainId].includes(lottery.address)) {
            currentAddress[chainId].push(lottery.address);
        }
    } else {
        currentAddress[chainId] = [lottery.address];
    }

    fs.writeFileSync(FRONT_END_ADDRESS_LOC, JSON.stringify(currentAddress));
}

async function updateAbi() {
    const lottery = await ethers.getContract("lottery");
    fs.writeFileSync(FRONT_END_ABI_LOC, lottery.interface.format(ethers.utils.FormatTypes.json));
}

module.exports.tags = ["all", "frontend"];
