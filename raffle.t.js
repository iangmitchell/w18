const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers")
const {expect} = require("chai")
describe("Raffle Init:", ()=>{
		/* 
		 * Reason not to use beforeEach, etc..
		 * With fixtures you can pre load different conditions
		 * for the contract
		 */
	const deployRaffle = (async ()=>{
		const [owner, addr1, addr2, addr3] = await ethers.getSigners();
		const raffle = await ethers.deployContract("Raffle");
		console.log("contract address:", raffle.target)
		return {raffle, owner, addr1, addr2, addr3};
	})
	describe("Deployment:", ()=>{
		it("Symbol", async ()=>{
			const {raffle} = await loadFixture(deployRaffle);
			const symbolStr = "RFL";
			expect(await raffle.symbol()).to.equal(symbolStr);
		})
		it("Name", async ()=>{
			const {raffle} = await loadFixture(deployRaffle);
			const nameStr = "Raffle"
			expect(await raffle.name()).to.equal(nameStr);
		})
		it("Owner:", async()=>{
			const {raffle, owner} = await loadFixture(deployRaffle);
			expect(await raffle.owner()).to.equal(owner.address);
		})
	})
})
