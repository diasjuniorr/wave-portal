#!/usr/bin/env bash
#
# Usage
# cd ~/my-wave-portal
# bash ./generate-abi.sh
set -e



cp ./artifacts/contracts/WavePortal.sol/WavePortal.json ./front-end/src/utils/WavePortal.json
