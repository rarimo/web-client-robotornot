import { Chain } from '@distributedlab/w3p'

// import mapKeys from 'lodash/mapKeys'
// import pickBy from 'lodash/pickBy'
import FALLBACK_SUPPORTED_CHAINS from '@/assets/fallback-supported-chains.json'

import packageJson from '../package.json'

export type SUPPORTED_CHAINS = keyof typeof FALLBACK_SUPPORTED_CHAINS

type ContractAddresses = {
  [k in
    | `IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`
    | `IDENTITY_VERIFIER_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`
    // FIXME: remove
    | `LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${SUPPORTED_CHAINS}`]: string
}

export type AppConfig = {
  MODE: 'production' | 'development'

  API_URL: string
  ISSUER_API_URL: string
  APP_NAME: string

  BUILD_VERSION: string

  UNSTOPPABLE_DOMAINS_CLIENT_ID: string
  WORLDCOIN_APP_ID: string

  DEFAULT_CHAIN: SUPPORTED_CHAINS

  EXTERNAL_PLATFORM_REDIRECT_URL: string

  LEGACY_CLAIM_TYPE: string
  CLAIM_TYPE: string
  CLAIM_OFFER_DELAY: number
  PROOF_GEN_DELAY: number

  GA_ID: string

  SUPPORTED_CHAINS_DETAILS: Record<
    keyof typeof FALLBACK_SUPPORTED_CHAINS,
    Chain
  >

  CHROME_METAMASK_ADDON_LINK: string
  FIREFOX_METAMASK_ADDON_LINK: string
  OPERA_METAMASK_ADDON_LINK: string

  EXTERNAL_LANDING_URL: string

  SUPPORT_LINK: string
  COMMUNITY_LINK: string
} & Partial<ContractAddresses>

export const config: AppConfig = {
  MODE: import.meta.env.VITE_MODE,

  API_URL: import.meta.env.VITE_API_URL,
  ISSUER_API_URL: import.meta.env.VITE_ISSUER_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,

  UNSTOPPABLE_DOMAINS_CLIENT_ID: import.meta.env
    .VITE_UNSTOPPABLE_DOMAINS_CLIENT_ID,

  WORLDCOIN_APP_ID: import.meta.env.VITE_WORLDCOIN_APP_ID,

  DEFAULT_CHAIN: import.meta.env.VITE_DEFAULT_CHAIN as SUPPORTED_CHAINS,

  EXTERNAL_PLATFORM_REDIRECT_URL: import.meta.env
    .VITE_EXTERNAL_PLATFORM_REDIRECT_URL,

  LEGACY_CLAIM_TYPE: import.meta.env.VITE_LEGACY_CLAIM_TYPE,
  CLAIM_TYPE: import.meta.env.VITE_CLAIM_TYPE,
  CLAIM_OFFER_DELAY: import.meta.env.VITE_CLAIM_OFFER_DELAY || 1000,
  PROOF_GEN_DELAY: import.meta.env.VITE_PROOF_GEN_DELAY || 4000,

  GA_ID: import.meta.env.VITE_GA_ID,

  SUPPORTED_CHAINS_DETAILS: {
    ...FALLBACK_SUPPORTED_CHAINS,
    ...(import.meta.env.VITE_SUPPORTED_CHAINS_DETAILS &&
      JSON.parse(import.meta.env.VITE_SUPPORTED_CHAINS_DETAILS)),
  } as Record<keyof typeof FALLBACK_SUPPORTED_CHAINS, Chain>,

  CHROME_METAMASK_ADDON_LINK:
    'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  FIREFOX_METAMASK_ADDON_LINK:
    'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
  OPERA_METAMASK_ADDON_LINK:
    'https://addons.opera.com/en/extensions/details/metamask-10/',

  EXTERNAL_LANDING_URL: 'https://rarimo.com/',

  SUPPORT_LINK: import.meta.env.VITE_SUPPORT_LINK,
  COMMUNITY_LINK: import.meta.env.VITE_COMMUNITY_LINK,
}

Object.assign(config, {
  ...(Object.keys(config.SUPPORTED_CHAINS_DETAILS).reduce(
    (acc, curr) => ({
      ...acc,
      /* eslint-disable max-len */
      /* prettier-ignore */
      [`IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_${curr}`] || '',
      /* eslint-disable max-len */
      /* prettier-ignore */
      [`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_IDENTITY_VERIFIER_CONTRACT_ADDRESS_${curr}`] || '',
      /* prettier-ignore */
      [`LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${curr}`]: import.meta.env[`VITE_LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${curr}`] || '',
    }),
    {},
  ) as ContractAddresses),
})

// Object.assign(config, _mapEnvCfg(import.meta.env))
// Object.assign(config, _mapEnvCfg(window.document.ENV))

if (typeof config.SUPPORTED_CHAINS_DETAILS === 'string') {
  config.SUPPORTED_CHAINS_DETAILS = {
    ...FALLBACK_SUPPORTED_CHAINS,
    ...(JSON.parse(config.SUPPORTED_CHAINS_DETAILS) as Record<
      keyof typeof FALLBACK_SUPPORTED_CHAINS,
      Chain
    >),
  }
}

// function _mapEnvCfg(env: ImportMetaEnv | typeof window.document.ENV): {
//   [k: string]: string | boolean | undefined
// } {
//   return mapKeys(
//     pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
//     (v, k) => k.replace(/^VITE_APP_/, ''),
//   )
// }
