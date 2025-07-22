import React from 'react'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

export default () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Page Not Found"
      extra={
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  )
}
