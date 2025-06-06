import 'bulma/css/bulma.min.css';
import {useEffect, useState} from 'react'
import Header from './Header.jsx'
import TokenArtifact from "./artifacts/raffle.json";
import contractAddress from "./artifacts/contractAddress.json";
import {ethers} from "ethers";
const ownerAddress ='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';


function App() {
  const maxTickets=3
  const [contract, setContract] = useState("")
  const [tokenData, setTokenData] = useState("")
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState(0)
  const [winner, setWinner] = useState("") 
  const [ticketsSold, setTicketsSold] = useState(0)
  const [signer, setSigner] = useState({})

 
  
 useEffect(()=>{
 const listenToEvent= async() => {
  if(contract){
    contract.on('winningTicketDisplay', (to )=>{
      console.log('winning event emitted:', to)
      setWinner(to);
    })
    }
  }
  listenToEvent();
  }, [contract])

  useEffect(()=>{
    const onLoad=(async()=>{
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner() 
    _getTokenContractData();
    })
    onLoad()
  },[])  

  async function _initialiseContract(){
      const tokenContract = new ethers.Contract(
      contractAddress.raffle,
      TokenArtifact,
      signer
    )
    setContract(tokenContract)
  }

  async function _getTokenContractData(){
    const name = await  contract.name()
    const symbol = await contract.symbol()
    const data = {name, symbol}
    setTokenData(data)
  }

  async function _getBalance(){
    if(typeof window.ethereum !== 'undefined'){
      const [account] = await window.ethereum.request({method:"eth_requestAccounts"})
      const balance = await contract.balanceOf(account)
      setAccount(account)
      setBalance(balance.toString()) 
    }
  }

  async function connect(){
    const provider = new ethers.BrowserProvider(window.ethereum)
    setSigner(await provider.getSigner())
    _initialiseContract()
    _getTokenContractData()
    _getBalance()
  }


  async function buyTickets(qty){
    console.log('qty', qty)
    await contract.buyTickets(qty)
    setTicketsSold(ticketsSold+qty)
  }

  async function selectWinner(){
    await contract.winner()
    setTicketsSold(0)
  }

 return (
    <>
    <Header symbol={tokenData.symbol} name={tokenData.name}/> 
    <div className='panel'>
    <div className="panel-block">
      <button className="button is-primary" onClick={connect}> Connect </button>
        <h2> Name: {tokenData.name}</h2>
        <h2> Symbol: {tokenData.symbol}</h2>
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
                <button className="button is-danger" onClick={()=>buyTickets(1)}> 1</button> 
                <button className="button is-danger" onClick={()=>buyTickets(2)}> 2</button> 
                <button className="button is-danger" onClick={()=>buyTickets(3)}> 3</button>
              </div>
      }
    </div>
    <div className='panel-block'>
      <div className='block'>
        <h2>Winner: {winner}</h2>
      </div>
      <div className='block'>
        <p>
        { (ticketsSold == maxTickets) 
          ?<button className="button is-danger"  onClick={()=>selectWinner()}>Winner</button>
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

