#!/bin/sh

if [ -z "$1" ]; then
  echo "No argument supplied. Exiting."
  exit 1
fi

export XTUI_PEER_ADDRESS=$(jq -r .result.channelDescription.address < /tmp/channel.json)
export XTUI_PK=$(jq -r .privateKey < /tmp/${1}-wallet.json)

node build/channel.js 2>/tmp/${1}.log