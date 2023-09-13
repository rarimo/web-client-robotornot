import { Chain } from '@distributedlab/w3p'
import mapKeys from 'lodash/mapKeys'
import pickBy from 'lodash/pickBy'
import { LogLevelDesc } from 'loglevel'

import FALLBACK_SUPPORTED_CHAINS from '@/assets/fallback-supported-chains.json'

import packageJson from '../package.json'

export type SUPPORTED_CHAINS = keyof typeof FALLBACK_SUPPORTED_CHAINS

type ContractAddresses = {
  [k in
    | `IDENTITY_VERIFIER_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`
    | `LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`]: string
}

export const FALLBACK_CIRCUIT_URLS = {
  auth: {
    wasm: `${window.location.origin}/circuits/auth/circuit.wasm`,
    zkey: `${window.location.origin}/circuits/auth/circuit_final.zkey`,
  },
  sigV2OnChain: {
    wasm: `${window.location.origin}/circuits/credentialAtomicQueryMTPV2OnChain/circuit.wasm`,
    zkey: `${window.location.origin}/circuits/credentialAtomicQueryMTPV2OnChain/circuit_final.zkey`,
  },
  sigV2: {
    wasm: `${window.location.origin}/circuits/credentialAtomicQuerySigV2/circuit.wasm`,
    zkey: `${window.location.origin}/circuits/credentialAtomicQuerySigV2/circuit_final.zkey`,
  },
  mtpV2OnChain: {
    wasm: `${window.location.origin}/circuits/credentialAtomicQueryMTPV2OnChain/circuit.wasm`,
    zkey: `${window.location.origin}/circuits/credentialAtomicQueryMTPV2OnChain/circuit_final.zkey`,
  },
  mtpV2: {
    wasm: `${window.location.origin}/circuits/credentialAtomicQueryMTPV2/circuit.wasm`,
    zkey: `${window.location.origin}/circuits/credentialAtomicQueryMTPV2/circuit_final.zkey`,
  },
}

export const META_CIRCUIT_URLS = {
  AUTH_WASM_URL: import.meta.env.VITE_AUTH_WASM_URL,
  AUTH_ZKEY_URL: import.meta.env.VITE_AUTH_ZKEY_URL,
  SIG_V2_ON_CHAIN_WASM_URL: import.meta.env.VITE_SIG_V2_ON_CHAIN_WASM_URL,
  SIG_V2_ON_CHAIN_ZKEY_URL: import.meta.env.VITE_SIG_V2_ON_CHAIN_ZKEY_URL,
  SIG_V2_WASM_URL: import.meta.env.VITE_SIG_V2_WASM_URL,
  SIG_V2_ZKEY_URL: import.meta.env.VITE_SIG_V2_ZKEY_URL,
  MTP_V2_ON_CHAIN_WASM_URL: import.meta.env.VITE_MTP_V2_ON_CHAIN_WASM_URL,
  MTP_V2_ON_CHAIN_ZKEY_URL: import.meta.env.VITE_MTP_V2_ON_CHAIN_ZKEY_URL,
  MTP_V2_WASM_URL: import.meta.env.VITE_MTP_V2_WASM_URL,
  MTP_V2_ZKEY_URL: import.meta.env.VITE_MTP_V2_ZKEY_URL,
}
Object.assign(META_CIRCUIT_URLS, _mapEnvCfg(window.document.ENV))

