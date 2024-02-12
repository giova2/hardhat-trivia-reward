import React from "react";
import {Flex} from 'antd';

export function NoWalletDetected() {
  return (
    <div className="container">
      <Flex justify="center">
        <div className="col-10 p-4 text-center">
          <p>
            No Ethereum wallet was detected. <br />
            Please install{" "}
            <a
              href="https://www.coinbase.com/wallet"
              target="_blank"
              rel="noopener noreferrer"
            >
              Coinbase Wallet
            </a>
            or{" "}
            <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">
              MetaMask
            </a>
            .
          </p>
        </div>
      </Flex>
    </div>
  );
}
