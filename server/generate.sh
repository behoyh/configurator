#!/bin/bash

# If requirement is not installed, open the following comment
# chmod +x ./activate && ./activate

python3  -m grpc_tools.protoc --proto_path=server/protos --python_out=server --grpc_python_out=server server/protos/simple_grpc.proto
python3  -m grpc_tools.protoc --proto_path=server/protos --python_out=server --grpc_python_out=server server/protos/point_cloud.proto
python3  -m grpc_tools.protoc --proto_path=server/protos --python_out=server --grpc_python_out=server server/protos/status.proto

protoc -I=server/protos --js_out=import_style=commonjs,binary:client/src/grpc-api --grpc-web_out=import_style=commonjs,mode=grpcwebtext:client/src/grpc-api server/protos/status.proto

echo "Generation complete! The output files are located in the proto folder."



