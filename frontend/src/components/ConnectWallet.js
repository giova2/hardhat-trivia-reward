import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { Button, Flex, Layout } from 'antd';

const {Content} = Layout

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <Content>
      <Flex justify="center" align="center" vertical>
        <div className="col-12 text-center">
          {/* Wallet network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
            message={networkError} 
            dismiss={dismiss} 
            />
            )}
        </div>
        <Flex justify="center" align="center" vertical>
          <p>Please connect to your wallet.</p>
          <Button type="primary"            
            onClick={connectWallet}>
            Connect Wallet
          </Button>
        </Flex>
      </Flex>
    </Content>
  );
}
