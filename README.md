[![Build status][travis-image]][travis-url]

[travis-image]: https://api.travis-ci.org/solana-labs/example-webwallet.svg?branch=master
[travis-url]: https://travis-ci.org/solana-labs/example-webwallet

# Example Web Wallet

This project demonstrates how to use the [Solana Javascript API](https://github.com/solana-labs/solana-web3.js)
to implement a simple web wallet.

**IMPORTANT: This wallet does not sufficently protect the private keys it
generates and should NOT be used in a non-test environment**

## Getting Started

```
$ npm install
$ npm run start
```

Then open your browser to http://localhost:8080/

## Development

When making changes, using the webpack-dev-server can be quite convenient as it
will rebuild and reload the app automatically

```
$ npm run dev
```

