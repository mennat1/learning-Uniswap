# A simple demo on how to use Uniswap to make swaps:

- This smart contract lets you swap exact amount of USDTs to WETH
  
## Workflow:
- Give the amount of USDT tokens you wanna swap.
- Give the WETH recepient address
- Swap!



## Directory structure:
- contracts: Smart contracts that are deployed in Rinkeby testnet:
  1) SwapUsingUniswap.sol : the swaping smart contract.
- migrations: Migration files for deploying contracts in contracts directory.
- test: Ttesting the swap function.


## How to run this project locally:
### Prerequisites:
- Node.js >= v14
- Truffle and Ganache-cli
- Npm

### Tests:
- Run (sudo) npm install in project root to install dependencies.
- Test (contracts.test.js):
  1) Create a mainnet node on Alchemy and place the API key in the .env file
  2) Fetch USDT and WETH tokens addresses from etherscan mainnet and place it in the .env file (it's already there in the .env.example file tho)
  3) Fetch USDT Whale address and place it in the .env file and make sure it has enough eth to make txs (you'll find whale's address in the .env.example file as well)
  4) Run ( source .env ) in the root directory to use those vars
  5) In one terminal run: \
        ( ganache-cli --fork https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_KEY --networkId 999 --unlock $USDT_WHALE_ADDRESS )
  6) In another terminal run: \
        ( truffle test test/contracts.test.js --network mainnet_fork ) 
  




