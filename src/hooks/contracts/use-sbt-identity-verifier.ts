import { config } from '@config'
import { type BigNumberish, providers } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { SBTIdentityVerifier__factory } from '@/types'
import { IBaseVerifier } from '@/types/contracts/SBTIdentityVerifier'

export const useSbtIdentityVerifier = (
  address = config?.[
    `IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`
  ],
) => {
  const { provider } = useWeb3Context()

  const contractInterface = useMemo(
    () => SBTIdentityVerifier__factory.createInterface(),
    [],
  )

  const contractInstance = useMemo(() => {
    if (!address || !provider?.rawProvider) return null

    return SBTIdentityVerifier__factory.connect(
      address,
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ),
    )
  }, [address, provider?.rawProvider])

  const isIdentityProved = useCallback(
    async (did: BigNumberish): Promise<boolean | undefined> => {
      return contractInstance?.['isIdentityProved(uint256)']?.(did)
    },
    [contractInstance],
  )

  const isSenderAddressProved = useCallback(
    (address: string) => {
      return contractInstance?.['isIdentityProved(address)']?.(address)
    },
    [contractInstance],
  )

  const getProveIdentityTxBody = useCallback(
    (
      proveIdentityParams_: IBaseVerifier.ProveIdentityParamsStruct,
      transitStateParams_: IBaseVerifier.TransitStateParamsStruct,
    ) => {
      const data = contractInterface.encodeFunctionData(
        'transitStateAndProveIdentity',
        [proveIdentityParams_, transitStateParams_],
      )

      return {
        data,
      }
    },
    [contractInterface],
  )

  return {
    isIdentityProved,
    isSenderAddressProved,

    getProveIdentityTxBody,
  }
}
