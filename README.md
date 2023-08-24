# Distributed Lab react started template

## Project setup
```
yarn | yarn install
```

## Getting Started

### Setup environment variables
```dotenv
# API url of deployed services(issuer, kyc-service, ...etc), https://gitlab.com/rarimo/identity/developer-edition
VITE_API_URL=http://127.0.0.1:8000
# APP title name
VITE_APP_NAME=Identity

# RPC API of rarimo-core https://gitlab.com/rarimo/dev-edition
VITE_RARIMO_CORE_RPC_API_URL=http://localhost:1317
# RPC of rarimo-core (evm) https://gitlab.com/rarimo/dev-edition
VITE_RARIMO_EVM_RPC_URL=http://localhost:8545
# Contract addres of deployed state contract at the rarimo core chain
VITE_STATE_V2_CONTRACT_ADDRESS=0x...

# Client Id of created "client" in your Unstoppable Domains account
# To create client, check this guide https://docs.unstoppabledomains.com/identity/overview/login-with-unstoppable/, especcialy video guide
VITE_UNSTOPPABLE_DOMAINS_CLIENT_ID=

# App Id of created project in your Worldcoin account (developer portal)
# To create it, check this guide https://docs.worldcoin.org/quick-start
VITE_WORLDCOIN_APP_ID=

# https://0xpolygonid.github.io/tutorials/issuer/cred-issue-methods/#verifiable-presentations-leveraging-zk-proofs
# Get this hash by generate Keccak256(<JSON-LD schema_url>) last 16 bytes
VITE_AUTH_BJJ_CREDENTIAL_HASH=cca3371a6cb1b715004407e325bd993c

# 0x + hex(issuerID.BigInt.Bytes)
# issuerID.BigInt.Bytes - can be found in issuer-svc logs at startup
# setup this env and add it to te IdentityVerifier contract issuers whitelist
VITE_ISSUER_ID=0x0c761d5a56cf03b6ef6a6180f24531bb70962609c2970fdec52c22a3920001

# Amount of blocks to wait after state transition
VITE_FINALITY_BLOCK_AMOUNT=10

# redirect link for success page
VITE_EXTERNAL_PLATFORM_REDIRECT_URL=https://galxe.com/

# delay for offer requesting
VITE_CLAIM_OFFER_DELAY=1000
# max tries count for offer requesting
VITE_CLAIM_OFFER_MAX_TRIES_COUNT=10
# delay for kyc verification details requesting
VITE_KYC_VERIFICATION_DELAY=1000

# Google Analytics measurement id
VITE_GA_ID=
```

Go to https://gitlab.com/rarimo/identity/contracts to get more info about contracts or deploy them by yourself

To setup contract addresses follow this format:
```dotenv
VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_[CHAIN_NAME]=0x000000000
VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_[CHAIN_NAME]=0x000000000
```

currently supported chains is ```[SEPOLIA, POLYGON, POLYGON_TESTNET]```

And set the default chain you'll work with

e. g:
```dotenv
VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_SEPOLIA=0x...
VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_SEPOLIA=0x...

VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_POLYGON=0x...
VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_POLYGON=0x...

VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_GOERLI=0x...
VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_GOERLI=0x...

VITE_DEFAULT_CHAIN='SEPOLIA'
```

Additionally you can setup your custom circuit urls, splitted by type:
```dotenv
# for getting credentials
VITE_AUTH_WASM_URL=https://example.com
VITE_AUTH_ZKEY_URL=https://example.com

# credentialAtomicQuerySigV2OnChain
VITE_SIG_V2_ON_CHAIN_WASM_URL=https://example.com
VITE_SIG_V2_ON_CHAIN_ZKEY_URL=https://example.com

# credentialAtomicQuerySigV2
VITE_SIG_V2_WASM_URL=https://example.com
VITE_SIG_V2_ZKEY_URL=https://example.com

# credentialAtomicQueryMTPV2OnChain
VITE_MTP_V2_ON_CHAIN_WASM_URL=https://example.com
VITE_MTP_V2_ON_CHAIN_ZKEY_URL=https://example.com

# credentialAtomicQueryMTPV2
VITE_MTP_V2_WASM_URL=https://example.com
VITE_MTP_V2_ZKEY_URL=https://example.com
```

Sometimes loaded file can throw an empty error, so to fix that you can define this env:

.env
```dotenv
VITE_CIRCUITS_LOADING_TRIES_LIMIT=3
```

env.js
```js
{
  VITE_APP_CIRCUITS_LOADING_TRIES_LIMIT: 3
}
```

to retry loading circuit file

