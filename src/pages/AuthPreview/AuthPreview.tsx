import './styles.scss'

import { DEFAULT_CHAIN } from '@config'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import loaderJson from '@/assets/animations/loader.json'
import { Animation, AppButton, CautionTip, Icon, Loader } from '@/common'
import { useKycContext, useWeb3Context, useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthPreview: FC<Props> = () => {
  const [isPending, setIsPending] = useState(false)

  const navigate = useNavigate()

  const { provider } = useWeb3Context()

  const { getVerifiableCredentials, getZkProof } = useZkpContext()

  const { isLoaded, isValidCredentials, retryKyc } = useKycContext()

  const handleGenerateProof = useCallback(async () => {
    setIsPending(true)

    try {
      const verifiableCredentials = await getVerifiableCredentials(
        DEFAULT_CHAIN,
      )

      await getZkProof(DEFAULT_CHAIN, verifiableCredentials)

      navigate(RoutesPaths.authConfirmation)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [getVerifiableCredentials, getZkProof, navigate])

  const completeKyc = useCallback(async () => {
    retryKyc()
  }, [retryKyc])

  const ValidCredentialsPreview = useMemo(
    () => (
      <div className='auth-preview__card'>
        <CautionTip
          className='auth-preview__card-caution-tip'
          message={`Proof is generated using Zero-Knowledge Proof (ZKP) using these credentials and is not shared with any party`}
        />
        <div className='auth-preview__metadata'>
          {Array(5)
            .fill(0)
            .map((el, idx) => (
              <div className='auth-preview__metadata-item' key={idx}>
                <span className='auth-preview__metadata-item-label'>{`Name`}</span>
                <span className='auth-preview__metadata-item-value'>{`Maren Philips`}</span>
              </div>
            ))}
        </div>
        <div className='auth-preview__card-divider' />
        <AppButton
          className='auth-preview__card-button'
          text={`GENERATE PROOF`}
          iconRight={ICON_NAMES.arrowRight}
          size='large'
          onClick={handleGenerateProof}
          isDisabled={!provider?.address}
        />
      </div>
    ),
    [handleGenerateProof, provider?.address],
  )

  const InvalidCredentialsMessage = useMemo(
    () => (
      <div className='auth-preview__card'>
        <CautionTip
          className='auth-preview__card-caution-tip'
          message={`Proof is generated using Zero-Knowledge Proof (ZKP) using these credentials and is not shared with any party`}
        />

        <div className='auth-preview__card-error'>
          <div className='auth-preview__card-error-icon-wrp'>
            <Icon
              className='auth-preview__card-error-icon'
              name={ICON_NAMES.x}
            />
          </div>
          <span className='auth-preview__card-error-title'>{`Insufficient Credentials`}</span>
          <span className='auth-preview__card-error-message'>
            {` Unable to Generate Proof of Human Identity. Please Complete Your Profile with an Identity Provider.`}
          </span>
        </div>

        <AppButton
          className='auth-preview__card-button'
          text={`COMPLETE NOW`}
          iconRight={ICON_NAMES.arrowRight}
          size='large'
          onClick={completeKyc}
        />
      </div>
    ),
    [completeKyc],
  )

  return (
    <div
      className={`auth-preview ${
        isValidCredentials ? '' : `auth-preview--invalid`
      }`}
    >
      <div className='auth-preview__header'>
        <h2 className='auth-preview__header-title'>{`Proof of Human credentials`}</h2>
      </div>

      {isLoaded ? (
        isPending ? (
          <>
            <div className='auth-preview__card'>
              <Animation source={loaderJson} />
            </div>
          </>
        ) : isValidCredentials ? (
          ValidCredentialsPreview
        ) : (
          InvalidCredentialsMessage
        )
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default AuthPreview
