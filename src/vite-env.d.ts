/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ENVIRONMENT: string
  VITE_PORT: string
  VITE_API_URL: string
  VITE_APP_NAME: string

  VITE_AUTH_BJJ_CREDENTIAL_HASH: string

  VITE_DEFAULT_CHAIN: string

  VITE_CALLBACK_URL: string

  VITE_EXTERNAL_PLATFORM_REDIRECT_URL: string
}

interface Document {
  ENV: ImportMetaEnv
}