### Deploy
To update variables in deployed app - setup .env variables from .env.example to [env.js](./static/env.js) but in `JSON` format, and change `VITE_` prefix to `VITE_APP`
```js
document.ENV = document.ENV || Object.freeze({
  VITE_APP_API_URL: "http://127.0.0.1:8000",
  VITE_APP_APP_NAME: "Identity",

  VITE_APP_RARIMO_CORE_RPC_API_URL: "http://localhost:1317",
  VITE_APP_RARIMO_EVM_RPC_URL: "http://localhost:8545",
  VITE_APP_STATE_V2_CONTRACT_ADDRESS: " ",

  VITE_APP_UNSTOPPABLE_DOMAINS_CLIENT_ID: "",

  VITE_APP_WORLDCOIN_APP_ID: "",
  VITE_APP_AUTH_BJJ_CREDENTIAL_HASH: "cca3371a6cb1b715004407e325bd993c",
  VITE_APP_ISSUER_ID: " ",

  VITE_APP_FINALITY_BLOCK_AMOUNT: "10",

  VITE_APP_IDENTITY_VERIFIER_CONTRACT_ADDRESS_SEPOLIA: " ",
  VITE_APP_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_SEPOLIA: " ",

  VITE_APP_IDENTITY_VERIFIER_CONTRACT_ADDRESS_POLYGON: " ",
  VITE_APP_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_POLYGON: " ",

  VITE_APP_IDENTITY_VERIFIER_CONTRACT_ADDRESS_GOERLI: " ",
  VITE_APP_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_GOERLI: " ",

  VITE_APP_DEFAULT_CHAIN: "SEPOLIA",

  VITE_APP_EXTERNAL_PLATFORM_REDIRECT_URL: " ",

  VITE_APP_CLAIM_OFFER_DELAY: "1000",
  VITE_APP_CLAIM_OFFER_MAX_TRIES_COUNT: "10",
  VITE_APP_KYC_VERIFICATION_DELAY: "1000",

  VITE_APP_AUTH_WASM_URL: '',
  VITE_APP_AUTH_ZKEY_URL: '',

  VITE_APP_SIG_V2_ON_CHAIN_WASM_URL: '',
  VITE_APP_SIG_V2_ON_CHAIN_ZKEY_URL: '',

  VITE_APP_SIG_V2_WASM_URL: '',
  VITE_APP_SIG_V2_ZKEY_URL: '',

  VITE_APP_MTP_V2_ON_CHAIN_WASM_URL: '',
  VITE_APP_MTP_V2_ON_CHAIN_ZKEY_URL: '',

  VITE_APP_MTP_V2_WASM_URL: '',
  VITE_APP_MTP_V2_ZKEY_URL: '',

  VITE_APP_GA_ID: '',
})
```

### Chains List
By following [this](./src/assets/fallback-supported-chains.json) scheme, you can define a list of supported chains, e. g.

`JSON stringify` this js object:
```json
{
  "SEPOLIA": {
    "id": "11155111",
    "name": "Sepolia chain",
    "rpcUrl": "https://endpoints.omniatech.io/v1/eth/sepolia/public",
    "explorerUrl": "https://sepolia.etherscan.io",
    "token": {
      "name": "Sepolia",
      "symbol": "Sepolia",
      "decimals": 18
    },
    "type": "EVM",
    "icon": "ethereum"
  },
  "POLYGON": {
    "id": "137",
    "name": "Polygon chain",
    "rpcUrl": "https://polygon-rpc.com/",
    "explorerUrl": "https://polygonscan.com/",
    "token": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "type": "EVM",
    "icon": "polygon"
  },
  "POLYGON_TESTNET": {
    "id": "80001",
    "name": "Polygon Testnet chain",
    "rpcUrl": "https://endpoints.omniatech.io/v1/matic/mumbai/public",
    "explorerUrl": "https://mumbai.polygonscan.com/",
    "token": {
      "name": "Matic",
      "symbol": "Matic",
      "decimals": 18
    },
    "type": "EVM",
    "icon": "polygon"
  },
  "MAINNET": {
    "id": "1",
    "name": "Ethereum",
    "rpcUrl": "https://eth.llamarpc.com",
    "explorerUrl": "https://etherscan.io/",
    "token": {
      "name": "Ethereum",
      "symbol": "Eth",
      "decimals": 18
    },
    "type": "EVM",
    "icon": "ethereum"
  },
  "ARBITRUM": {
    "id": "42161",
    "name": "Arbitrum",
    "rpcUrl": "https://arbitrum.meowrpc.com",
    "explorerUrl": "https://arbiscan.io/",
    "token": {
      "name": "Ethereum",
      "symbol": "Eth",
      "decimals": 18
    },
    "type": "EVM",
    "icon": "arbitrum"
  },
  "XDC": {
    "id": "50",
    "name": "XDC",
    "rpcUrl": "https://rpc-xdc.icecreamswap.com",
    "explorerUrl": "https://xdc.blocksscan.io/",
    "token": {
      "name": "XDC",
      "symbol": "XDC",
      "decimals": 18
    },
    "type": "EVM",
    "icon": "ethereum"
  }
}
```

