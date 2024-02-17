import React from 'react';
import {Flex, Typography} from 'antd';

const { Title, Text } = Typography

function Header({
  title,
  subtitle,
  quatityOfSuccessfullClaims,
  claimTimesLimit,
}) {
  return (
    <Flex justify="center" align="center" vertical>
      <Title>
        {title}
      </Title>
      <Text ellipsis={{
        tooltip: subtitle
      }}>
        {subtitle}
      </Text>
      {quatityOfSuccessfullClaims < claimTimesLimit ? 
        <Title level={4}>You have {claimTimesLimit - quatityOfSuccessfullClaims} more times to claim a reward</Title>
        :
        <Title level={4}>You have reached the maximum reward limit.</Title>
      }
    </Flex>
  )
}

export default Header