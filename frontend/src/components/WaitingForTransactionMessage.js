import React from "react";
import { Alert, Typography } from 'antd';

const { Paragraph } = Typography

export function WaitingForTransactionMessage({ txHash }) {
  return (
    <Alert message={<Paragraph>Waiting for transaction <strong>{txHash}</strong> to be mined</Paragraph>} />
  );
}
