// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 totalPeople;

    mapping(address => uint256) public addressToWaves;
    mapping(address => uint256) public lastWavedAt;

    event NewWave(address indexed from,  string message, uint256 timestamp);
    event NewStats(uint256 totalWaves, uint256 totalPeople);

    struct Wave {
        address from;
        string message;
        uint256 timestamp;
    }

    Wave[] public waves;

    uint256 private seed;

    constructor() payable{
        console.log("contract deployed");

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender]  < block.timestamp,
            "Wait 15m"
        );

        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves += 1;
        
        uint256 timestamp = block.timestamp; 
        waves.push(Wave(msg.sender, _message, timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;
        
        if (addressToWaves[msg.sender] == 0 ) {
           totalPeople += 1;
       }

       addressToWaves[msg.sender] += 1;

       if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

       emit NewWave(msg.sender, _message, timestamp);
       emit NewStats(totalWaves, totalPeople);
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }

    function getTotalPeople() public view returns (uint256) {
        return totalPeople;
    }

    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }
}