import './styles.scss'

import { config } from '@config'
import { motion } from 'framer-motion'
import { type FC, useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useCountdown } from 'usehooks-ts'

import { Icon } from '@/common'
import { useKycContext, useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { StepProps } from '@/pages/MainPage/components/types'

const SECOND = 1000

const REDIRECT_TIMEOUT = 30

const ProofSubmitted: FC<StepProps> = ({ nextStepCb, className, ...rest }) => {
  const [isManualRedirected] = useState(false)

  const { selectedKycProvider, KYC_PROVIDERS_DETAILS_MAP } = useKycContext()
  const { txSubmitExplorerLink } = useZkpContext()

  const [count, { startCountdown }] = useCountdown({
    countStart: REDIRECT_TIMEOUT,
    intervalMs: SECOND,
  })

  useEffectOnce(() => {
    startCountdown()
  })

  useEffect(() => {
    if (count > 0) return

    if (!config.EXTERNAL_PLATFORM_REDIRECT_URL || isManualRedirected) return

    nextStepCb()
  }, [count, isManualRedirected, nextStepCb])

  return (
    <motion.div className={['proof-submitted', className].join(' ')} {...rest}>
      <div className='proof-submitted__overtitle-icon-wrp'>
        <div className='proof-submitted__overtitle-icon-inner'>
          <Icon
            className='proof-submitted__overtitle-icon'
            name={ICON_NAMES.check}
          />
        </div>
      </div>

      <h2 className='proof-submitted__title'>
        {`Enjoy the web as a true human!`}
      </h2>

      <div className='proof-submitted__card'>
        <div className='proof-submitted__metadata'>
          <div className='proof-submitted__metadata-row'>
            <span className='proof-submitted__metadata-label'>{`Type`}</span>
            <span className='proof-submitted__metadata-value'>{`Proof of Humanity`}</span>
          </div>

          {selectedKycProvider && (
            <>
              <div className='proof-submitted__metadata-divider' />
              <div className='proof-submitted__metadata-row'>
                <span className='proof-submitted__metadata-label'>{`Provider`}</span>
                <span className='proof-submitted__metadata-value'>
                  <Icon
                    className='proof-submitted__metadata-icon'
                    name={
                      KYC_PROVIDERS_DETAILS_MAP[selectedKycProvider].iconName
                    }
                  />
                  {KYC_PROVIDERS_DETAILS_MAP[selectedKycProvider].name}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {txSubmitExplorerLink && (
        <a
          href={txSubmitExplorerLink}
          className='proof-submitted__link'
          target='_blank'
          rel='noreferrer'
        >
          {`View on block explorer`}
        </a>
      )}
    </motion.div>
  )
}

export default ProofSubmitted
