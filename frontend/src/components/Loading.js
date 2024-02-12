import React from "react";
import { Flex, Spin } from 'antd';

export function Loading() {
  return (
    <Flex justify="center" align="center" vertical style={{height: '100vh'}}>
      <Spin size="large"/>
    </Flex>
  );
}
