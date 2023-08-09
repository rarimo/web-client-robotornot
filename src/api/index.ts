import { config } from '@config'
import { JsonApiClient } from '@distributedlab/jac'
import { makeRarimoQuerier, RarimoQuerier } from '@rarimo/client'

export let api: JsonApiClient

export let querier: RarimoQuerier

export const initApi = (baseUrl: string) => {
  api = new JsonApiClient({
    baseUrl,
  })
  querier = makeRarimoQuerier({
    apiUrl: config.RARIMO_CORE_RPC_API_URL,
  })
}
