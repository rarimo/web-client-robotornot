import { Chain, CHAIN_TYPES } from '@distributedlab/w3p'
import mapKeys from 'lodash/mapKeys'
import pickBy from 'lodash/pickBy'
import { LogLevelDesc } from 'loglevel'

import packageJson from '../package.json'

export enum SUPPORTED_CHAINS {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  POLYGON = 'POLYGON',
  POLYGON_TESTNET = 'POLYGON_TESTNET',
  ARBITRUM = 'ARBITRUM',
  XDC = 'XDC',
}

export const SUPPORTED_CHAINS_DETAILS: Record<SUPPORTED_CHAINS, Chain> = {
  [SUPPORTED_CHAINS.SEPOLIA]: {
    id: '11155111',
    name: 'Sepolia',
    rpcUrl: 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    explorerUrl: 'https://sepolia.etherscan.io',
    token: {
      name: 'Sepolia',
      symbol: 'Sepolia',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  // FIXME: use the correct chain details for polygon
  [SUPPORTED_CHAINS.POLYGON]: {
    id: '137',
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com/',
    explorerUrl: 'https://polygonscan.com/',
    token: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  [SUPPORTED_CHAINS.POLYGON_TESTNET]: {
    id: '80001',
    name: 'Mumbai',
    rpcUrl: 'https://endpoints.omniatech.io/v1/matic/mumbai/public',
    explorerUrl: 'https://mumbai.polygonscan.com/',
    token: {
      name: 'Matic',
      symbol: 'Matic',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  [SUPPORTED_CHAINS.MAINNET]: {
    id: '1',
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io/',
    token: {
      name: 'Ethereum',
      symbol: 'Eth',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  [SUPPORTED_CHAINS.ARBITRUM]: {
    id: '42161',
    name: 'Arbitrum',
    rpcUrl: 'https://arbitrum.meowrpc.com',
    explorerUrl: 'https://arbiscan.io/',
    token: {
      name: 'Ethereum',
      symbol: 'Eth',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  [SUPPORTED_CHAINS.XDC]: {
    id: '50',
    name: 'XDC',
    rpcUrl: 'https://rpc-xdc.icecreamswap.com',
    explorerUrl: 'https://xdc.blocksscan.io/',
    token: {
      name: 'XDC',
      symbol: 'XDC',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
}

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  RARIMO_CORE_RPC_API_URL: import.meta.env.VITE_RARIMO_CORE_RPC_API_URL,
  RARIMO_EVM_RPC_URL: import.meta.env.VITE_RARIMO_EVM_RPC_URL,
  STATE_V2_CONTRACT_ADDRESS: import.meta.env.VITE_STATE_V2_CONTRACT_ADDRESS,

  UNSTOPPABLE_DOMAINS_CLIENT_ID: import.meta.env
    .VITE_UNSTOPPABLE_DOMAINS_CLIENT_ID,

  WORLDCOIN_APP_ID: import.meta.env.VITE_WORLDCOIN_APP_ID,
  AUTH_BJJ_CREDENTIAL_HASH: import.meta.env.VITE_AUTH_BJJ_CREDENTIAL_HASH,
  ISSUER_ID: import.meta.env.VITE_ISSUER_ID,

  ...(Object.values(SUPPORTED_CHAINS).reduce(
    (acc, curr) => ({
      ...acc,
      /* eslint-disable max-len */
      /* prettier-ignore */
      [`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_${curr}`] || '',
      /* prettier-ignore */
      [`LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${curr}`]:
        import.meta.env[`VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${curr}`] ||
        '',
    }),
    {},
  ) as {
    [k in
      | `IDENTITY_VERIFIER_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`
      | `LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`]: string
  }),

  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN as SUPPORTED_CHAINS,

  EXTERNAL_PLATFORM_REDIRECT_URL: import.meta.env
    .VITE_EXTERNAL_PLATFORM_REDIRECT_URL,

  CLAIM_OFFER_DELAY: import.meta.env.VITE_CLAIM_OFFER_DELAY || 1000,
  CLAIM_OFFER_MAX_TRIES_COUNT:
    import.meta.env.VITE_CLAIM_OFFER_MAX_TRIES_COUNT || 10,
  KYC_VERIFICATION_DELAY: import.meta.env.VITE_KYC_VERIFICATION_DELAY || 3000,

  CIRCUIT_URLS: {
    auth: {
      wasm: import.meta.env.VITE_AUTH_WASM_URL,
      zkey: import.meta.env.VITE_AUTH_ZKEY_URL,
    },
    sigV2OnChain: {
      wasm: import.meta.env.VITE_SIG_V2_ON_CHAIN_WASM_URL,
      zkey: import.meta.env.VITE_SIG_V2_ON_CHAIN_ZKEY_URL,
    },
    sigV2: {
      wasm: import.meta.env.VITE_SIG_V2_WASM_URL,
      zkey: import.meta.env.VITE_SIG_V2_ZKEY_URL,
    },
    mtpV2OnChain: {
      wasm: import.meta.env.VITE_MTP_V2_ON_CHAIN_WASM_URL,
      zkey: import.meta.env.VITE_MTP_V2_ON_CHAIN_ZKEY_URL,
    },
    mtpV2: {
      wasm: import.meta.env.VITE_MTP_V2_WASM_URL,
      zkey: import.meta.env.VITE_MTP_V2_ZKEY_URL,
    },
  },

  GA_ID: import.meta.env.VITE_GA_ID,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(window.document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
