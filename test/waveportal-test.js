const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WavePortal", function () {
  let waveContractFactory
  let waveContract 

  beforeEach(()=>{
    return new Promise(async (resolve) =>{
      waveContractFactory = await ethers.getContractFactory("WavePortal");
      waveContract= await waveContractFactory.deploy({value: hre.ethers.utils.parseEther('0.1')});
      await waveContract.deployed();
      resolve()
      
    })
  })

  it("Contract should have funds", async function () {
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));
    expect(hre.ethers.utils.formatEther(contractBalance)).to.be.equal("0.1");
    // expect(await greeter.greet()).to.equal("Hello, world!");


    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("Contract should count waves properly", async function (){
    let totalWaves = await waveContract.getTotalWaves();

    expect(totalWaves).to.be.equal(0);

    let waveTxn = await waveContract.wave("this is a wave!")
    await waveTxn.wait()

    totalWaves = await waveContract.getTotalWaves();
    expect(totalWaves).to.be.equal(1);
  })

  it("Contract should count people properly", async function (){
    let totalPeople = await waveContract.getTotalPeople();

    expect(totalPeople).to.be.equal(0);

    let waveTxn = await waveContract.wave("this is a wave!")
    await waveTxn.wait()

    totalPeople = await waveContract.getTotalPeople();
    expect(totalPeople).to.be.equal(1);
  })

  it("Contract should respect wave countdown", async function (){
    let waveTxn = await waveContract.wave("this is a wave!")
    await waveTxn.wait()

    try{
      let waveTxn = await waveContract.wave("this is a wave!")
      await waveTxn.wait()
    }catch(e){
      expect(e.message).to.be.equal("VM Exception while processing transaction: reverted with reason string 'Wait 15m'");
    }
  })

  it("Contract should return allWaves properly", async function(){
    let waveTxn = await waveContract.wave("this is a message!")
    await waveTxn.wait()

    let allWaves = await waveContract.getAllWaves();
    expect(allWaves.length).to.be.equal(1);
    expect(allWaves[0].message).to.be.equal("this is a message!");
  })
});
