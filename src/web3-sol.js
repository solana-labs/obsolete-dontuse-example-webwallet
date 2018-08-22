/*
 * Solana Web3 Client Interface
 *
 */

import nacl from 'tweetnacl';
import bs58 from 'bs58';
import joi from 'joi';

import {createRpcClient} from './rpc-client';

function sleep(duration: number = 0): Promise<void> {
  return new Promise((accept) => {
    setTimeout(accept, duration);
  });
}

export class Web3SolAccount {
  constructor(secretKey = null) {
    if (secretKey) {
      this._keypair = nacl.sign.keyPair.fromSecretKey(secretKey);
    } else {
      this._keypair = nacl.sign.keyPair();
    }
  }

  get publicKey() {
    return bs58.encode(this._keypair.publicKey);
  }

  get secretKey() {
    return this._keypair.secretKey;
  }
}

export class Web3Sol {
  constructor(endpoint) {
    Object.assign(this, {
      endpoint,
      rpcClient: createRpcClient(endpoint),
    });
  }

  async getBalance(account) {
    try {
      const res = await this.rpcClient.request(
        'getBalance',
        [account.publicKey]
      );
      console.log('getBalance result', res);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return joi.attempt(
        res.result,
        joi.number().required().min(0)
      );
    } catch (err) {
      console.log('Failed to getBalance:', err);
      return 0; // TODO: Throw instead?
    }
  }

  async confirmTransaction(signature) {
    try {
      const res = await this.rpcClient.request(
        'confirmTransaction',
        [signature]
      );
      console.log('confirmTransaction result', res);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return joi.attempt(
        res.result,
        joi.boolean().required()
      );
    } catch (err) {
      console.log('Failed to confirmTransaction:', err);
    }
    return false; // TODO: Throw instead?
  }

  async getTransactionCount() {
    const res = await this.rpcClient.request('getTransactionCount');
    console.log('getTransactionCount result', res);
    if (res.error) {
      throw new Error(res.error.message);
    }
    return joi.attempt(
      res.result,
      joi.number().required().min(0)
    );
  }

  async getLastId() {
    const res = await this.rpcClient.request('getLastId', []);
    console.log('getLastId', res);
    if (res.error) {
      throw new Error(res.error.message);
    }
    return joi.attempt(
      res.result,
      joi.string().required().min(43).max(44)
    );
  }

  async getFinality() {
    const res = await this.rpcClient.request('getFinality');
    console.log('getFinality', res);
    if (res.error) {
      throw new Error(res.error.message);
    }
    return joi.attempt(
      res.result,
      joi.number().required().min(0)
    );
  }

  async requestAirdrop(account, amount) {
    console.log(`TODO: airdrop ${amount} to ${account.publicKey}`);
    await sleep(500); // TODO
  }

  async sendTokens(from, to, amount) {
    const transaction = Buffer.from(
      // TODO: This is not the correct transaction payload
      `Transaction ${from.publicKey} ${to} ${amount}`
    );
    const signature = nacl.sign.detached(transaction, from.secretKey);

    console.log('Created signature of length', signature.length);
    await sleep(500); // TODO: transmit transaction + signature
    throw new Error(`Unable to send ${amount} tokens to ${to}`);
  }
}

