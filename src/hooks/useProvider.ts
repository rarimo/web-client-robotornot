import {
  Chain,
  ChainId,
  createProvider,
  CreateProviderOpts,
  IProvider,
  Provider,
  ProviderEventPayload,
  ProviderProxyConstructor,
  RawProvider,
  TransactionResponse,
  TxRequestBody,
} from '@distributedlab/w3p'
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

  const connect = useCallback(
    async (): Promise<void> => provider?.connect?.(),
    [provider],
  )

  const addChain = useCallback(
    async (chain: Chain): Promise<void> => provider?.addChain?.(chain),
    [provider],
  )

  const switchChain = useCallback(
    async (chainId: ChainId): Promise<void> => provider?.switchChain?.(chainId),
    [provider],
  )

  const signAndSendTx = useCallback(
    async (txRequestBody: TxRequestBody): Promise<TransactionResponse> =>
      provider?.signAndSendTx?.(txRequestBody) ?? '',
    [provider],
  )

  const signMessage = useCallback(
    async (message: string): Promise<string> =>
      provider?.signMessage?.(message) ?? '',
    [provider],
  )

  const getHashFromTx = useCallback(
    (txResponse: TransactionResponse): string =>
      provider?.getHashFromTx?.(txResponse) ?? '',
    [provider],
  )

  const getTxUrl = useCallback(
    (chain: Chain, txHash: string): string =>
      provider?.getTxUrl?.(chain, txHash) ?? '',
    [provider],
  )

  const getAddressUrl = useCallback(
    (chain: Chain, address: string): string =>
      provider?.getAddressUrl?.(chain, address) ?? '',
    [provider],
  )

  const disconnect = useCallback(async (): Promise<void> => {
    if (provider?.disconnect) {
      await provider.disconnect()

      return
    }

    setProvider(undefined)
  }, [provider])

  const setListeners = useCallback(
    (_provider?: Provider) => {
      const currentProvider = _provider ?? provider

      if (!currentProvider) return

      PROVIDER_EVENTS.forEach(event => {
        const providerEvent = currentProvider[event] as (
          cb: (payload: ProviderEventPayload) => void,
        ) => void

        providerEvent?.call(currentProvider, payload => {
          setProviderReactiveState(prev => ({
            ...prev,
            ...payload,
          }))
        })
      })
    },
    [provider],
  )

  const init = useCallback(
    async (
      providerProxy: ProviderProxyConstructor,
      createProviderOpts?: CreateProviderOpts<T>,
    ) => {
      const initializedProvider = await createProvider(
        providerProxy,
        createProviderOpts,
      )

      setRawProvider(initializedProvider.rawProvider)

      setProvider(initializedProvider)

      setListeners(initializedProvider)

      setProviderReactiveState(prev => ({
        ...prev,
        address: initializedProvider?.address,
        isConnected: initializedProvider?.isConnected,
        chainId: initializedProvider?.chainId,
        chainType: initializedProvider?.chainType,
        providerType: initializedProvider?.providerType,
      }))

      return initializedProvider
    },
    [setListeners],
  )

  useEffect(() => {
    return () => {
      provider?.clearHandlers?.()
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

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
