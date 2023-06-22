/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_APP_CHAIN_API_URL: string
  VITE_APP_CHAIN_RPC_URL: string
  VITE_APP_CHAIN_ID: string
  VITE_APP_NAME: string
  VITE_APP_DENOM: string
  VITE_APP_MINIMAL_DENOM: string
  VITE_APP_GRAPHQL_URL: string
  VITE_APP_GAS_PRICE_STEP_LOW: string
  VITE_APP_GAS_PRICE_STEP_AVG: string
  VITE_APP_GAS_PRICE_STEP_HIGH: string
  VITE_APP_DEVNET_URL: string
  VITE_APP_TESTNET_URL: string
  VITE_APP_MAINNET_URL: string
  VITE_APP_CHAIN_RPC_URL_WS: string
}

interface Document {
  ENV: ImportMetaEnv
}
