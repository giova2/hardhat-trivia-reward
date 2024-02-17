import React from "react";
import {Alert} from 'antd';

export function NetworkErrorMessage({ message, dismiss }) {
  return (
    <Alert 
      message={message} 
      type="error" 
      closable
      onClose={dismiss}
    />
  );
}
