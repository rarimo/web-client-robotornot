import {
  Chain,
  errors,
  MetamaskProvider,
  Provider,
  ProviderDetector,
  ProviderInstance,
  ProviderProxyConstructor,
  PROVIDERS,
} from '@distributedlab/w3p'
import {
  createContext,
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { useLocalStorage } from 'react-use'

import { config } from '@/config'
import { ErrorHandler } from '@/helpers'
import { useProvider } from '@/hooks'

interface Web3ProviderContextValue {
  provider?: ReturnType<typeof useProvider>
  providerDetector: ProviderDetector<SUPPORTED_PROVIDERS>

  isValidChain: boolean

  init: (providerType?: SUPPORTED_PROVIDERS) => Promise<void>
  addProvider: (provider: ProviderInstance) => void
  disconnect: () => Promise<void>
  requestSwitchChain: (chain: Chain) => Promise<void>
}

export const web3ProviderContext = createContext<Web3ProviderContextValue>({
  provider: undefined,
  providerDetector: new ProviderDetector<SUPPORTED_PROVIDERS>(),

  isValidChain: false,

  init: async (providerType?: SUPPORTED_PROVIDERS) => {
    throw new TypeError(`init() not implemented for ${providerType}`)
  },
  addProvider: (provider: ProviderInstance) => {
    throw new TypeError(`addProvider() not implemented for ${provider}`)
  },
  disconnect: async () => {
    throw new TypeError('disconnect() not implemented')
  },
  requestSwitchChain: async (chain: Chain) => {
    throw new TypeError(`requestSwitchChain() not implemented for ${chain}`)
  },
})

type Props = HTMLAttributes<HTMLDivElement>

export type SUPPORTED_PROVIDERS = PROVIDERS

const SUPPORTED_PROVIDERS_MAP: {
  [key in SUPPORTED_PROVIDERS]?: ProviderProxyConstructor
} = {
  [PROVIDERS.Metamask]: MetamaskProvider,
}

const STORAGE_KEY = 'web3-provider'

const Web3ProviderContextProvider: FC<Props> = ({ children }) => {
  const providerDetector = useMemo(
    () => new ProviderDetector<SUPPORTED_PROVIDERS>(),
    [],
  )

  const [storageState, setStorageState, removeStorageState] = useLocalStorage<{
    providerType?: SUPPORTED_PROVIDERS
  }>(STORAGE_KEY, {
    providerType: undefined,
  })

  const provider = useProvider()

  const isValidChain = useMemo(() => {
    if (!provider?.chainId) return false

    return (
      config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN].id ===
      String(provider.chainId)
    )
  }, [provider.chainId])

  const disconnect = useCallback(async () => {
    try {
      await provider?.disconnect?.()
    } catch (error) {
      // empty
    }

    removeStorageState()
  }, [provider, removeStorageState])

  const listeners = useMemo(
    () => ({
      onDisconnect: disconnect,
    }),
    [disconnect],
  )

  const init = useCallback(
    async (providerType?: SUPPORTED_PROVIDERS) => {
      try {
        setStorageState({
          providerType: providerType || storageState?.providerType,
        })

        await providerDetector.init()

        Provider.setChainsDetails(
          Object.entries(config.SUPPORTED_CHAINS_DETAILS).reduce(
            (acc, [, chainDetails]) => ({
              ...acc,
              [chainDetails.id]: chainDetails,
            }),
            {},
          ),
        )

        const currentProviderType = providerType || storageState?.providerType

        if (!currentProviderType) return

        const initializedProvider = await provider.init(
          SUPPORTED_PROVIDERS_MAP[
            currentProviderType
          ] as ProviderProxyConstructor,
          {
            providerDetector,
            listeners,
          },
        )

        if (!initializedProvider.isConnected) {
          await initializedProvider?.connect?.()
        }
      } catch (error) {
        if (
          error instanceof Error &&
          'error' in error &&
          error.error instanceof errors.ProviderUserRejectedRequest
        ) {
          await disconnect()
        }

        throw error
      }
    },
    [
      provider,
      disconnect,
      listeners,
      providerDetector,
      setStorageState,
      storageState?.providerType,
    ],
  )

  const addProvider = (provider: ProviderInstance) => {
    if (providerDetector.providers?.[provider.name]) return

    providerDetector.addProvider(provider)
  }

  const requestAddChain = useCallback(
    async (chain: Chain) => {
      try {
        await provider?.addChain?.(chain)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    [provider],
  )

  const requestSwitchChain = useCallback(
    async (chain: Chain) => {
      try {
        await provider?.switchChain?.(Number(chain.id))
      } catch (error) {
        if (error instanceof errors.ProviderChainNotFoundError) {
          await requestAddChain(chain)

          return
        }

        ErrorHandler.process(error)
      }
    },
    [provider, requestAddChain],
  )

  return (
    <web3ProviderContext.Provider
      value={{
        provider,
        providerDetector,

        isValidChain,

        init,
        addProvider,
        disconnect,
        requestSwitchChain,
      }}
    >
      {children}
    </web3ProviderContext.Provider>
  )
}

export default memo(Web3ProviderContextProvider)
