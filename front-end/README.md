# my-wave-portal

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Workflow](#workflow)
- [Testing the contract](#testing)

## About <a name = "about"></a>

This is a simple dapp that allows you to wave and leave a message on the blockchain. Everytime someone waves at this contract, there's a small chance they'll
be rewarded with some [Ether](https://ethereum.org/). It's an example of how to deploy, read and write data to the blockchain using [Hardhat](https://hardhat.org/) 
as the [Ethereum](https://ethereum.org/) development framekwork.
You can see it live at [Wave Portal](https://wave-portal-nu.vercel.app/). Leave me a message 👋.

## Getting Started <a name = "getting_started"></a>

So this repo contains the code for the smart contract and the front-end. The main directory is where the smart contract code lives. The front-end is in the `front-end` directory.

You can start by installing the dependencies in the main directory and in the `front-end` directory:
```
npm install
cd front-end
//npm
npm install
//yarn
yarn
```
That's all you need. You can start the Dapp by running the `start` command in the `front-end` directory:
````
//npm 
npm run start
//yarn
yarn start
```
If you wish to connect the Dapp to your own version of the smart contract, follow the [workflow](#workflow) below.

## Worflow <a name = "workflow"></a>

In the main directory:
- Deploy the contract to the blockchain using `npx run scripts/deploy --network <network>`.
    - This will compile and deploy the contract to the specified network. This project used [rinkeby](https://rinkeby.etherscan.io/).
    - Copy the contract address and  use it as the `contractAddress` in the front-end.
    - Everytime you update the contract, you need to copy the new ABI into `front-end/src/utils/WavePortal.json`.
    - You can automate the copy and paste by running `make abi`. 
- `cd front-end` and run the dapp using `yarn start`. You're good to go!

## Testing the smart contract <a name = "testing"></a>

In the main directory:
```
npx hardhat test
```