#!/bin/bash

# 引数の解析
while getopts "d:v:" opt; do
  case ${opt} in
    d )
      echo "Deploying contract with script: ignition/modules/deploy.ts"
      npx hardhat ignition deploy ignition/modules/deploy.ts --network sepolia
      ;;
    v )
      echo "Verifying contract with arguments: $OPTARG"
      npx hardhat verify --network sepolia 0x7f12A908d427c7f38E7404Fcb4642EE025282135 "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD"
      ;;
    \? )
      echo "Invalid option: -$OPTARG" 1>&2
      exit 1
      ;;
    : )
      echo "Invalid option: -$OPTARG requires an argument" 1>&2
      exit 1
      ;;
  esac
done
shift $((OPTIND -1))