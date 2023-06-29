import { Identity } from '@rarimo/identity-gen-iden3'
import { proxy } from 'valtio'

export const identityStore = proxy<{
  identity: Identity
  init: () => Promise<void>
}>({
  identity: {} as Identity,
  init: async () => {
    Identity.setConfig({
      AUTH_BJJ_CREDENTIAL_HASH: 'cca3371a6cb1b715004407e325bd993c',
    })
    identityStore.identity = await Identity.create(
      '5f64909f5df6b502133b5828169feb69612d0a6eb5da97fd4c18d5153249497f',
    )
  },
})
