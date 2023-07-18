import {
  createProvider,
  CreateProviderOpts,
  IProvider,
  Provider,
  ProviderEventPayload,
  ProviderProxyConstructor,
  RawProvider,
} from '@distributedlab/w3p'
import isEqual from 'lodash/isEqual'
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

      setProvider(prev =>
        isEqual(initializedProvider, prev) ? prev : initializedProvider,
      )

      setRawProvider(prev =>
        isEqual(initializedProvider?.rawProvider, prev)
          ? prev
          : initializedProvider?.rawProvider,
      )

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

    disconnect,
  }
}
