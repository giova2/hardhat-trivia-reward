require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
// Metamask testing account in Branve testing profile
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.ALCHEMY_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
