import React from 'react';
import { Flex } from 'antd';
import { MyTitle, MyText } from './MyTypography';

function Header({
  title,
  subtitle,
  quatityOfSuccessfullClaims,
  claimTimesLimit,
}) {
  return (
    <Flex justify="center" align="center" vertical>
      <MyTitle>
        {title}
      </MyTitle>
      <MyText ellipsis={{
        tooltip: subtitle
      }}>
        {subtitle}
      </MyText>
      {quatityOfSuccessfullClaims < claimTimesLimit ? 
        <MyTitle level={4}>You have {claimTimesLimit - quatityOfSuccessfullClaims} more times to claim a reward</MyTitle>
        :
        <MyTitle level={4}>You have reached the maximum reward limit.</MyTitle>
      }
    </Flex>
  )
}

export default Header