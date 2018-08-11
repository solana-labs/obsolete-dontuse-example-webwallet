/*
 * Solana Web3 Client Interface
 *
 */

function sleep(duration: number = 0): Promise<void> {
  return new Promise((accept) => {
    setTimeout(accept, duration);
  });
}

export class Web3Sol {
  balance = 0;
  publicKey = '';
  endpoint = null;

  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getPublicKey() {
    await sleep(500); // TODO
    this.publicKey = 'EJeyhbqwYBvoAbC1pfxiHJRrV5CZu3MZzP8kBu3sKthY'; // TODO

    return this.publicKey;
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
    await sleep(500); // TODO
    throw new Error(`Unable to send ${amount} tokens to ${to}`);
  }
}

