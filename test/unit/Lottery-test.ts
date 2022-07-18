import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { localChains, networks } from "../../hardhat-helper";
import { Lottery, VRFCoordinatorV2Mock } from "../../typechain-types";

!localChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Unit Test", () => {
          let lottery: Lottery; 
          let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock; 
          let accounts: SignerWithAddress[];
          let player: SignerWithAddress;
          let lotteryEntryFee: BigNumber;
          let interval: number;
          const chainId = network.config.chainId;

          beforeEach(async () => {
              accounts = await ethers.getSigners();
              // account[0] --> deployer
              player = accounts[1];
              await deployments.fixture(["all"]);
              lottery = await ethers.getContract("lottery", player);
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", player);
              lotteryEntryFee = await lottery.getEntryFee();
              interval = (await lottery.getInterval()).toNumber();
          });

          describe("constructor", () => {
              it("Initializes the lottery", async () => {
                  const lotteryState = await lottery.getLotteryState();
                  assert.equal(lotteryState.toString(), "0");
                  assert.equal(interval.toString(), networks[chainId!]["interval"]);
              });
          });

          describe("Enter Lottery", () => {
              it("Checks entrance fee", async () => {
                  await expect(lottery.enterLottery()).to.be.revertedWith("Lottery__NotEnoughEth");
              });
              it("Doesn't allow entry when lottery is closed", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);
                  // Pretending to be a chainlink keeper
                  await lottery.performUpkeep([]);

                  await expect(lottery.enterLottery({ value: lotteryEntryFee })).to.be.revertedWith(
                      "Lottery__Closed"
                  );
              });
              it("Makes a list of players", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  const owner = await lottery.getPlayer(0);
                  assert.equal(owner, player.address.toString());
              });
              it("Emits event on entry", async () => {
                  await expect(lottery.enterLottery({ value: lotteryEntryFee })).to.emit(
                      lottery,
                      "LotteryEnter"
                  );
              });
          });

          describe("checkUpKeep", () => {
              it("Returns false if there is no Eth", async () => {
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);

                  const { upkeepRequired } = await lottery.callStatic.checkUpkeep([]);
                  assert(!upkeepRequired);
              });
              it("Returns false if lottery is closed", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);

                  await lottery.performUpkeep([]);

                  const lotteryState = await lottery.getLotteryState();
                  const { upkeepRequired } = await lottery.callStatic.checkUpkeep("0x");
                  assert.equal(lotteryState.toString(), "1");
                  assert.equal(upkeepRequired, false);
              });
              it("Returns false if interval is not passed", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval - 1]);
                  await network.provider.request({ method: "evm_mine", params: [] });
                  const { upkeepRequired } = await lottery.callStatic.checkUpkeep("0x");
                  assert(!upkeepRequired);
              });
              it("Returns true if lottery is open, interval has passed, has players and has Eth", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);
                  const { upkeepRequired } = await lottery.callStatic.checkUpkeep("0x");
                  assert(upkeepRequired);
              });
          });

          describe("performUpKeep", () => {
              it("Runs only if checkUpKeep is true", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);

                  const tx = await lottery.performUpkeep("0x");
                  assert(tx);
              });
              it("Reverts when checkUpKeep is false", async () => {
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);

                  await expect(lottery.performUpkeep("0x")).to.be.revertedWith("Lottery__NoUpKeep");
              });
              it("Updates the lottery state, emits an event and calls the vrf coordinator", async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);
                  const txResponse = await lottery.performUpkeep("0x");
                  const txReceipt = await txResponse.wait(1);
                  const lotteryState = await lottery.getLotteryState();

                  const requestId = txReceipt!.events![1].args!.requestId;
                  assert(requestId.toNumber() > 0);
                  assert(lotteryState.toString() == "1");
              });
          });

          describe("fulfillRandomWords", () => {
              beforeEach(async () => {
                  await lottery.enterLottery({ value: lotteryEntryFee });
                  await network.provider.send("evm_increaseTime", [interval + 1]);
                  await network.provider.send("evm_mine", []);
              });
              it("Can only be called after performUpKeep", async () => {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, lottery.address)
                  ).to.be.revertedWith("nonexistent request");
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, lottery.address)
                  ).to.be.revertedWith("nonexistent request");
              });
              it("Picks a winner, resets the lottery and sends money", async () => {
                  const additionalEntrants = 4;
                  const accountStartingIndex = 1; // deployer -- 0
                  for (
                      let i = accountStartingIndex;
                      i < accountStartingIndex + additionalEntrants;
                      i++
                  ) {
                      const accountsConnected = lottery.connect(accounts[i]);
                      await accountsConnected.enterLottery({ value: lotteryEntryFee });
                  }
                  const startingTimeStamp = await lottery.getLatesTimeStamp();

                  await new Promise<void>(async (resolve, reject) => {
                      lottery.once("WinnerPicked", async () => {
                          console.log("Winner Picked!");
                          try {
                              const winner = await lottery.getWinner();
                              console.log(winner);

                              const lotteryState = await lottery.getLotteryState();
                              const players = await lottery.getNumberOfPlayers();
                              const endingTimeStamp = await lottery.getLatesTimeStamp();
                              const winnerEndingBalance = await accounts[1].getBalance();

                              assert.equal(lotteryState.toString(), "0");
                              assert.equal(players.toString(), "0");
                              assert(endingTimeStamp > startingTimeStamp);

                            //   assert.equal(
                            //       winnerEndingBalance.toString(),
                            //       winnerStartingBalance.add(
                            //           lotteryEntryFee
                            //               .add(lotteryEntryFee.mul(additionalEntrants))
                            //       ).toString()
                            //   );

                              resolve();
                          } catch (err) {
                              reject(err);
                          }
                      });
                      // Mocking Chainlink Keepers
                      const tx = await lottery.performUpkeep("0x");
                      const txReceipt = await tx.wait(1);
                      const winnerStartingBalance = await accounts[1].getBalance();

                      // Mocking Chainlink VRF
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt!.events![1].args!.requestId,
                          lottery.address
                      );
                  });
              });
          });
      });
