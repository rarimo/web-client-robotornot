import { config } from '@config'
import { LightweightStateV2__factory } from '@rarimo/shared-zkp-iden3'
import { providers } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'

export const useLightweightStateV2 = (
  address = config?.[
    `LIGHTWEIGHT_STATE_V2_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`
  ],
) => {
  const { provider } = useWeb3Context()

  const contractInstance = useMemo(() => {
    if (!address || !provider?.rawProvider) return undefined

    return provider?.rawProvider && address
      ? LightweightStateV2__factory.connect(
          address,
          new providers.Web3Provider(
            provider?.rawProvider as providers.ExternalProvider,
          ),
        )
      : undefined
  }, [address, provider?.rawProvider])

  const isIdentitiesStatesRootExists = useCallback(
    (root: string) => {
      return contractInstance?.isIdentitiesStatesRootExists?.(root)
    },
    [contractInstance],
  )

  return {
    isIdentitiesStatesRootExists,
  }
}
