import './styles.scss'

import { config } from '@config'
import { motion } from 'framer-motion'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { useCountdown } from 'usehooks-ts'

import { AppButton, Icon, WrappedIcon } from '@/common'
import { Skeleton } from '@/common/Loader/variants'
import { useKycContext, useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

const SECOND = 1000

const REDIRECT_TIMEOUT = 10

const ProofSubmitted: FC<StepProps> = ({ nextStepCb, className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)
  const [isManualRedirect, setIsManualRedirect] = useState(false)

  const {
    selectedKycProvider,
    KYC_PROVIDERS_DETAILS_MAP,
    detectProviderFromVC,
  } = useKycContext()
  const { isEthAddressProved, isDidProved, txSubmitExplorerLink, saveVC } =
    useZkpContext()

  const [count, { startCountdown }] = useCountdown({
    countStart: REDIRECT_TIMEOUT,
    intervalMs: SECOND,
  })

  const CommunityLink = useMemo(
    () =>
      config.COMMUNITY_LINK && (
        <>
          <div className='proof-submitted__metadata-divider' />

          <div className='proof-submitted__metadata-row'>
            <AppButton
              className={[
                'proof-submitted__request-btn',
                'proof-submitted__request-btn--primary',
              ].join(' ')}
              href={config.COMMUNITY_LINK}
              target='_blank'
              modification='border-circle'
              size='small'
              iconLeft={ICON_NAMES.discord}
            >
              {`Join the “Humanity station” channel`}
            </AppButton>
          </div>
        </>
      ),
    [],
  )

  const requestProveDetails = useCallback(async () => {
    setIsPending(true)
    setIsManualRedirect(true)

    try {
      await saveVC()

      await detectProviderFromVC()
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [detectProviderFromVC, saveVC])

  const RetrievingDataBtn = useMemo(
    () =>
      isPending ? (
        <Skeleton />
      ) : (
        <>
          <div className='proof-submitted__metadata-divider' />

          <div className='proof-submitted__metadata-row'>
            <AppButton
              className='proof-submitted__request-btn'
              onClick={requestProveDetails}
              modification='border-circle'
              iconLeft={ICON_NAMES.rarimeSnapFilled}
            >
              {`Retrieve data`}
            </AppButton>
          </div>
        </>
      ),
    [isPending, requestProveDetails],
  )

  useEffectOnce(() => {
    startCountdown()
  })

  useEffect(() => {
    if (count > 0) return

    if (!config.DASHBOARD_LINK || isManualRedirect) return

    nextStepCb()
  }, [count, isManualRedirect, nextStepCb])

  return (
    <motion.div className={['proof-submitted', className].join(' ')} {...rest}>
      <WrappedIcon
        className='proof-submitted__overtitle-icon'
        iconName={ICON_NAMES.check}
      />

      <h2 className='proof-submitted__title'>
        {txSubmitExplorerLink
          ? `Enjoy the web as a true human!`
          : `You're already on the human side of the web `}
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

              {CommunityLink}
            </>
          )}

          {isDidProved && !selectedKycProvider && RetrievingDataBtn}

          {isEthAddressProved && !isDidProved && (
            <>
              <div className='proof-submitted__metadata-divider' />
              <div className='proof-submitted__metadata-row'>
                <span className='proof-submitted__metadata-label'>{`SBT`}</span>
                <span
                  className={[
                    'proof-submitted__metadata-value',
                    'proof-submitted__metadata-value--flex-center',
                  ].join(' ')}
                >
                  <Icon
                    className={[
                      'proof-submitted__metadata-icon',
                      'proof-submitted__metadata-icon--success',
                    ].join(' ')}
                    name={ICON_NAMES.check}
                  />
                  {`Minted`}
                </span>
              </div>

              {CommunityLink}
            </>
          )}
        </div>
      </div>

      <a
        href={config.DASHBOARD_LINK}
        className='proof-submitted__link'
        target='_blank'
        title='View in rariMe app'
        rel='noreferrer'
        onClick={() => setIsManualRedirect(true)}
      >
        {isManualRedirect
          ? `View in rariMe app`
          : `Redirecting to rariMe app in ${count} seconds`}
      </a>
    </motion.div>
  )
}

export default ProofSubmitted
