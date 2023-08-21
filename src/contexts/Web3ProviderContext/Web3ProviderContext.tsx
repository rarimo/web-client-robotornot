import {
  errors,
  MetamaskProvider,
  Provider,
  ProviderDetector,
  // type ProviderEventPayload,
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
  // useState,
} from 'react'
import { useLocalStorage } from 'react-use'

import { config } from '@/config'
import {
  // useNotification,
  useProvider,
} from '@/hooks'

interface Web3ProviderContextValue {
  provider?: ReturnType<typeof useProvider>
  providerDetector: ProviderDetector<SUPPORTED_PROVIDERS>

  init: (providerType?: SUPPORTED_PROVIDERS) => Promise<void>
  addProvider: (provider: ProviderInstance) => void
  disconnect: () => Promise<void>
}

export const web3ProviderContext = createContext<Web3ProviderContextValue>({
  provider: undefined,
  providerDetector: new ProviderDetector<SUPPORTED_PROVIDERS>(),

  init: async (providerType?: SUPPORTED_PROVIDERS) => {
    throw new TypeError(`init() not implemented for ${providerType}`)
  },
  addProvider: (provider: ProviderInstance) => {
    throw new TypeError(`addProvider() not implemented for ${provider}`)
  },
  disconnect: async () => {
    throw new TypeError('disconnect() not implemented')
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

  // const [currentTxToastId, setCurrentTxToastId] = useState<string | number>()
  // const { showTxToast, removeToast } = useNotification()

  const provider = useProvider()

  // const handleTxSent = useMemo(
  //   () => (e?: ProviderEventPayload) => {
  //     setCurrentTxToastId(
  //       showTxToast('pending', {
  //         txHash: e?.txHash,
  //       }),
  //     )
  //   },
  //   [showTxToast],
  // )

  // const handleTxConfirmed = useMemo(
  //   () => (e?: ProviderEventPayload) => {
  //     if (currentTxToastId) {
  //       removeToast(currentTxToastId)
  //     }
  //
  //     showTxToast('success', {
  //       txResponse: e?.txResponse,
  //     })
  //   },
  //   [currentTxToastId, removeToast, showTxToast],
  // )

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
      // onTxSent: handleTxSent,
      // onTxConfirmed: handleTxConfirmed,
      onDisconnect: disconnect,
    }),
    [
      disconnect,
      // handleTxConfirmed,
      // handleTxSent
    ],
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (error.error instanceof errors.ProviderUserRejectedRequest) {
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

  return (
    <web3ProviderContext.Provider
      value={{
        provider,
        providerDetector,

        init,
        addProvider,
        disconnect,
      }}
    >
      {children}
    </web3ProviderContext.Provider>
  )
}

export default memo(Web3ProviderContextProvider)
