const { ethers } = require("hardhat");

async function enterLottery() {
    const lottery = await ethers.getContract("lottery");
    const entryFee = await lottery.getEntryFee();
    await lottery.enterLottery({ value: entryFee + 1 });
    console.log("Entered!");
}

enterLottery()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
