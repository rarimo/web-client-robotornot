import './styles.scss'

import { type FC, useCallback, useState } from 'react'

import { useKycContext } from '@/contexts'
import { SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { ErrorHandler, GaCategories, gaSendCustomEvent } from '@/helpers'
import { StepProps } from '@/pages/MainPage/components/types'

import { KycProvidersItem } from './components'

const KycProviders: FC<StepProps> = ({
  nextStepCb,
  onErrorCb,
  className,
  ...rest
}) => {
  const { KYC_PROVIDERS_DETAILS_MAP } = useKycContext()

  const [isPending, setIsPending] = useState(false)

  const { login } = useKycContext()

  const handleLogin = useCallback(
    async (kycProvider: SUPPORTED_KYC_PROVIDERS) => {
      setIsPending(true)

      try {
        nextStepCb()

        await login(kycProvider)

        gaSendCustomEvent(GaCategories.ProviderSelection, {
          provider: kycProvider,
        })

        gaSendCustomEvent(kycProvider)
      } catch (error) {
        ErrorHandler.process(error)
        onErrorCb?.(error as Error)
      }

      setIsPending(false)
    },
    [login, nextStepCb, onErrorCb],
  )

  return (
    <div className={['kyc-providers', className].join(' ')} {...rest}>
      <h2 className='kyc-providers__title'>
        {`Add identity management to your wallet`}
      </h2>

      <div className='kyc-providers__list'>
        {Object.values(SUPPORTED_KYC_PROVIDERS).map((provider, idx) => (
          <KycProvidersItem
            key={idx}
            className='kyc-providers__list-item'
            supportedKycProvider={provider}
            name={KYC_PROVIDERS_DETAILS_MAP[provider].name}
            iconName={KYC_PROVIDERS_DETAILS_MAP[provider].iconName}
            handleLogin={handleLogin}
            isDisabled={isPending}
          />
        ))}
      </div>
    </div>
  )
}

export default KycProviders
