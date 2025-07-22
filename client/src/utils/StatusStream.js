import { StatusStreamerClient } from '@/grpc-api/status_grpc_web_pb.js';

class StatusStream {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.stream = null;
  }

  start(request, onData, onEnd) {
    const client = new StatusStreamerClient(this.endpoint, null, null);
    this.stream = client.streamStatus(request, {});

    this.stream.on('data', (response) => {
      onData({
        progress: response.getProgress(),
        status: response.getState(),
      });
    });

    this.stream.on('end', () => {
      if (onEnd) {
        onEnd();
      }
    });
  }

  cancel() {
    if (this.stream) {
      this.stream.cancel();
    }
  }
}

export default StatusStream;
