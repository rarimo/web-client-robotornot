import { config } from '@config'
import { BigNumberish, providers } from 'ethers'
import { useCallback, useMemo } from 'react'

import { useWeb3Context } from '@/contexts'
import { TimeWindowSBTIdentityVerifier__factory } from '@/types'
import { IBaseVerifier } from '@/types/contracts/SBTIdentityVerifier'

export const useTimeWindowSbtIdentityVerifier = (
  contractAddress = config?.[
    `IDENTITY_SBT_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`
  ],
) => {
  const { provider } = useWeb3Context()

  const contractInterface = useMemo(
    () => TimeWindowSBTIdentityVerifier__factory.createInterface(),
    [],
  )

  const contractInstance = useMemo(() => {
    if (!contractAddress || !provider?.rawProvider) return null

    return TimeWindowSBTIdentityVerifier__factory.connect(
      contractAddress,
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ),
    )
  }, [contractAddress, provider?.rawProvider])

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

  const getTimeWindowSBTIdentityProofInfo = useCallback(
    async (did: BigNumberish) => {
      return contractInstance?.getTimeWindowSBTIdentityProofInfo?.(did)
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
    getTimeWindowSBTIdentityProofInfo,

    getProveIdentityTxBody,
  }
}
