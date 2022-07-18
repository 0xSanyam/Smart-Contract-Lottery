const { assert, expect } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { localChains, networks } = require("../../hardhat-helper");

localChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Staging Test", () => {
          let lottery, deployer, lotteryEntryFee;

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              lottery = await ethers.getContract("lottery", deployer);
              lotteryEntryFee = await lottery.getEntryFee();
          });

          describe("fulfillRandomWords", () => {
              it("Works with live Chainlink Keepers and VRF, we get a random winner", async () => {
                  const startingTimeStamp = await lottery.getLatesTimeStamp();
                  const accounts = await ethers.getSigners();

                  await new Promise(async (resolve, reject) => {
                      lottery.once("WinnerPicked", async () => {
                          console.log("Winner Picked!");
                          try {
                              const winner = await lottery.getWinner();
                              console.log(winner);

                              const lotteryState = await lottery.getLotteryState();
                              const winnerEndingBalance = await accounts[0].getBalance();
                              const endingTimeStamp = await lottery.getLatesTimeStamp();

                              await expect(lottery.getPlayer(0)).to.be.reverted;
                              assert.equal(winner.toString(), accounts[0].address);
                              assert.equal(lotteryState.toString(), "0");
                              assert(endingTimeStamp > startingTimeStamp);
                              //   assert.equal(
                              //       winnerEndingBalance.toString(),
                              //       winnerStartingBalance.add(lotteryEntryFee).toString()
                              //   );
                          } catch (err) {
                              console.log(err);
                              reject(err);
                          }
                          resolve();
                      });
                      await lottery.enterLottery({ value: lotteryEntryFee });
                      const winnerStartingBalance = await accounts[0].getBalance();
                  });
              });
          });
      });
