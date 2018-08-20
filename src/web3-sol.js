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
    try {
      const res = await this.rpcClient.request(
        'getBalance',
        [bs58.encode(this.keypair.publicKey)]
      );
      console.log('getBalance result', res);
      if (res.error) {
        throw new Error(res.error.message);
      }
      this.balance = joi.attempt(
        res.result,
        joi.number().required().min(0)
      );
    } catch (err) {
      console.log('Failed to getBalance:', err);
      // TODO: Throw?
    }
    return this.balance;
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
    // TODO: Throw?
    return false;
  }

  async getTransactionCount() {
    try {
      const res = await this.rpcClient.request('getTransactionCount');
      console.log('getTransactionCount result', res);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return joi.attempt(
        res.result,
        joi.number().required().min(0)
      );
    } catch (err) {
      console.log('Failed to getTransactionCount:', err);
    }
    // TODO: Throw?
    return 0;
  }

  async getLastId() {
    try {
      const res = await this.rpcClient.request('getLastId');
      console.log('getLastId', res);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return joi.attempt(
        res.result,
        joi.string().required().min(44).max(44)
      );
    } catch (err) {
      console.log('Failed to getLastId:', err);
    }
    // TODO: Throw?
    return 0;
  }

  async getFinality() {
    try {
      const res = await this.rpcClient.request('getFinality');
      console.log('getFinality', res);
      if (res.error) {
        throw new Error(res.error.message);
      }
      return joi.attempt(
        res.result,
        joi.number().required().min(0)
      );
    } catch (err) {
      console.log('Failed to getFinality:', err);
    }
    // TODO: Throw?
    return 0;
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

