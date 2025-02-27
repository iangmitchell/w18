import './bulma/bulma.css';
import {useEffect, useState} from 'react'
import Header from './Header.js'
import TokenArtifact from "./artifacts/raffle.json";
import contractAddress from "./artifacts/contractAddress.json";
//import {Contract } from "ethers";
//import {ethers} from "ethers";
const ethers = require("ethers");
const ownerAddress ='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';


function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner() // await
  const maxTickets=3
  const [contract, setContract] = useState("")
  const [tokenData, setTokenData] = useState("")
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState(0)
  const [winnerEvent, setWinnerEvent] = useState([]) 
  const [ticketsSold, setTicketsSold] = useState(0)
 
  
 useEffect(()=>{
 const listenToEvent= async() => {
  if(contract){
    contract.on('winningTicketDisplay', (to )=>{
      console.log('winning event emitted:', to)
      setWinnerEvent((preWinnerEvents)=>[...preWinnerEvents,{to}]);
    })
    }
  }
  listenToEvent();
  }, [contract])

  useEffect(()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner() // await
    _getTokenContractData();
    //listenToEvent();
  },[])  

  async function _initialiseContract(init){
      const tokenContract = new ethers.Contract(
      contractAddress.raffle,
      TokenArtifact,
      init
    )
  return(tokenContract)
  }

 

  async function _getTokenContractData(){
    const contract = await _initialiseContract(signer)
    setContract(contract)
    const name = await  contract.name()
    const symbol = await contract.symbol()
    const data = {name, symbol}
    setTokenData(data)
  }

  async function getBalance(){
    if(typeof window.ethereum !== 'undefined'){
      const contract = await _initialiseContract(signer)
      const [account] = await window.ethereum.request({method:"eth_requestAccounts"})
      const balance = await contract.balanceOf(account)
      setAccount(account)
      setBalance(balance.toString()) 
    }
  }

//  const buyTickets = async (qty) =>{
  async function buyTickets(qty){
    console.log('qty', qty)
    await contract.buyTickets(qty)
    setTicketsSold(ticketsSold+qty)
  }

//  const winner = async () =>{ 
  async function selectWinner(){
    await contract.winner()
    setTicketsSold(0)
  }

 return (
    <>
    <Header symbol={tokenData.symbol} name={tokenData.name}/> 
    <div className='panel'>
    <div className="panel-block">
      <button onClick={_getTokenContractData}>get token data</button>
        <h2> Name: {tokenData.name}</h2>
        <h2> Symbol: {tokenData.symbol}</h2>
        <button onClick={getBalance}>Get Balance</button>
        <h2> Account: {account.substring(0,8)}...{account.substring(28,34)}</h2>
        <h2> Balance: {balance}</h2>
    </div>

    <div className='panel-block'>
      <h2> MAX_TICKETS: {maxTickets}</h2>
      <h2> Tickets Sold:{ticketsSold} </h2>
    </div>
    <div className='panel-block'>
      <p> Buy Ticket </p>
      { (ticketsSold == maxTickets) ?
              <p> Select a Winner, no more tickets</p>
              :<div>
                <button  onClick={()=>buyTickets(1)}> 1</button> 
                <button  onClick={()=>buyTickets(2)}> 2</button> 
                <button  onClick={()=>buyTickets(3)}> 3</button>
              </div>
      }
    </div>
    <div className='panel-block'>
      <div className='block'>
        <ul>
          {winnerEvent.map((item, idx)=>(
            <li key={idx}>
              Winner : {item.to}
            </li>
          )
          )}
        </ul>
      </div>
      <div className='block'>
        <p>
        { (ticketsSold == maxTickets) 
          ?<button onClick={()=>selectWinner()}>Winner</button>
          : "buy tickets"
        }
 
        </p>
     </div>
    </div>
    </div>
 </>
  );
}

export default App;

