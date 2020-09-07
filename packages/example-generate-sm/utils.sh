#!/usr/bin/env bash

###
# build image which contain t-bears command
###
# echo "build image which contain t-bears command"
# docker build --quiet --label iconloop -t iconloop/t-bears -f docker-tbears.Dockerfile .
# echo "build done\n\n"

# export tbears to current shell
function tbears() {
  docker run -it --rm -v $(pwd):/app iconloop/t-bears $@
}

###
# https://www.icondev.io/docs/how-to-use-t-bears
# test
###
echo "tbears lastblock"
tbears lastblock
