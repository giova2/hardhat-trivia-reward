import React from "react";
import {Alert} from 'antd';

export function TransactionErrorMessage({ message, dismiss }) {
  return (
    <Alert 
      message={`Error sending transaction: ${message.substring(0, 100)}`} 
      type="error" 
      closable
      onClose={dismiss}
    />
  );
}
