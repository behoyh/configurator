# sweep-configurator

This project implements sweep configuration logic and frontend. Also uses gRPC via envoy proxy for real-time progress updates.

# Quickstart
> `docker compose up && open http://localhost:7891`

## Server

The `server` folder contains the gRPC service implemented in Python using proto files. It provides the necessary functionality for serving the point cloud data to the client. To get started with the server, follow these steps:

1. Install the required dependencies by running the following command:
   ```
   cd server && chmod +x ./activate && ./activate
   ```

2. Generate the gRPC code from the proto file using the following command:
   ```
   chmod +x ./generate.sh && ./generate.sh
   ```

3. Start the gRPC server by running the following command:
   ```
   server/venv/bin/python server/main.py
   ```

The server should now be running and ready to serve point cloud data to the client.

## Envoy

The `envoy` folder contains the configuration files for Envoy, which acts as a proxy for the gRPC communication between the client and server. To configure and start Envoy, follow these steps:

1. To start the agent with docker in linux, here are the commands to execute
   ```shell
    cd envoy && chmod +x ./deploy-linux.sh && ./deploy-linux.sh
   ```

Envoy will now act as a proxy, forwarding gRPC-Web requests from the client to the gRPC server.


## Client

The `client` folder contains the React application that utilizes gRPC-Web. To set up and run the client, follow these steps:

1. Install the required dependencies by navigating to the `client` folder and running the following command:
   ```
   cd client && yarn  install
   ```
2. The grpc-web package is generated and running the following command:
   ```
   yarn  generate
   ```
   
3. Start the React development server by running the following command:
   ```
    yarn start
   ```

The client application should now be running and accessible at `http://localhost:3000`. It will establish a gRPC-Web connection with the server and render the received point cloud data.

