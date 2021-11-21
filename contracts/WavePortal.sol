// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    mapping(address => uint256) public addressToWaves;
    uint256 public totalPeople;


    constructor() {
        console.log("Yo yo, I am a contract am I am smart");
    }

    function wave() public {
        totalWaves += 1;
        console.log(unicode"%s has waved! 👋", msg.sender);
        
        if (addressToWaves[msg.sender] == 0 ) {
           totalPeople += 1;
       }

       addressToWaves[msg.sender] += 1;
       console.log("%s people have waved at you!\n", totalPeople);

       if (addressToWaves[msg.sender] %3 == 0) {
           console.log(unicode"%s is on 🔥 and has already waved %d times!", msg.sender, addressToWaves[msg.sender]);
       } 
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!\n---", totalWaves);
        return totalWaves;
    }
}