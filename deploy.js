const { artifacts } = require('hardhat');
const path = require('path');
const { parseEther } =  require('ethers');

async function main(){
  //create an instance of counter contract
  const Raffle = await ethers.getContractFactory("Raffle");
  await console.log('*************************')
  
  await raffle.waitForDeployment();
//  await raffle.deployed(); //older versions of hardhat-toolbox
//https://hardhat.org/hardhat-runner/docs/advanced/migrating-from-hardhat-waffle
  console.log('*************************')
  console.log('raffle address:',raffle.address); 
  console.log('raffle address:',raffle.target); 
  console.log('*************************')
  console.log('Writing files to client/src/artifacts');
  initialiseFiles(raffle);
  console.log('*************************')
}

function initialiseFiles(raffle){
  const fs = require("fs");
  const artifactsDir= path.join(__dirname, "..", "client", "src", "artifacts");
  //if directory does not exist, then create it
  if (!fs.existsSync(artifactsDir))
  { fs.mkdirSync(artifactsDir)}
  //fs.writeFileSync( path.join(artifactsDir, "contractAddress.json"), JSON.stringify({raffle: raffle.address}, null, 2))
  fs.writeFileSync( path.join(artifactsDir, "contractAddress.json"), JSON.stringify({raffle: raffle.target}, null, 2))
  const raffleArtefact = artifacts.readArtifactSync("Raffle");
  fs.writeFileSync(
    //artifacts directory and filename
    path.join(artifactsDir, "raffle.json"),
    //stringify with indent 2, null is standard
    JSON.stringify(raffleArtefact.abi, null, 2)
  )
}

main()
  .then(()=> process.exit(0))
  .catch(error=> {
    console.log(error);
    process.exit(1);
})
