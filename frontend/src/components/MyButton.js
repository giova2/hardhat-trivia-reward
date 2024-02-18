       
import React from 'react'
import { Button } from 'antd'

function MyButton({children, ...props}) {
  return (
    <Button
      className="button"
      type="primary"
      {...props}>
        {children}
    </Button>
  )
}

export default MyButton
        
        