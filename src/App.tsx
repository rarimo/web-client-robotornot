import { config } from '@config'
import { Chain, errors } from '@distributedlab/w3p'
import {
  FC,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AppButton, AppNavbar, BasicModal, Loader } from '@/common'
import {
  useMetamaskZkpSnapContext,
  useWeb3Context,
  ZkpContextProvider,
} from '@/contexts'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
} from '@/helpers'
import { useNotification, useViewportSizes } from '@/hooks'

const App: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  useViewportSizes()

  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const location = useLocation()
  const { showToast } = useNotification()
  const { provider, isValidChain, init: initWeb3 } = useWeb3Context()
  const { isMetamaskInstalled, init: initZkpSnap } = useMetamaskZkpSnapContext()

  const init = useCallback(async () => {
    if (provider?.address) return

    try {
      const { isMetamaskInstalled } = await initZkpSnap()

      if (isMetamaskInstalled) {
        await initWeb3()
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    setIsAppInitialized(true)
  }, [initWeb3, initZkpSnap, provider?.address])

  useEffect(() => {
    const showSuccessToast = (payload: unknown) => showToast('success', payload)
    const showWarningToast = (payload: unknown) => showToast('warning', payload)
    const showErrorToast = (payload: unknown) => showToast('error', payload)
    const showInfoToast = (payload: unknown) => showToast('info', payload)

    let mountingInit = async () => {
      bus.on(BUS_EVENTS.success, showSuccessToast)
      bus.on(BUS_EVENTS.warning, showWarningToast)
      bus.on(BUS_EVENTS.error, showErrorToast)
      bus.on(BUS_EVENTS.info, showInfoToast)

      await init()
    }

    mountingInit()

    return () => {
      bus.off(BUS_EVENTS.success, showSuccessToast)
      bus.off(BUS_EVENTS.warning, showWarningToast)
      bus.off(BUS_EVENTS.error, showErrorToast)
      bus.off(BUS_EVENTS.info, showInfoToast)

      mountingInit = async () => {
        /* empty */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tryAddChain = useCallback(
    async (chain: Chain) => {
      try {
        await provider?.addChain?.(chain)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    [provider],
  )

  const trySwitchChain = useCallback(
    async (chain: Chain) => {
      try {
        await provider?.switchChain?.(Number(chain.id))
      } catch (error) {
        if (error instanceof errors.ProviderChainNotFoundError) {
          await tryAddChain(chain)
        } else {
          throw error
        }
      }
    },
    [provider, tryAddChain],
  )

  useEffect(() => {
    gaSendCustomEvent(GaCategories.PageView, { pathname: location.pathname })
  }, [location])

  return (
    <ZkpContextProvider>
      <div id='app'>
        <AppNavbar />

        <div className='app__main'>
          {isAppInitialized ? children : <Loader />}
        </div>
      </div>

      <BasicModal
        isShown={Boolean(
          isMetamaskInstalled &&
            isAppInitialized &&
            provider?.isConnected &&
            !isValidChain,
        )}
        updateIsShown={() => {
          /* empty */
        }}
        isCloseByClickOutside={false}
        title={`Unsupported Chain`}
      >
        <div className='app__invalid-chain-modal'>
          <span className='app__invalid-chain-modal-subtitle'>
            {`Please switch to ${
              config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN].name
            } chain in MetaMask`}
          </span>

          <div className='app__invalid-chain-modal-actions'>
            <AppButton
              className='app__invalid-chain-modal-action-btn'
              onClick={() =>
                trySwitchChain(
                  config.SUPPORTED_CHAINS_DETAILS[config.DEFAULT_CHAIN],
                )
              }
              text={`CHANGE NETWORK`}
            />
          </div>
        </div>
      </BasicModal>
      <ToastContainer />
    </ZkpContextProvider>
  )
}

export default memo(App)
