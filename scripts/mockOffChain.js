const { ethers, network } = require("hardhat");

async function mockKeepers() {
    const lottery = await ethers.getContract("lottery");
    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));

    const tx = await lottery.performUpkeep(checkData);
    const txReceipt = await tx.wait(1);
    const requestId = txReceipt.events[1].args.requestId;
    console.log(`Performed upkeep with RequestId: ${requestId}`);
    if (network.config.chainId == 31337) {
        await mockVrf(requestId, lottery);
    }
}

async function mockVrf(requestId, lottery) {
    console.log("We on a local network? Ok let's pretend...");
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, lottery.address);
    console.log("Responded!");
    const winner = await lottery.getWinner();
    console.log(`The winner is: ${winner}`);
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
