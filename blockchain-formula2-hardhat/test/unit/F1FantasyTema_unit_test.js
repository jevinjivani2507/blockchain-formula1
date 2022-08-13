const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { numToBytes32 } = require("@chainlink/test-helpers/dist/src/helpers")
const validTeams = require("../validTeams.json")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("F1FantacyTeam Unit Tests", async function () {
          let apiConsumer, linkToken, mockOracle, account, joiningFees, deployer, validTeam, user

          beforeEach(async () => {
              deployer = (await ethers.getSigners())[0].address
              user = (await ethers.getSigners())[1].address
              const chainId = network.config.chainId
              await deployments.fixture(["mocks", "f1"])
              linkToken = await ethers.getContract("LinkToken")
              linkTokenAddress = linkToken.address
              additionalMessage = ` --linkaddress  ${linkTokenAddress}`
              f1FantacyTeam = await ethers.getContract("F1FantacyTeam")
              mockOracle = await ethers.getContract("MockOracle")
              joiningFees = await f1FantacyTeam.JOININGFEES()

              validTeam = {
                  name: "F1FantacyTeam1",
                  player: deployer,
                  d1: 23,
                  d2: 14,
                  d3: 77,
                  d4: 10,
                  d5: 6,
                  team: "alfa",
                  captain: 23,
              }

              await hre.run("fund-link", {
                  contract: f1FantacyTeam.address,
                  linkaddress: linkTokenAddress,
              })
          })

          it("Should fail if sufficient amount not provided", async () => {
              await expect(
                  f1FantacyTeam.participate(validTeam, {
                      value: joiningFees.sub("1"),
                  })
              ).to.be.revertedWith("F1FantacyTeam__InSufficientFund")
          })

          it("Should fail if timelimit exceeded", async () => {
              await network.provider.send("evm_setNextBlockTimestamp", [166160800])
              await network.provider.send("evm_mine")

              await expect(
                  f1FantacyTeam.participate(validTeam, {
                      value: joiningFees.sub("1"),
                  })
              ).to.be.revertedWith("F1FantacyTeam__TimelimitExceeded")
          })

          it("Should fail if invalid team provided", async () => {
              const invalidTeam = {
                  name: "F1FantacyInvalidTeam1",
                  player: deployer,
                  d1: 14,
                  d2: 33,
                  d3: 31,
                  d4: 47,
                  d5: 10,
                  team: "ferrari",
                  captain: 23,
              }

              await expect(
                  f1FantacyTeam.participate(invalidTeam, {
                      value: joiningFees,
                  })
              ).to.be.revertedWith("F1FantacyTeam__InvalidTeam")
          })

          it("Should successfully register player", async () => {
              const transaction = await f1FantacyTeam.participate(validTeam, {
                  value: joiningFees,
              })
              const transactionReceipt = await transaction.wait(1)
              const player = transactionReceipt.events[0].args.player
              const fantacyTeam = transactionReceipt.events[0].args.fantacyTeam

              const returnedTeam = JSON.parse(
                  JSON.stringify({
                      name: fantacyTeam.name,
                      player: fantacyTeam.player,
                      d1: fantacyTeam.d1,
                      d2: fantacyTeam.d2,
                      d3: fantacyTeam.d3,
                      d4: fantacyTeam.d4,
                      d5: fantacyTeam.d5,
                      team: fantacyTeam.team,
                      captain: fantacyTeam.captain,
                  })
              )

              expect(returnedTeam).to.deep.equal(JSON.parse(JSON.stringify(validTeam)))
              assert.equal(deployer, player)
          })

          //   it("testing", async () => {
          //       console.log(validTeams)
          //   })
          describe("F1FantacyTeam Data Request Unit Tests", async function () {
              let accounts

              beforeEach(async () => {
                  accounts = await ethers.getSigners()

                  validTeams.forEach(async (team, idx) => {
                      team.player = accounts[idx].address
                      await f1FantacyTeam.participate(team, { value: joiningFees })
                  })
              })

              it("Should successfully make an API request to get winners and distribute rewards", async () => {
                  const firstInitBalance = await ethers.provider.getBalance(accounts[2].address)
                  const secondInitBalance = await ethers.provider.getBalance(accounts[1].address)
                  const thirdInitBalance = await ethers.provider.getBalance(accounts[3].address)
                  let balance = await f1FantacyTeam.getBalance()

                  const transaction = await f1FantacyTeam.requestWinners()
                  const transactionReceipt = await transaction.wait(1)
                  const requestId = transactionReceipt.events[0].topics[1]
                  const inputWinners = {
                      winner1: accounts[2].address,
                      winner2: accounts[1].address,
                      winner3: accounts[3].address,
                  }
                  const abiCoder = ethers.utils.defaultAbiCoder
                  const callbackValue = abiCoder.encode(
                      ["bytes32", "address", "address", "address", "bool"],
                      [
                          requestId,
                          inputWinners.winner1,
                          inputWinners.winner2,
                          inputWinners.winner3,
                          true,
                      ]
                  )
                  const tx = await mockOracle.fulfillOracleRequest2(requestId, callbackValue)

                  //   console.log("First : ", accounts[2].address, " ", await f1FantacyTeam.first())
                  //   console.log("Second : ", accounts[1].address, " ", await f1FantacyTeam.second())
                  //   console.log("Third : ", accounts[3].address, " ", await f1FantacyTeam.third())
                  //   const outputWinners = JSON.parse(JSON.stringify(await f1FantacyTeam.winners()))
                  //   console.log(outputWinners)
                  assert.equal(inputWinners.winner1.toString(), await f1FantacyTeam.first())
                  assert.equal(inputWinners.winner2.toString(), await f1FantacyTeam.second())
                  assert.equal(inputWinners.winner3.toString(), await f1FantacyTeam.third())

                  const firstNewBalance = await ethers.provider.getBalance(accounts[2].address)
                  const secondNewBalance = await ethers.provider.getBalance(accounts[1].address)
                  const thirdNewBalance = await ethers.provider.getBalance(accounts[3].address)

                  assert.equal(
                      ethers.utils.formatEther(firstNewBalance.sub(firstInitBalance)),
                      ethers.utils.formatEther(balance.div(2))
                  )

                  balance = balance.sub(balance.div(2))
                  assert.equal(
                      ethers.utils.formatEther(secondNewBalance.sub(secondInitBalance)),
                      ethers.utils.formatEther(balance.mul(6).div(10))
                  )

                  balance = balance.sub(balance.mul(6).div(10))
                  assert.equal(
                      ethers.utils.formatEther(thirdNewBalance.sub(thirdInitBalance)),
                      ethers.utils.formatEther(balance)
                  )
              })
          })
      })
