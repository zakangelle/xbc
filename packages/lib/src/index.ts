/* eslint-disable no-console */
import Miner from './Miner';
import Blockchain from './Blockchain';
import Wallet from './Wallet';
import { MINE_RATE } from './config';

const NUMBER_OF_BLOCKS = 10;

const miner = new Miner();
const peerBlockchain = new Blockchain();
const wallet = new Wallet();
wallet.balance = 99999;

const start = Date.now();

for (let i = 0; i < NUMBER_OF_BLOCKS; i++) {
  wallet.createTransaction(miner.transactionPool, miner.blockchain, `ksjuwn92jfksgkgj-${i}`, 400);
  miner.mine();
}

const end = Date.now();

console.log(
  `Generated blockchain is ${peerBlockchain.incomingChainIsValid(miner.blockchain.chain)
    ? 'valid'
    : 'invalid'}
  `,
);

console.log(`Difficulty adjustments: ${miner.blockchain.chain.map(block => block.difficulty).join('->')}`);

console.log(`Average computations per block mine: ${miner.blockchain.chain
  .map(block => block.nonce)
  .reduce((total, nonce) => total + nonce, 0) / NUMBER_OF_BLOCKS}`);

console.log(`Actual mine rate: ${((end - start) / 1000) / NUMBER_OF_BLOCKS}s`);

console.log(`Ideal mine rate: ${MINE_RATE / 1000}s`);
