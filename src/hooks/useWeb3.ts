import { CONFIG } from '@config'
import { useState } from 'react'

import { KEPLR_CHAIN_INFO } from '@/const'
import { apolloClient } from '@/graphql'
import { ErrorHandler } from '@/helpers'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  address,
  isConnected,
  isValidator,
  setAddress,
  setIsConnected,
  setIsValidator,
} from '@/store'
import {
  GetAccountValidatorInfos,
  GetAccountValidatorInfosQuery,
} from '@/types'
import { client, wallet } from '@/utils'

export const useWeb3 = () => {
  const dispatch = useAppDispatch()
  const [isConnecting, setIsConnecting] = useState(false)

  const state = {
    isConnected: useAppSelector(isConnected),
    isValidator: useAppSelector(isValidator),
    address: useAppSelector(address),
  }

  const getIsValidator = async (address: string) => {
    const { data } = await apolloClient.query<GetAccountValidatorInfosQuery>({
      query: GetAccountValidatorInfos,
      fetchPolicy: 'network-only',
      variables: { address },
    })

    return Boolean(data?.account?.[0]?.validator_infos?.length)
  }

  const connect = async () => {
    setIsConnecting(true)
    try {
      wallet.loadSigner(CONFIG.CHAIN_ID)

      await client.useSigner(wallet.signer)
      await client.useKeplr(KEPLR_CHAIN_INFO)
      await wallet.loadAccounts()

      dispatch(setIsConnected(true))
      dispatch(setAddress(wallet.account.address))
      dispatch(setIsValidator(await getIsValidator(wallet.account.address)))

      await new Promise(resolve => {
        if (state.address && state.isConnected) resolve(true)
      })
    } catch (e) {
      dispatch(setIsConnected(false))
      ErrorHandler.process(e)
    }
    setIsConnecting(false)
  }

  const disconnect = async () => {
    wallet.clear()
    dispatch(setIsValidator(false))
    dispatch(setAddress(''))
    dispatch(setIsConnected(false))
    setIsConnecting(false)
  }

  const handleWalletConnection = async () => {
    if (state.isConnected) return
    await connect()
  }

  return { connect, disconnect, handleWalletConnection, ...state, isConnecting }
}
