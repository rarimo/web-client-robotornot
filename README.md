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

# Client Id of created "client" in your Unstoppable Domains account
# To create client, check this guide https://docs.unstoppabledomains.com/identity/overview/login-with-unstoppable/, especcialy video guide
VITE_UNSTOPPABLE_DOMAINS_CLIENT_ID=

# App Id of created project in your Worldcoin account (developer portal)
# To create it, check this guide https://docs.worldcoin.org/quick-start
VITE_WORLDCOIN_APP_ID=

# https://0xpolygonid.github.io/tutorials/issuer/cred-issue-methods/#verifiable-presentations-leveraging-zk-proofs
# Get this hash by generate Keccak256(<JSON-LD schema_url>) last 16 bytes
VITE_AUTH_BJJ_CREDENTIAL_HASH=cca3371a6cb1b715004407e325bd993c

# redirect link for success page
VITE_EXTERNAL_PLATFORM_REDIRECT_URL=https://galxe.com/

# delay for offer requesting
VITE_CLAIM_OFFER_DELAY=1000
# max tries count for offer requesting
VITE_CLAIM_OFFER_MAX_TRIES_COUNT=10
# delay for kyc verification details requesting
VITE_KYC_VERIFICATION_DELAY=1000

```

Go to https://gitlab.com/rarimo/identity/contracts to get more info about contracts or deploy them by yourself

To setup contract addresses follow this format:
```dotenv
VITE_QUERY_VERIFIER_CONTRACT_ADDRESS_[CHAIN_NAME]=0x000000000
VITE_VERIFIED_SBT_CONTRACT_ADDRESS_[CHAIN_NAME]=0x000000000
```

currently supported chains is ```[SEPOLIA, POLYGON, POLYGON_TESTNET]```

And set the default chain you'll work with

e. g:
```dotenv
VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_SEPOLIA=0x...
VITE_STATE_V2_CONTRACT_ADDRESS_SEPOLIA=0x...

VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_POLYGON=0x...
VITE_STATE_V2_CONTRACT_ADDRESS_POLYGON=0x...

VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_GOERLI=0x...
VITE_STATE_V2_CONTRACT_ADDRESS_GOERLI=0x...

VITE_DEFAULT_CHAIN='SEPOLIA'
```

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
