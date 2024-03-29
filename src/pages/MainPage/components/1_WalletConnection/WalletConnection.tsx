import './styles.scss'

import { config } from '@config'
import { PROVIDERS } from '@distributedlab/w3p'
import { motion } from 'framer-motion'
import get from 'lodash/get'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useKey } from 'react-use'

import { AppButton, Icon } from '@/common'
import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
} from '@/contexts'
import { ICON_NAMES } from '@/enums'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
} from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const WalletConnection: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const [isPending, setIsPending] = useState(false)

  const { provider, isValidChain, init } = useWeb3Context()
  const { isMetamaskInstalled } = useMetamaskZkpSnapContext()
  const { questPlatformDetails } = useKycContext()

  const connectProvider = useCallback(async () => {
    setIsPending(true)

    try {
      await init(PROVIDERS.Metamask)

      gaSendCustomEvent(GaCategories.WalletConnection)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [init])

  const isQuestPlatformDetailsShown = useMemo(
    () =>
      !!questPlatformDetails?.questCreatorDetails?.iconLink &&
      !!questPlatformDetails?.questCreatorDetails?.name &&
      !!questPlatformDetails?.destinationDetails?.iconLink &&
      !!questPlatformDetails?.destinationDetails?.name,
    [questPlatformDetails],
  )

  const installMMLink = useMemo(() => {
    if (isMetamaskInstalled) return ''

    const browserExtensionsLinks = {
      chrome: config.CHROME_METAMASK_ADDON_LINK,
      opera: config.OPERA_METAMASK_ADDON_LINK,
      firefox: config.FIREFOX_METAMASK_ADDON_LINK,
    }

    // Get the user-agent string
    const userAgentString = navigator.userAgent

    let chromeAgent = userAgentString.indexOf('Chrome') > -1 ? 'chrome' : ''
    const firefoxAgent =
      userAgentString.indexOf('Firefox') > -1 ? 'firefox' : ''
    const operaAgent = userAgentString.indexOf('OP') > -1 ? 'opera' : ''

    // Discard Chrome since it also matches Opera
    if (chromeAgent && operaAgent) chromeAgent = ''

    const currentBrowser = chromeAgent || firefoxAgent || operaAgent || ''

    if (!currentBrowser) return ''

    return get(browserExtensionsLinks, currentBrowser, '')
  }, [isMetamaskInstalled])

  const openInstallMetamaskLink = useCallback(() => {
    if (!installMMLink) {
      bus.emit(BUS_EVENTS.warning, `Your browser does not support MetaMask`)

      return
    }

    setIsPending(true)

    window.open(installMMLink, '_blank', 'noopener noreferrer')
  }, [installMMLink])

  useKey('Enter', installMMLink ? openInstallMetamaskLink : connectProvider)

  useEffect(() => {
    if (!provider?.isConnected || !isValidChain) return

    nextStepCb()
  }, [isValidChain, nextStepCb, provider?.isConnected])

  return (
    <motion.div
      className={['wallet-connection', className].join(' ')}
      {...rest}
    >
      {isQuestPlatformDetailsShown && (
        <div className='app__badge'>
          <div className='app__badge-item'>
            <img
              className='app__badge-item-icon'
              src={questPlatformDetails?.questCreatorDetails?.iconLink}
              alt={questPlatformDetails?.questCreatorDetails?.name}
            />
          </div>

          <div className='app__badge-splitter'>
            <Icon
              className='app__badge-splitter-icon'
              name={ICON_NAMES.arrowRight}
            />
          </div>

          <div className='app__badge-item'>
            <img
              className='app__badge-item-icon'
              src={questPlatformDetails?.destinationDetails?.iconLink}
              alt={questPlatformDetails?.destinationDetails?.name}
            />
          </div>
        </div>
      )}

      <h2 className='wallet-connection__title'>
        {`Wants to know if you are a human`}
      </h2>

      <div className='app__step-actions'>
        {isMetamaskInstalled ? (
          <AppButton
            iconLeft={ICON_NAMES.metamask}
            text={`Connect MetaMask`}
            modification='border-circle'
            onClick={connectProvider}
            isDisabled={isPending}
          />
        ) : (
          <AppButton
            iconLeft={ICON_NAMES.metamask}
            text={isPending ? `Please, reload page` : `Install MetaMask`}
            modification='border-circle'
            onClick={openInstallMetamaskLink}
            target='_blank'
            rel='noopener noreferrer'
            isDisabled={isPending}
          />
        )}

        <div className='app__step-actions-tip'>
          <span className='app__step-actions-tip-text'>
            {`Or press`}

            <span className='app__step-actions-tip-text--accent'>
              {`Enter`}
            </span>
          </span>
          <Icon
            className='app__step-actions-tip-icon'
            name={ICON_NAMES.keyboardReturn}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default WalletConnection
