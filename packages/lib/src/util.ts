import uuid from 'uuid/v1';
import { SHA256 } from 'crypto-js';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export function generateUuid() {
  return uuid();
}

export function hashToString(data: string) {
  return SHA256(data).toString();
}

export function generateKeyPair() {
  return ec.genKeyPair();
}

export function getKeyFromPublicAddress(address: string) {
  return ec.keyFromPublic(address, 'hex');
}

export function log(description: string, data: any) {
  const output = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

  console.log(`${description}:`, `${output}\n`); // eslint-disable-line
}
