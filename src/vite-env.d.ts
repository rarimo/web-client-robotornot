/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string

  VITE_AUTH_BJJ_CREDENTIAL_HASH: string

  VITE_DEFAULT_CHAIN: string

  WORLDCOIN_APP_ID: string
  VITE_WORLDCOIN_REDIRECT_URL: string

  VITE_CALLBACK_URL: string

  VITE_EXTERNAL_PLATFORM_REDIRECT_URL: string

  VITE_CLAIM_OFFER_DELAY: number
  VITE_CLAIM_OFFER_MAX_TRIES_COUNT: number
  VITE_KYC_VERIFICATION_DELAY: number
}

interface Document {
  ENV: ImportMetaEnv
}
