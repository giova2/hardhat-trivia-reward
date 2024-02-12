import React from "react";
import { Flex, Button, Typography } from 'antd';

const { Title } = Typography

export function ClaimGift({ claimGift, balanceOfGiftSupply }) {
  return (
    <Flex justify="center" align="center" wrap="wrap" vertical>
      <Title level={3} >
        There are {balanceOfGiftSupply} Tokens left
      </Title>
      <Button type="primary"            
        onClick={claimGift}>
        Claim Gift
      </Button>
    </Flex>
  );
}

