/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string

  VITE_RARIMO_CORE_RPC_API_URL: string
  VITE_RARIMO_EVM_RPC_URL: string
  VITE_STATE_V2_CONTRACT_ADDRESS: string

  VITE_UNSTOPPABLE_DOMAINS_CLIENT_ID: string

  VITE_WORLDCOIN_APP_ID: string
  VITE_AUTH_BJJ_CREDENTIAL_HASH: string
  VITE_ISSUER_ID: string

  /* Here should be a list of contract addresses for supported chains */

  VITE_DEFAULT_CHAIN: string

  VITE_EXTERNAL_PLATFORM_REDIRECT_URL: string

  VITE_CLAIM_OFFER_DELAY: number
  VITE_CLAIM_OFFER_MAX_TRIES_COUNT: number
  VITE_KYC_VERIFICATION_DELAY: number
}

interface Document {
  ENV: ImportMetaEnv
}
