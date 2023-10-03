import './styles.scss'

import { type FC, HTMLAttributes, useCallback, useState } from 'react'

import { useKycContext } from '@/contexts'
import { SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { ErrorHandler, GaCategories, gaSendCustomEvent } from '@/helpers'

import { KycProvidersItem } from './components'

type Props = HTMLAttributes<HTMLDivElement>

const KycProviders: FC<Props> = ({ className, ...rest }) => {
  const { KYC_PROVIDERS_DETAILS_MAP } = useKycContext()

  const [isPending, setIsPending] = useState(false)

  const { login } = useKycContext()

  const handleLogin = useCallback(
    async (kycProvider: SUPPORTED_KYC_PROVIDERS) => {
      setIsPending(true)

      try {
        await login(kycProvider)

        gaSendCustomEvent(GaCategories.ProviderSelection, {
          provider: kycProvider,
        })

        gaSendCustomEvent(kycProvider)
      } catch (error) {
        ErrorHandler.process(error)
      }

      setIsPending(false)
    },
    [login],
  )

  return (
    <div className={['kyc-providers', className].join(' ')} {...rest}>
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
  )
}

export default KycProviders
