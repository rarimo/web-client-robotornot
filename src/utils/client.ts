import { CONFIG } from '@config'
import { Client } from '@rarimo/client'

export const client = new Client({
  apiURL: CONFIG.CHAIN_API_URL,
  rpcURL: CONFIG.CHAIN_RPC_URL,
  prefix: CONFIG.CHAIN_ID,
})
