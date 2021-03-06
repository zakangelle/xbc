import Block from '.';
import Blockchain from '../Blockchain';
import Wallet from '../Wallet';
import TransactionPool from '../TransactionPool';
import { MINE_RATE } from '../config';

describe('Block', () => {
  it('generates a genesis block', () => {
    const block = Block.getGenesisBlock();

    expect(block.lastHash).toEqual('none');
    expect(block.hash).toEqual('genesis');
  });

  it('sets the block data', () => {
    const pool = new TransactionPool();
    const blockchain = new Blockchain();
    const wallet = new Wallet();
    wallet.balance = 80;

    const blockData = [wallet.createTransaction(pool, blockchain, 'sjd29ejf9jf92', 50)];
    const lastBlock = Block.getGenesisBlock();
    const block = Block.mine(lastBlock, blockData);

    expect(block.data).toEqual(blockData);
  });

  it('mines a new block with a reference to the previous block', () => {
    const genesisBlock = Block.getGenesisBlock();
    const pool = new TransactionPool();
    const blockchain = new Blockchain();
    const wallet = new Wallet();
    wallet.balance = 80;

    const blockData = [wallet.createTransaction(pool, blockchain, 'sjd29ejf9jf92', 50)];
    const block = Block.mine(genesisBlock, blockData);

    expect(block.lastHash).toEqual(genesisBlock.hash);
  });

  it('generates a block hash that correlates with difficulty', () => {
    const lastBlock = Block.getGenesisBlock();
    const pool = new TransactionPool();
    const blockchain = new Blockchain();
    const wallet = new Wallet();
    wallet.balance = 80;

    const blockData = [wallet.createTransaction(pool, blockchain, 'sjd29ejf9jf92', 50)];
    const block = Block.mine(lastBlock, blockData);

    expect(block.hash.substring(0, 1)).toEqual('0'.repeat(lastBlock.difficulty));
  });

  it('adjusts difficulty up when actual mine rate is too high', () => {
    const pool = new TransactionPool();
    const blockchain = new Blockchain();
    const wallet = new Wallet();
    wallet.balance = 80;

    const blockData = [wallet.createTransaction(pool, blockchain, 'sjd29ejf9jf92', 50)];

    const lastBlock = new Block({
      lastHash: 'gji8j20rjwifjsgasj',
      hash: 'sjf8wj20ejqwiorjsaglkjsa',
      data: blockData,
      timestamp: 7000,
      nonce: 32742,
      difficulty: 6,
    });

    const timestamp = lastBlock.timestamp + MINE_RATE - 1000;

    expect(Block.getAdjustedDifficulty(lastBlock, timestamp)).toEqual(7);
  });

  it('adjusts difficulty down when actual mine rate is too low', () => {
    const pool = new TransactionPool();
    const blockchain = new Blockchain();
    const wallet = new Wallet();
    wallet.balance = 80;

    const blockData = [wallet.createTransaction(pool, blockchain, 'sjd29ejf9jf92', 50)];

    const lastBlock = new Block({
      lastHash: 'gji8j20rjwifjsgasj',
      hash: 'sjf8wj20ejqwiorjsaglkjsa',
      data: blockData,
      timestamp: 7000,
      nonce: 32742,
      difficulty: 6,
    });

    const timestamp = lastBlock.timestamp + MINE_RATE + 1000;

    expect(Block.getAdjustedDifficulty(lastBlock, timestamp)).toEqual(5);
  });
});
