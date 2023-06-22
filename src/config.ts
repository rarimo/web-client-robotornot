import { mapKeys, pickBy } from 'lodash-es'
import { LogLevelDesc } from 'loglevel'

import packageJson from '../package.json'

export const CONFIG = {
  CHAIN_API_URL: import.meta.env.VITE_APP_CHAIN_API_URL,
  CHAIN_RPC_URL: import.meta.env.VITE_APP_CHAIN_RPC_URL,
  CHAIN_ID: import.meta.env.VITE_APP_CHAIN_ID,
  CHAIN_RPC_URL_WS: import.meta.env.VITE_APP_CHAIN_RPC_URL_WS,
  DEVNET_URL: import.meta.env.VITE_APP_DEVNET_URL,
  TESTNET_URL: import.meta.env.VITE_APP_TESTNET_URL,
  MAINNET_URL: import.meta.env.VITE_APP_MAINNET_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  DENOM: import.meta.env.VITE_APP_DENOM,
  MINIMAL_DENOM: import.meta.env.VITE_APP_MINIMAL_DENOM,
  GRAPHQL_URL: import.meta.env.VITE_APP_GRAPHQL_URL,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  // Gas price
  GAS_PRICE_STEP_LOW: import.meta.env.VITE_APP_GAS_PRICE_STEP_LOW,
  GAS_PRICE_STEP_AVG: import.meta.env.VITE_APP_GAS_PRICE_STEP_AVG,
  GAS_PRICE_STEP_HIGH: import.meta.env.VITE_APP_GAS_PRICE_STEP_HIGH,

  // Internal
  DECIMALS: 6,
  WEI_DECIMALS: 18,
  PERCENT_DECIMALS: 2,
  AMOUNT_DECIMALS: 2,
  PAGE_LIMIT: 10,
  UPDATE_INTERVAL: 5000,
  NANO_IN_MILLISECONDS: 1000000,
  FEE_AMOUNT: 100000000,
  GAS_AMOUNT: 10000000,
} as const

Object.assign(CONFIG, _mapEnvCfg(import.meta.env))
Object.assign(CONFIG, _mapEnvCfg(window.document.ENV))

export function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
