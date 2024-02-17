//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// This is the main building block for smart contracts.
contract TriviaReward {
    // Some string type variables to identify the token.
    string public name = "Hardhat Trivia Reward";
    string public symbol = "HTR";

    uint256 private totalSupply = 1000000;
    uint256 private rewardTokenAmount = 1;
    uint16 private maxClaimTimes = 5; // it is the maximum number of times that the user can claim the reward

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) private balances;
    mapping(address => uint16) private hasAnsweredCorrectly;

    // The Reward event helps off-chain aplications understand
    // what happens within your contract.
    event Reward(address indexed _to);

    /**
     * Contract initialization.
     */

    constructor(uint16 _maxClaimTimes) {
        maxClaimTimes = _maxClaimTimes;
        balances[address(this)] = totalSupply;
    }

    /**
     * A function to reward tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function reward() external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(
            hasAnsweredCorrectly[msg.sender] < maxClaimTimes,
            "You've already provided the correct answers the maximum number of times allowed."
        );
        require(totalSupply >= rewardTokenAmount, "Not enough supply");

        // Reward the amount.
        balances[address(this)] -= rewardTokenAmount;
        balances[msg.sender] += rewardTokenAmount;

        // set the flag of reward claimed too true
        hasAnsweredCorrectly[msg.sender] += 1;

        // Notify off-chain applications of the transfer.
        emit Reward(msg.sender);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function rewardAmount() external view returns (uint256) {
        return rewardTokenAmount;
    }

    function triviaRewardBalance() external view returns (uint256) {
        return balances[address(this)];
    }

    function canReceiveReward() external view returns (bool) {
        return hasAnsweredCorrectly[msg.sender] < maxClaimTimes;
    }

    function quatityOfSuccessfullClaims() external view returns (uint16) {
        return hasAnsweredCorrectly[msg.sender];
    }

    function claimTimesLimit() external view returns (uint16) {
        return maxClaimTimes;
    }
}
