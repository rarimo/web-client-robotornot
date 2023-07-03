import { Chain, CHAIN_TYPES } from '@distributedlab/w3p'
import mapKeys from 'lodash/mapKeys'
import pickBy from 'lodash/pickBy'
import { LogLevelDesc } from 'loglevel'

import packageJson from '../package.json'

export enum SUPPORTED_CHAINS {
  SEPOLIA = 'SEPOLIA',
  POLYGON = 'POLYGON',
  GOERLI = 'GOERLI',
}

export const SUPPORTED_CHAINS_DETAILS: Record<SUPPORTED_CHAINS, Chain> = {
  [SUPPORTED_CHAINS.SEPOLIA]: {
    id: '11155111',
    name: 'Sepolia',
    rpcUrl: 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    explorerUrl: 'https://sepolia.etherscan.io',
    token: {
      name: 'Sepolia',
      symbol: 'Sep',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
  // FIXME: use the correct chain details for polygon
  [SUPPORTED_CHAINS.POLYGON]: {
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
  [SUPPORTED_CHAINS.GOERLI]: {
    id: '5',
    name: 'Goerli',
    rpcUrl: 'https://ethereum-goerli.publicnode.com',
    explorerUrl: 'https://goerli.etherscan.io',
    token: {
      name: 'Goerli',
      symbol: 'Goerli',
      decimals: 18,
    },
    type: CHAIN_TYPES.EVM,
    icon: '',
  },
}

export const DEFAULT_CHAIN = SUPPORTED_CHAINS.SEPOLIA

export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  AUTH_BJJ_CREDENTIAL_HASH: import.meta.env.VITE_AUTH_BJJ_CREDENTIAL_HASH,

  /* eslint-disable max-len */
  /* prettier-ignore */
  DEMO_VERIFIER_CONTRACT_ADDRESS_SEPOLIA: import.meta.env.VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_SEPOLIA,
  /* prettier-ignore */
  ZKP_QUERIES_STORAGE_CONTRACT_ADDRESS_SEPOLIA: import.meta.env.VITE_ZKP_QUERIES_STORAGE_CONTRACT_ADDRESS_SEPOLIA,
  /* prettier-ignore */
  STATE_V2_CONTRACT_ADDRESS_SEPOLIA: import.meta.env.VITE_STATE_V2_CONTRACT_ADDRESS_SEPOLIA,

  /* prettier-ignore */
  DEMO_VERIFIER_CONTRACT_ADDRESS_POLYGON: import.meta.env.VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_POLYGON,
  /* prettier-ignore */
  ZKP_QUERIES_STORAGE_CONTRACT_ADDRESS_POLYGON: import.meta.env.VITE_ZKP_QUERIES_STORAGE_CONTRACT_ADDRESS_POLYGON,
  /* prettier-ignore */
  STATE_V2_CONTRACT_ADDRESS_POLYGON: import.meta.env.VITE_STATE_V2_CONTRACT_ADDRESS_POLYGON,

  /* prettier-ignore */
  DEMO_VERIFIER_CONTRACT_ADDRESS_GOERLI: import.meta.env.VITE_DEMO_VERIFIER_CONTRACT_ADDRESS_GOERLI,
  /* prettier-ignore */
  ZKP_QUERIES_STORAGE_CONTRACT_ADDRESS_GOERLI: import.meta.env.VITE_ZKP_QUERIES_STORAGE_CONTRACT_ADDRESS_GOERLI,
  /* prettier-ignore */
  STATE_V2_CONTRACT_ADDRESS_GOERLI: import.meta.env.VITE_STATE_V2_CONTRACT_ADDRESS_GOERLI,
  /* eslint-enable */
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
