import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect } from 'react'

import { AppButton, Icon } from '@/common'
import { useKycContext, useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const WalletConnection: FC<StepProps> = ({
  nextStepCb,
  className,
  ...rest
}) => {
  const { provider, isValidChain, init } = useWeb3Context()
  const { questPlatformDetails } = useKycContext()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [init])

  useEffect(() => {
    if (!provider?.isConnected || !isValidChain) return

    nextStepCb()
  }, [isValidChain, nextStepCb, provider?.isConnected])

  return (
    <motion.div
      className={['wallet-connection', className].join(' ')}
      {...rest}
    >
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

      <h2 className='wallet-connection__title'>
        {`Wants to know if you are a human`}
      </h2>

      <div className='app__step-actions'>
        <AppButton
          iconLeft={ICON_NAMES.metamask}
          text={`Connect metamask`}
          modification='border-circle'
          onClick={connectProvider}
        />

        <div className='app__step-actions-tip'>
          <span className='app__step-actions-tip-text'>
            {`Or press`}

            <span className='app__step-actions-tip-text--accent'>
              {`Enter`}
            </span>
          </span>
          <Icon
            className='app__step-actions-tip-icon'
            name={ICON_NAMES.arrowNarrowLeft}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default WalletConnection
