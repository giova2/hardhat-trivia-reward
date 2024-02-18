import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TriviaRewardArtifact from "../contracts/TriviaReward.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { Col, Divider, Flex, Row } from 'antd';
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { NoTokensMessage } from "./NoTokensMessage";
import { NoWalletDetected } from "./NoWalletDetected";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { Trivia } from "./Trivia";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import Header from './Header'
import { MyTitle } from "./MyTypography";

const DEFAULT_NETWORK_ID = process.env.REACT_APP_NETWORK_ID.toString();

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      triviaRewardBalance: undefined,
      canReceiveReward: true,
      quatityOfSuccessfullClaims: 0,
      claimTimesLimit: 0,
      disableClaimReward: false,
      resetTrivia: 0,
      
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install a wallet.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <Flex justify="center" align="center" vertical>
          <MyTitle level={2}>
            {process.env.REACT_APP_TITLE}
          </MyTitle>
          <ConnectWallet 
            connectWallet={() => this._connectWallet()} 
            networkError={this.state.networkError}
            dismiss={() => this._dismissNetworkError()}
          />
        </Flex>
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance) {
      return (
        <Flex justify="center" align="center" vertical style={{height: '100vh'}}>
          <Loading />
        </Flex>
      );
    }

    // If everything is loaded, we render the application.
    return (
      <Row >
        <Col span={24}>
          <Header
            title={`${this.state.tokenData.name} (${this.state.tokenData.symbol})`}
            subtitle={<>Welcome <b>{this.state.selectedAddress}</b>, <br/>you have{" "}
            <b>
              {this.state.balance.toString()} {this.state.tokenData.symbol}
            </b>
            .</>}
            quatityOfSuccessfullClaims={this.state.quatityOfSuccessfullClaims}
            claimTimesLimit={this.state.claimTimesLimit}
          />
          <Divider style={{background: '#ffffff99'}} />
          <Flex justify="center" align="center" wrap="wrap" vertical>
            {/* 
              Sending a transaction isn't an immediate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={()=> this._dismissTransactionError()}
              />
              )}
          </Flex>
          
          <Flex justify="center" align="center" wrap="wrap" vertical>
            {/*
              If the user has no tokens, we don't show the Transfer form
            */}
            {this.state.canReceiveReward && this.state.triviaRewardBalance.eq(0) &&(
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
              )}
            {this.state.canReceiveReward && this.state.triviaRewardBalance.gt(0) && (
              <Trivia 
                claimReward={() => this._claimReward()} 
                triviaRewardBalance={this.state.triviaRewardBalance.toString()} 
                disableClaimReward={this.state.disableClaimReward}
                resetTrivia={this.state.resetTrivia}
              />
            )}
          </Flex>
        </Col>
      </Row>
      
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // Once we have the address, we can initialize the application.

    // First we check the network
    this._checkNetwork();

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._getTriviaRewardData();
    this._startPollingData();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._triviaRewardContract = new ethers.Contract(
      contractAddress.TriviaReward,
      TriviaRewardArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => {
      this._updateBalance();
      this._updateTriviaRewardBalance();
    }, 1000);

    // We run it once immediately so we don't have to wait for it
    this._batchOfUpdates()  
  }

  _batchOfUpdates() {
    this._updateBalance();
    this._updateTriviaRewardBalance();
    this._updateCanReceiveReward();
    this._quatityOfSuccessfullClaims();
    this._claimTimesLimit();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTriviaRewardData() {
    const name = await this._triviaRewardContract.name();
    const symbol = await this._triviaRewardContract.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  async _quatityOfSuccessfullClaims(){
    const quatityOfSuccessfullClaims = await this._triviaRewardContract.quatityOfSuccessfullClaims();
    this.setState({ quatityOfSuccessfullClaims });
  }

  async _claimTimesLimit(){
    const claimTimesLimit = await this._triviaRewardContract.claimTimesLimit();
    this.setState({ claimTimesLimit });
  }
  
  async _updateBalance() {
    const balance = await this._triviaRewardContract.balanceOf(this.state.selectedAddress);
    this.setState({ balance });
  }

  async _updateTriviaRewardBalance() {
    const triviaRewardBalance = await this._triviaRewardContract.triviaRewardBalance();
    this.setState({ triviaRewardBalance });
  }

  async _updateCanReceiveReward() {
    const canReceiveReward = await this._triviaRewardContract.canReceiveReward();
    this.setState({ canReceiveReward });
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  async _claimReward() {
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();
      
      this.setState({ disableClaimReward: true });

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._triviaRewardContract.reward();
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      this._batchOfUpdates();
      const resetTrivia = this.state.resetTrivia;
      this.setState({ resetTrivia: resetTrivia+1 });
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
      this.setState({ disableClaimReward: false});
    }
  }

  

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  async _switchChain() {
    const chainIdHex = `0x${DEFAULT_NETWORK_ID.toString(16)}`
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  // This method checks if the selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion !== DEFAULT_NETWORK_ID) {
      this._switchChain();
    }
  }
}
