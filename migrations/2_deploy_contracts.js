const WETHToken = artifacts.require('WETHToken.sol');
const WBSCToken = artifacts.require('WBSCToken.sol');
const BridgeEth = artifacts.require('BridgeETH.sol');
const BridgeBsc = artifacts.require('BridgeBSC.sol');

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    await deployer.deploy(WETHToken);
    const tokenEth = await WETHToken.deployed();
    await tokenEth.mint(addresses[0], 1000);
    await deployer.deploy(BridgeEth, tokenEth.address);
    const bridgeEth = await BridgeEth.deployed();
    await tokenEth.updateAdmin(bridgeEth.address);
  }
  if(network === 'bscTestnet') {
    await deployer.deploy(WBSCToken);
    const tokenBsc = await WBSCToken.deployed();
    await deployer.deploy(BridgeBsc, tokenBsc.address);
    const bridgeBsc = await BridgeBsc.deployed();
    await tokenBsc.updateAdmin(bridgeBsc.address);
  }
};