import { PointCloudStreamServiceClient } from '@/grpc-api/point_cloud_grpc_web_pb.js'

class GrpcStream {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.buffer = []
  }

  getStreamPointCloud(request, handler) {
    const client = new PointCloudStreamServiceClient(this.endpoint, null, null)

    const stream = client.getStreamPointCloud(request, {})

    stream.on('data', (response) => {
      const point = {
        x: response.getX(),
        y: response.getY(),
        z: response.getZ(),
      }
      this.buffer.push(point)

      if (this.buffer.length >= 500) {
        handler(this.buffer)
        this.buffer = []
      }
    })

    stream.on('error', (error) => {
      console.error('Error:', error)
    })

    stream.on('end', () => {
      console.log('Stream completed')
      handler(this.buffer)
      this.buffer = []
    })
  }
}

export default GrpcStream
