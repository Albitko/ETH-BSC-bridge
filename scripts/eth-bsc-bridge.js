const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeETH.json');
const BridgeBsc = require('../build/contracts/BridgeBSC.json');

const web3Eth = new Web3('wss://mainnet.infura.io/ws/v3/57db96c2522a4420a57dba48a3f25446');
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const adminPrivKey = '0x256c5f3ec55a9999e696f965c927b93cb829a9c189779b7538f61c008a3fa8e3';
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['4'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['97'].address
);

bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
).on('data', async event => {
    console.log("on data");

  const { from, to, amount, date, nonce } = event.returnValues;

  const tx = bridgeBsc.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
}
)
.on('error', console.error);;