where key - is a supported chain and value is a chain details

then put into .env file or env.js file

.env
```dotenv
VITE_SUPPORTED_CHAINS_DETAILS='{"SEPOLIA":{"id":"11155111","name":"Sepolia chain","rpcUrl":"https://endpoints.omniatech.io/v1/eth/sepolia/public","explorerUrl":"https://sepolia.etherscan.io","token":{"name":"Sepolia","symbol":"Sepolia","decimals":18},"type":"EVM","icon":"ethereum"},"POLYGON":{"id":"137","name":"Polygon chain","rpcUrl":"https://polygon-rpc.com/","explorerUrl":"https://polygonscan.com/","token":{"name":"MATIC","symbol":"MATIC","decimals":18},"type":"EVM","icon":"polygon"},"POLYGON_TESTNET":{"id":"80001","name":"Polygon Testnet chain","rpcUrl":"https://endpoints.omniatech.io/v1/matic/mumbai/public","explorerUrl":"https://mumbai.polygonscan.com/","token":{"name":"Matic","symbol":"Matic","decimals":18},"type":"EVM","icon":"polygon"},"MAINNET":{"id":"1","name":"Ethereum","rpcUrl":"https://eth.llamarpc.com","explorerUrl":"https://etherscan.io/","token":{"name":"Ethereum","symbol":"Eth","decimals":18},"type":"EVM","icon":"ethereum"},"ARBITRUM":{"id":"42161","name":"Arbitrum","rpcUrl":"https://arbitrum.meowrpc.com","explorerUrl":"https://arbiscan.io/","token":{"name":"Ethereum","symbol":"Eth","decimals":18},"type":"EVM","icon":"arbitrum"},"XDC":{"id":"50","name":"XDC","rpcUrl":"https://rpc-xdc.icecreamswap.com","explorerUrl":"https://xdc.blocksscan.io/","token":{"name":"XDC","symbol":"XDC","decimals":18},"type":"EVM","icon":"ethereum"}}'
```

env.js
```js
{
  VITE_APP_SUPPORTED_CHAINS_DETAILS: '{"SEPOLIA":{"id":"11155111","name":"Sepolia chain","rpcUrl":"https://endpoints.omniatech.io/v1/eth/sepolia/public","explorerUrl":"https://sepolia.etherscan.io","token":{"name":"Sepolia","symbol":"Sepolia","decimals":18},"type":"EVM","icon":"ethereum"},"POLYGON":{"id":"137","name":"Polygon chain","rpcUrl":"https://polygon-rpc.com/","explorerUrl":"https://polygonscan.com/","token":{"name":"MATIC","symbol":"MATIC","decimals":18},"type":"EVM","icon":"polygon"},"POLYGON_TESTNET":{"id":"80001","name":"Polygon Testnet chain","rpcUrl":"https://endpoints.omniatech.io/v1/matic/mumbai/public","explorerUrl":"https://mumbai.polygonscan.com/","token":{"name":"Matic","symbol":"Matic","decimals":18},"type":"EVM","icon":"polygon"},"MAINNET":{"id":"1","name":"Ethereum","rpcUrl":"https://eth.llamarpc.com","explorerUrl":"https://etherscan.io/","token":{"name":"Ethereum","symbol":"Eth","decimals":18},"type":"EVM","icon":"ethereum"},"ARBITRUM":{"id":"42161","name":"Arbitrum","rpcUrl":"https://arbitrum.meowrpc.com","explorerUrl":"https://arbiscan.io/","token":{"name":"Ethereum","symbol":"Eth","decimals":18},"type":"EVM","icon":"arbitrum"},"XDC":{"id":"50","name":"XDC","rpcUrl":"https://rpc-xdc.icecreamswap.com","explorerUrl":"https://xdc.blocksscan.io/","token":{"name":"XDC","symbol":"XDC","decimals":18},"type":"EVM","icon":"ethereum"}}'
}
```

After that you can set into `VITE_DEFAULT_CHAIN` any of supported chains you've defined (keys of object)

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Run unit tests
```
yarn test
```

### Lints release/release candidate version
```
yarn rsc %release-version%
```

### Build docker image with version
```
 docker build --no-cache --progress=plain --build-arg BUILD_VERSION=1.0.0-rc.0 -t react-template .
```

## Some additional features

### JsonApi lib

[@distributedlab/jac](https://distributed-lab.github.io/web-kit/modules/_distributedlab_jac.html)

### Web3 provider wrapper lib

[@distributedlab/w3p](https://distributed-lab.github.io/web-kit/modules/_distributedlab_w3p.html)

### Utils, tools, helpers, ...etc

[@distributedlab/tools](https://distributed-lab.github.io/web-kit/modules/_distributedlab_tools.html)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details
