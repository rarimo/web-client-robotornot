import './styles.scss'

import { config } from '@config'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import loaderJson from '@/assets/animations/loader.json'
import { Animation, AppButton, CautionTip, Icon } from '@/common'
import { useKycContext, useWeb3Context, useZkpContext } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthPreview: FC<Props> = () => {
  const [isPending, setIsPending] = useState(false)

  const navigate = useNavigate()

  const { provider } = useWeb3Context()

  const { getVerifiableCredentials, getZkProof } = useZkpContext()

  const {
    isLoaded,
    isValidCredentials,
    selectedKycDetails,
    retryKyc,
    verificationErrorMessages,
  } = useKycContext()

  const handleGenerateProof = useCallback(async () => {
    setIsPending(true)

    try {
      const verifiableCredentials = await getVerifiableCredentials(
        config.DEFAULT_CHAIN,
      )

      await getZkProof(config.DEFAULT_CHAIN, verifiableCredentials)

      navigate(RoutesPaths.authConfirmation)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [getVerifiableCredentials, getZkProof, navigate])

  const completeKyc = useCallback(async () => {
    navigate(RoutesPaths.authProviders)
    retryKyc()
  }, [navigate, retryKyc])

  const ValidCredentialsPreview = useMemo(
    () => (
      <div className='auth-preview__card'>
        {`The credential will be used to generate a zero-knowledge proof. No sensitive data will be shared with any party.`}
        <CautionTip
          className='auth-preview__card-caution-tip'
          message={
            <>
              You should back up your credentials{' '}
              <NavLink to={RoutesPaths.profile}>here</NavLink>. Otherwise, you
              may lose your identity.
            </>
          }
        />
        <div className='auth-preview__metadata'>
          {selectedKycDetails?.map(([label, value], idx) => (
            <div className='auth-preview__metadata-item' key={idx}>
              <span className='auth-preview__metadata-item-label'>{label}</span>
              <span className='auth-preview__metadata-item-value' title={value}>
                {value}
              </span>
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
    [handleGenerateProof, provider?.address, selectedKycDetails],
  )

  const InvalidCredentialsMessage = useMemo(
    () => (
      <div className='auth-preview__card'>
        <div className='auth-preview__card-error'>
          <div className='auth-preview__card-error-icon-wrp'>
            <Icon
              className='auth-preview__card-error-icon'
              name={ICON_NAMES.x}
            />
          </div>
          <span className='auth-preview__card-error-title'>{`Insufficient Credentials`}</span>
          <span className='auth-preview__card-error-message'>
            {` Unable to Generate Proof of Human Identity. ${verificationErrorMessages}`}
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
    [completeKyc, verificationErrorMessages],
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
        <div className='auth-preview__card'>
          <Animation source={loaderJson} />
        </div>
      )}
    </div>
  )
}

export default AuthPreview
