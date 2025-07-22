import React from 'react'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

export default () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Not Authenticated"
      extra={
        <Link to="/">
          <Button type="primary">返回首页</Button>
        </Link>
      }
    />
  )
}
