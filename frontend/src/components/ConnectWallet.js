import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { Flex, Layout } from 'antd';
import { MyParagraph } from "./MyTypography";
import MyButton from "./MyButton";

const { Content } = Layout

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
          <MyParagraph>Please connect to your wallet.</MyParagraph>
          <MyButton onClick={connectWallet}>
            Connect Wallet
          </MyButton>
        </Flex>
      </Flex>
    </Content>
  );
}
