FROM registry.fluidcloud.bskyb.com/online-service/node:18.12.0-alpine as build
WORKDIR /build
COPY . .
RUN yarn install --frozen-lock
RUN yarn build



FROM build
WORKDIR /app
COPY --from=build /build/dist .
RUN npm i http-server -g
EXPOSE 3000
CMD http-server -p 3000 .
