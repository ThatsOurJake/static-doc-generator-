#bin/sh

docker build --no-cache -t registry.fluidcloud.bskyb.com/online-service/jakes-docs . && \
docker push registry.fluidcloud.bskyb.com/online-service/jakes-docs
