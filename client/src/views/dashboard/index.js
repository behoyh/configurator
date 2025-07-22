import React, { useState } from 'react'
import { Button, Input, Typography } from 'antd'
import { StatusRequest } from '@/grpc-api/status_pb.js'
import { StatusStreamerClient } from '@/grpc-api/status_grpc_web_pb.js'
import getGrpcUrl from '@/utils/get-grpc-url.js'
const { Text } = Typography

const IndexPage = () => {
  const [id, setId] = useState('')
  const [grpcResponse, setGrpcResponse] = useState('')

  const client = new StatusStreamerClient(getGrpcUrl(), null, null)

  const onSubmit = () => {
    let req = new StatusRequest()
    req.setId(id)

    const stream = client.streamStatus(req, {})
    stream.on('data', (response) => {
      setGrpcResponse(JSON.stringify(response.toObject()))
    })
    stream.on('error', (err) => {
      console.log(err)
      setGrpcResponse(JSON.stringify(err))
    })
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Input
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Button type="primary" onClick={onSubmit}>
        Click Me!
      </Button>
      <Text
        type="secondary"
        style={{ maxWidth: '400px', wordWrap: 'break-word' }}
      >
        {grpcResponse}
      </Text>
    </div>
  )
}

export default IndexPage
