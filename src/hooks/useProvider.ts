import {
  Chain,
  ChainId,
  createProvider,
  CreateProviderOpts,
  IProvider,
  ProviderEventPayload,
  ProviderProxyConstructor,
  PROVIDERS,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '@distributedlab/w3p'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'

const PROVIDER_EVENTS: Array<keyof IProvider> = [
  'onInitiated',
  'onConnect',
  'onAccountChanged',
  'onChainChanged',
  'onDisconnect',
]

export function useProvider<T extends keyof Record<string, string>>() {
  const [provider, setProvider] = useState<IProvider>()
  const [rawProvider, setRawProvider] = useState<RawProvider>()
  const [providerReactiveState, setProviderReactiveState] = useState(() => {
    return {
      address: provider?.address,
      isConnected: provider?.isConnected,
      chainId: provider?.chainId,
      chainType: provider?.chainType,
      providerType: provider?.providerType,
    }
  })

  const connect = async (): Promise<void> => provider?.connect?.()

  const addChain = async (chain: Chain): Promise<void> =>
    provider?.addChain?.(chain)

  const switchChain = async (chainId: ChainId): Promise<void> =>
    provider?.switchChain?.(chainId)

  const signAndSendTx = async (
    txRequestBody: TxRequestBody,
  ): Promise<TransactionResponse> =>
    provider?.signAndSendTx?.(txRequestBody) ?? ''

  const signMessage = async (message: string): Promise<string> =>
    provider?.signMessage?.(message) ?? ''

  const getHashFromTx = (txResponse: TransactionResponse): string =>
    provider?.getHashFromTx?.(txResponse) ?? ''

  const getTxUrl = (chain: Chain, txHash: string): string =>
    provider?.getTxUrl?.(chain, txHash) ?? ''

  const getAddressUrl = (chain: Chain, address: string): string =>
    provider?.getAddressUrl?.(chain, address) ?? ''

  const disconnect = async (): Promise<void> => {
    if (provider?.disconnect) {
      await provider.disconnect()

      return
    }

    setProvider(undefined)
  }

  const setListeners = useCallback(() => {
    if (!provider) return
    PROVIDER_EVENTS.forEach(event => {
      const providerEvent = provider[event] as (
        cb: (payload: ProviderEventPayload) => void,
      ) => void

      providerEvent?.call(provider, payload => {
        setProviderReactiveState(prev => ({
          ...prev,
          ...payload,
        }))
      })
    })
  }, [provider])

  const init = async (
    providerProxy: ProviderProxyConstructor,
    createProviderOpts?: CreateProviderOpts<T>,
  ) => {
    const initializedProvider = await createProvider(
      providerProxy,
      createProviderOpts,
    )

    setRawProvider(
      createProviderOpts?.providerDetector?.getProvider(
        providerProxy.providerType as PROVIDERS,
      )?.instance,
    )

    setProvider(initializedProvider)
  }

  useEffect(
    debounce(() => {
      provider?.clearHandlers?.()
      setListeners()

      setProviderReactiveState(prev => ({
        ...prev,
        address: provider?.address,
        isConnected: provider?.isConnected,
        chainId: provider?.chainId,
        chainType: provider?.chainType,
        providerType: provider?.providerType,
      }))

      return () => {
        provider?.clearHandlers?.()
      }
    }, 100),
    [provider, setListeners],
  )

  return {
    provider,
    rawProvider,

    ...providerReactiveState,

    init,
    connect,
    switchChain,
    addChain,
    getAddressUrl,
    getHashFromTx,
    getTxUrl,
    signAndSendTx,
    signMessage,

    disconnect,
  }
}
