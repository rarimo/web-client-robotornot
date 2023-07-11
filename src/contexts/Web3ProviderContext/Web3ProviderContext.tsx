import {
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
  useState,
} from 'react'
import { useLocalStorage } from 'react-use'

import { useNotification, useProvider } from '@/hooks'

interface Web3ProviderContextValue {
  provider?: ReturnType<typeof useProvider>
  providerDetector: ProviderDetector<SUPPORTED_PROVIDERS>

  isValidChain: boolean

  init: (providerType?: SUPPORTED_PROVIDERS) => Promise<void>
  addProvider: (provider: ProviderInstance) => void
  disconnect: () => Promise<void>
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

  const [currentTxToastId, setCurrentTxToastId] = useState<string | number>()
  const { showToast, removeToast } = useNotification()

  const provider = useProvider()

  const isValidChain = useMemo(() => true, [])

  const handleTxSent = useCallback(() => {
    setCurrentTxToastId(
      showToast('info', {
        title: 'Transaction sent',
        message: 'Waiting for confirmation...',
      }),
    )
  }, [showToast])

  const handleTxConfirmed = useCallback(() => {
    if (currentTxToastId) {
      removeToast(currentTxToastId)
    }

    showToast('success', {
      title: `Success`,
      message: 'Transaction confirmed',
    })
  }, [currentTxToastId, removeToast, showToast])

  const init = useCallback(
    async (providerType?: SUPPORTED_PROVIDERS) => {
      try {
        setStorageState({
          providerType: providerType || storageState?.providerType,
        })

        await providerDetector.init()

        // TODO: fill config and set chains details
        Provider.setChainsDetails({})

        const currentProviderType = providerType || storageState?.providerType

        if (!currentProviderType) return

        const initializedProvider = await provider.init(
          SUPPORTED_PROVIDERS_MAP[
            currentProviderType
          ] as ProviderProxyConstructor,
          {
            providerDetector,
            listeners: {
              onTxSent: handleTxSent,
              onTxConfirmed: handleTxConfirmed,
            },
          },
        )

        if (!initializedProvider.isConnected) {
          await initializedProvider?.connect?.()
        }
      } catch (error) {
        removeStorageState()
      }
    },
    [
      handleTxConfirmed,
      handleTxSent,
      provider,
      providerDetector,
      removeStorageState,
      setStorageState,
      storageState?.providerType,
    ],
  )

  const addProvider = (provider: ProviderInstance) => {
    if (providerDetector.providers?.[provider.name]) return

    providerDetector.addProvider(provider)
  }

  const handleDisconnect = useCallback(() => {
    removeStorageState()

    init()
  }, [init, removeStorageState])

  const disconnect = useCallback(async () => {
    try {
      await provider?.disconnect?.()
      // eslint-disable-next-line no-empty
    } catch (error) {}

    handleDisconnect()
  }, [handleDisconnect, provider])

  return (
    <web3ProviderContext.Provider
      value={{
        provider,
        providerDetector,

        isValidChain,

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
