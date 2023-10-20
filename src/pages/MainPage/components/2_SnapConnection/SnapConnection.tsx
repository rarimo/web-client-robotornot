import './styles.scss'

import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useState } from 'react'
import { useKey } from 'react-use'

import { AppButton, Icon } from '@/common'
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
      ErrorHandler.processWithoutFeedback(error)
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
        <div className='app__badge-item snap-connection__badge-item'>
          <Icon className='app__badge-item-icon' name={ICON_NAMES.metamask} />
        </div>
      </div>

      <h2 className='snap-connection__title'>
        {`Add identity management to your wallet`}
      </h2>

      <div className='app__step-actions'>
        <AppButton
          iconLeft={ICON_NAMES.rarimeSnap}
          onClick={installSnap}
          text={`Install Snap`}
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
            name={ICON_NAMES.arrowNarrowLeft}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default SnapConnection