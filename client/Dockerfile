FROM node:20 as build
WORKDIR /app
COPY client/package.json client/yarn.lock ./
RUN yarn install
COPY server/protos ./server/protos
RUN mkdir -p src/grpc-api
RUN yarn  generate
COPY client/. .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY client/app.conf /etc/nginx/conf.d/default.conf
EXPOSE 7891
CMD ["nginx", "-g", "daemon off;"]
