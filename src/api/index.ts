import { JsonApiClient } from '@distributedlab/jac'

export let api: JsonApiClient

export const initApi = (baseUrl: string) => {
  api = new JsonApiClient({
    baseUrl,
  })
}
