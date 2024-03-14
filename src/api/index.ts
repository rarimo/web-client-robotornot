import { config } from '@config'
import { Fetcher } from '@distributedlab/fetcher'
import { JsonApiClient } from '@distributedlab/jac'
import { ZkpSnap } from '@rarimo/rarime-connector'

export let api: JsonApiClient

export let issuerApi: Fetcher

export const zkpSnap = new ZkpSnap()

export const initApi = () => {
  api = new JsonApiClient({
    baseUrl: config.API_URL,
  })
  issuerApi = new Fetcher({
    baseUrl: config.ISSUER_API_URL,
  })
}
