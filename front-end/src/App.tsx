import { useEffect, useState} from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import abi from "./utils/WavePortal.json"
import Message from "./components/message"

//typescript workaround
declare let window: any;

interface Wave {
  from: string;
  timestamp: Date | number;
  message: string;
}


export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentTotalWaves, setCurrentTotalWaves] = useState(0);
  const [currentTotalPeople, setCurrentTotalPeople] = useState(0);
  const [allWaves, setAllWaves] = useState([] as Wave[]);
  
  const contractAddress = "0x2dacF6c4B10E39764A37801003f16059e7aAabba";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      }       

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  }

   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error: any) {
      console.log("DEBUGANDO: ", error)
      toast.error(error.message);
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (!currentAccount) {
        throw new Error("No account connected!");
      }

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave("my first message", { gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error)
    }
 }

 const getTotalStats = async () => {
 try {
      const { ethereum } = window;

      if (!currentAccount) return

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let wavesCount = await wavePortalContract.getTotalWaves();
        setCurrentTotalWaves(wavesCount.toNumber());

        let peopleCount = await wavePortalContract.getTotalPeople();
        setCurrentTotalPeople(peopleCount.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error)
    }
 }

  const setEventListeners = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        wavePortalContract.on("NewWave",async (from, message, timestamp) => {
          const waves = await wavePortalContract.getAllWaves();

          let wavesCleaned: Wave[]= [];
          waves.forEach((wave: Wave) => {
            wavesCleaned.push({
              from: wave.from,
              timestamp: new Date(wave.timestamp as number * 1000),
              message: wave.message
            });
          }); 
          
          setAllWaves(wavesCleaned.reverse().slice(0,5));
        });

        wavePortalContract.on("NewStats", (totalWaves, totalPeople) => {
          setCurrentTotalWaves(totalWaves.toNumber());
          setCurrentTotalPeople(totalPeople.toNumber());
        })

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }  

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (!currentAccount) return
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();
        
        let wavesCleaned: Wave[]= [];
        waves.forEach((wave: Wave) => {
          wavesCleaned.push({
            from: wave.from,
            timestamp: new Date(wave.timestamp as number * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned.reverse().slice(0,5));
        console.log("ALLWAVES: ", allWaves)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getTotalStats();
    getAllWaves();
    setEventListeners();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          Hello! I'm Dias Junior. A digital nomad coding and travelling around the world. Check my links on <a href="https://dev.page/diasjuniorr">dev.page</a>
        </div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>


        <div className="countContainer">
          <div>{currentTotalWaves} waves 👋</div>
          <div>{currentTotalPeople} people 😎</div>
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} >
              <Message wave={wave} /> 
            </div>)
        })}

        <ToastContainer />
      </div>
    </div>
  );
}