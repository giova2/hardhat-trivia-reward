// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage or Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("TriviaReward contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTriviaRewardFixture() {
    // Get the ContractFactory and Signers here.
    const TriviaReward = await ethers.getContractFactory("TriviaReward");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call TriviaReward.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    const MAX_CLAIM_TIMES = 5;
    const hardhatTriviaReward = await TriviaReward.deploy(MAX_CLAIM_TIMES);

    await hardhatTriviaReward.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { TriviaReward, hardhatTriviaReward, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.
//
    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatTriviaReward } = await loadFixture(deployTriviaRewardFixture);
      const ownerBalance = await hardhatTriviaReward.triviaRewardBalance();
      expect(await hardhatTriviaReward.triviaRewardBalance()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should reward tokens to account", async function () {
      const { hardhatTriviaReward, addr1 } = await loadFixture(deployTriviaRewardFixture);
      // Transfer 50 tokens from owner to addr1
      const rewardAmount = await hardhatTriviaReward.rewardAmount();
      
      await expect(hardhatTriviaReward.connect(addr1).reward())
        .to.changeTokenBalances(hardhatTriviaReward, [hardhatTriviaReward.address, addr1], [-rewardAmount, rewardAmount]);
    });

    it("should emit Reward events", async function () {
      const { hardhatTriviaReward, addr1 } = await loadFixture(deployTriviaRewardFixture);

      await expect(hardhatTriviaReward.connect(addr1).reward())
        .to.emit(hardhatTriviaReward, "Reward").withArgs(addr1.address)
    });

    // it("Should fail if sender doesn't have enough tokens", async function () {
    //   const { hardhatTriviaReward, addr1 } = await loadFixture(deployTriviaRewardFixture);
    //   const initialOwnerBalance = await hardhatTriviaReward.triviaRewardBalance()

    //   // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    //   // `require` will evaluate false and revert the transaction.
    //   await expect(
    //     hardhatTriviaReward.connect(addr1).reward(addr1.addres)
    //   ).to.be.revertedWith("Not enough tokens");

    //   // Owner balance shouldn't have changed.
    //   expect(await hardhatTriviaReward.balanceOf(addr1.address)).to.equal(
    //     initialOwnerBalance
    //   );
    // });
  });
});
