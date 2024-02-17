import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { Button, Flex, Layout, Typography } from 'antd';

const { Content } = Layout
const { Paragraph} = Typography

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <Content>
      <Flex justify="center" align="center" vertical>
          {/* Wallet network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
            message={networkError} 
            dismiss={dismiss} 
            />
          )}
        <Flex justify="center" align="center" vertical>
          <Paragraph  >Please connect to your wallet.</Paragraph>
          <Button type="primary"            
            onClick={connectWallet}>
            Connect Wallet
          </Button>
        </Flex>
      </Flex>
    </Content>
  );
}
