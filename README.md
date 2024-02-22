# Distributed Lab react started template

## Project setup
```
yarn | yarn install
```

## Getting Started

### Setup environment variables from [here](./.env.example)

Go to https://gitlab.com/rarimo/identity/contracts to get more info about contracts or deploy them by yourself

To setup contract addresses follow this format:
```dotenv
VITE_DEFAULT_CHAIN=VITE_DEFAULT_CHAIN_VALUE
VITE_IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_[VITE_DEFAULT_CHAIN_VALUE]=0x000000000
VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_[VITE_DEFAULT_CHAIN_VALUE]=0x000000000
```

### Deploy
To update variables in deployed app - setup .env variables from .env.example to [env.js](./static/env.js) but in `JSON` format, and change `VITE_` prefix to `VITE_APP`
```js
document.ENV = document.ENV || Object.freeze({
  VITE_DEFAULT_CHAIN: "SEPOLIA",
  VITE_IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_SEPOLIA: "0x...",
  VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_SEPOLIA: "0x...",
  ...,
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
