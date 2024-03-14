import './styles.scss'

import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useState } from 'react'
import { useKey } from 'react-use'

import { AppButton, CautionTip, Icon } from '@/common'
import { useMetamaskZkpSnapContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const SnapConnection: FC<StepProps> = ({ nextStepCb, className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)

  const { connectOrInstallSnap, checkSnapStatus, isSnapInstalled } =
    useMetamaskZkpSnapContext()

  const installSnap = useCallback(async () => {
    setIsPending(true)

    try {
      await connectOrInstallSnap()
      await checkSnapStatus()
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [checkSnapStatus, connectOrInstallSnap])

  useKey('Enter', installSnap)

  useEffect(() => {
    if (!isSnapInstalled) return

    nextStepCb()
  }, [isSnapInstalled, nextStepCb])

  return (
    <motion.div className={['snap-connection', className].join(' ')} {...rest}>
      <div className='app__badge snap-connection__badge'>
        <div className='app__badge-item'>
          <Icon
            className={[
              'app__badge-item-icon',
              'snap-connection__badge-item',
              'snap-connection__badge-item-snap',
            ].join(' ')}
            name={ICON_NAMES.rarimeSnap}
          />
        </div>
        <div className='app__badge-item snap-connection__badge-item snap-connection__badge-item-metamask'>
          <Icon className='app__badge-item-icon' name={ICON_NAMES.metamask} />
        </div>
      </div>

      <h2 className='snap-connection__title'>
        {`Enable identity storage to your wallet`}
      </h2>

      <div className='snap-connection__description'>
        <div className='snap-connection__description-item'>
          <Icon
            className='snap-connection__description-item-icon'
            name={ICON_NAMES.metamask}
          />
          <span>
            {'It has been audited and '}
            <u>{'approved by MetaMask'}</u>
          </span>
        </div>
        <div className='snap-connection__description-item'>
          <Icon
            className='snap-connection__description-item-icon'
            name={ICON_NAMES.key}
          />
          <span>{'It cannot access your private keys or your crypto'}</span>
        </div>
      </div>

      <div className='app__step-actions snap-connection__button'>
        <AppButton
          iconLeft={ICON_NAMES.rarimeSnap}
          onClick={installSnap}
          text={`Enable RariMe`}
          modification='border-circle'
          isDisabled={isPending}
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
            name={ICON_NAMES.keyboardReturn}
          />
        </div>
      </div>

      <CautionTip
        className='snap-connection__subtitle'
        message={`Installing the snap could take a few minutes, depending on your internet bandwidth. Please ignore the "Page Unresponsive" errors and wait until the installation is complete.`}
      />
    </motion.div>
  )
}

export default SnapConnection
