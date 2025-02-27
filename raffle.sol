//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Raffle is ERC20, Ownable {
	uint public _tS = 1000000;
	uint constant public TICKET_PRICE = 100; //Wei
	uint constant public ADMIN_FEE = 30;	
	uint constant public MAX_TICKETS=3;
	address[MAX_TICKETS] public tickets;
	uint public ticketsSold;
	address public winningAddress;
	uint public winningTicket;
	uint private nonce=0;
	
	event issueReceipt(address buyer, uint price, uint sold);
	event winningTicketDisplay(address to, uint value);
	
constructor()
	ERC20("Raffle", "RFL")
	Ownable(msg.sender)
	{
		_mint(owner(), _tS * 10 ** decimals());	
  }

	modifier notOwner(address _account){
		require(owner()!=msg.sender, "Owner cannot buy a ticket");
		_;
	}

function buyTickets(uint _quantity) public notOwner(msg.sender){
	//check
	address buyer = msg.sender;
	uint amount = _quantity * TICKET_PRICE;	
	require( MAX_TICKETS >= ticketsSold+_quantity, "No more tickets, try less");
	require(balanceOf(buyer)>=amount, "Insufficient funds");
    //effects
	transfer(owner(), amount); 
		//interaction
		//generate ticket
		uint start = ticketsSold;
		uint end = ticketsSold+ _quantity;
	for(uint i=start;i<end;i++){
			tickets[i]=buyer;
  		emit issueReceipt(buyer, TICKET_PRICE, ticketsSold);
  		ticketsSold++;
		}
  }

  function reset() private {
    delete tickets;
    ticketsSold =0;
   }


function winner() public onlyOwner() {
  require( MAX_TICKETS == ticketsSold, "All tickets have not been sold");
  winningTicket = random() % MAX_TICKETS;
  nonce++;
  //find winner
	winningAddress = tickets[winningTicket];
  //reward
  uint winningAmount = MAX_TICKETS * TICKET_PRICE - ADMIN_FEE;
	transfer(winningAddress, winningAmount);	
  emit winningTicketDisplay(winningAddress, winningTicket);
	reset();
}

function random() private returns(uint){
   uint r = uint(keccak256(abi.encodePacked(block.timestamp, tickets, nonce)));
   nonce++;
   return r;
}
 receive() external payable{revert("No transfers");}
}