export const config = {
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,

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

  FINALITY_BLOCK_AMOUNT: import.meta.env.VITE_FINALITY_BLOCK_AMOUNT || 3,

  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN as SUPPORTED_CHAINS,

  EXTERNAL_PLATFORM_REDIRECT_URL: import.meta.env
    .VITE_EXTERNAL_PLATFORM_REDIRECT_URL,

  CLAIM_OFFER_DELAY: import.meta.env.VITE_CLAIM_OFFER_DELAY || 1000,
  CLAIM_OFFER_MAX_TRIES_COUNT:
    import.meta.env.VITE_CLAIM_OFFER_MAX_TRIES_COUNT || 5,
  KYC_VERIFICATION_DELAY: import.meta.env.VITE_KYC_VERIFICATION_DELAY || 3000,

  CIRCUIT_URLS: {
    ...FALLBACK_CIRCUIT_URLS,

    ...(META_CIRCUIT_URLS.AUTH_WASM_URL && META_CIRCUIT_URLS.AUTH_ZKEY_URL
      ? {
          auth: {
            wasm: META_CIRCUIT_URLS.AUTH_WASM_URL,
            zkey: META_CIRCUIT_URLS.AUTH_ZKEY_URL,
          },
        }
      : {}),

    ...(META_CIRCUIT_URLS.SIG_V2_ON_CHAIN_WASM_URL &&
    META_CIRCUIT_URLS.SIG_V2_ON_CHAIN_ZKEY_URL
      ? {
          sigV2OnChain: {
            wasm: META_CIRCUIT_URLS.SIG_V2_ON_CHAIN_WASM_URL,
            zkey: META_CIRCUIT_URLS.SIG_V2_ON_CHAIN_ZKEY_URL,
          },
        }
      : {}),

    ...(META_CIRCUIT_URLS.SIG_V2_WASM_URL && META_CIRCUIT_URLS.SIG_V2_ZKEY_URL
      ? {
          sigV2: {
            wasm: META_CIRCUIT_URLS.SIG_V2_WASM_URL,
            zkey: META_CIRCUIT_URLS.SIG_V2_ZKEY_URL,
          },
        }
      : {}),

    ...(META_CIRCUIT_URLS.MTP_V2_ON_CHAIN_WASM_URL &&
    META_CIRCUIT_URLS.MTP_V2_ON_CHAIN_ZKEY_URL
      ? {
          mtpV2OnChain: {
            wasm: META_CIRCUIT_URLS.MTP_V2_ON_CHAIN_WASM_URL,
            zkey: META_CIRCUIT_URLS.MTP_V2_ON_CHAIN_ZKEY_URL,
          },
        }
      : {}),
    ...(META_CIRCUIT_URLS.MTP_V2_WASM_URL && META_CIRCUIT_URLS.MTP_V2_ZKEY_URL
      ? {
          mtpV2: {
            wasm: META_CIRCUIT_URLS.MTP_V2_WASM_URL,
            zkey: META_CIRCUIT_URLS.MTP_V2_ZKEY_URL,
          },
        }
      : {}),
  },

  GA_ID: import.meta.env.VITE_GA_ID,

  SUPPORTED_CHAINS_DETAILS: (import.meta.env.VITE_SUPPORTED_CHAINS_DETAILS
    ? JSON.parse(import.meta.env.VITE_SUPPORTED_CHAINS_DETAILS)
    : FALLBACK_SUPPORTED_CHAINS) as Record<
    keyof typeof FALLBACK_SUPPORTED_CHAINS,
    Chain
  >,

  CIRCUITS_LOADING_TRIES_LIMIT:
    import.meta.env.VITE_CIRCUITS_LOADING_TRIES_LIMIT || 3,

  SNAP_ORIGIN:
    import.meta.env.VITE_SNAP_ORIGIN || 'local:http://localhost:8081',
  SNAP_VERSION: import.meta.env.VITE_SNAP_ORIGIN || '0.1.0',
} as {
  ENVIRONMENT: 'staging' | 'production' | 'dev' | 'analyze'

  API_URL: string
  APP_NAME: string
  LOG_LEVEL: string
  BUILD_VERSION: string

  RARIMO_CORE_RPC_API_URL: string
  RARIMO_EVM_RPC_URL: string
  STATE_V2_CONTRACT_ADDRESS: string

  UNSTOPPABLE_DOMAINS_CLIENT_ID: string

  WORLDCOIN_APP_ID: string
  AUTH_BJJ_CREDENTIAL_HASH: string
  ISSUER_ID: string

  FINALITY_BLOCK_AMOUNT: number

  DEFAULT_CHAIN: SUPPORTED_CHAINS

  EXTERNAL_PLATFORM_REDIRECT_URL: string

  CLAIM_OFFER_DELAY: number
  CLAIM_OFFER_MAX_TRIES_COUNT: number
  KYC_VERIFICATION_DELAY: number

  CIRCUIT_URLS: typeof FALLBACK_CIRCUIT_URLS

  GA_ID: string

  SUPPORTED_CHAINS_DETAILS: Record<
    keyof typeof FALLBACK_SUPPORTED_CHAINS,
    Chain
  >
  CIRCUITS_LOADING_TRIES_LIMIT: number
  SNAP_ORIGIN: string
  SNAP_VERSION: string
} & Partial<ContractAddresses>

Object.assign(config, {
  ...(Object.keys(config.SUPPORTED_CHAINS_DETAILS).reduce(
    (acc, curr) => ({
      ...acc,
      /* eslint-disable max-len */
      /* prettier-ignore */
      [`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_${curr}`] || '',
      /* prettier-ignore */
      [`LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${curr}`] || '',
    }),
    {},
  ) as ContractAddresses),
})

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(window.document.ENV))

if (typeof config.SUPPORTED_CHAINS_DETAILS === 'string') {
  config.SUPPORTED_CHAINS_DETAILS = {
    ...FALLBACK_SUPPORTED_CHAINS,
    ...(JSON.parse(config.SUPPORTED_CHAINS_DETAILS) as Record<
      keyof typeof FALLBACK_SUPPORTED_CHAINS,
      Chain
    >),
  }
}

function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
