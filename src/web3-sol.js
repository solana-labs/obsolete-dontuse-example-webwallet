/*
 * Solana Web3 Client Interface
 *
 */

import nacl from 'tweetnacl';
import bs58 from 'bs58';

import {createRpcClient} from './rpc-client';

function sleep(duration: number = 0): Promise<void> {
  return new Promise((accept) => {
    setTimeout(accept, duration);
  });
}

export class Web3Sol {
  constructor(endpoint) {
    const keypair = nacl.sign.keyPair();
    Object.assign(this, {
      balance: 0,
      endpoint,
      keypair,
      rpcClient: createRpcClient(endpoint),
    });
  }

  async getPublicKey() {
    await sleep(0);
    const publicKey = bs58.encode(this.keypair.publicKey);
    return publicKey;
  }

  async getBalance() {
    await sleep(500); // TODO
    return this.balance;
  }

  async requestAirdrop(amount) {
    await sleep(500); // TODO
    this.balance += amount;
  }

  async sendTokens(to, amount) {
    const transaction = Buffer.from(
      // TODO: This is not the correct transaction payload
      `Transaction ${this.keypair.publicKey} ${to} ${amount}`
    );
    const signature = nacl.sign.detached(transaction, this.keypair.secretKey);

    console.log('Created signature of length', signature.length);
    await sleep(500); // TODO: transmit transaction + signature
    throw new Error(`Unable to send ${amount} tokens to ${to}`);
  }
}

