import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

import { useKycContext } from '@/contexts'
import { SUPPORTED_KYC_PROVIDERS } from '@/enums'

import { KycProvidersItem } from './components'

type Props = HTMLAttributes<HTMLDivElement>

const KycProviders: FC<Props> = ({ className, ...rest }) => {
  const { KYC_PROVIDERS_DETAILS_MAP } = useKycContext()

  return (
    <div className={['kyc-providers', className].join(' ')} {...rest}>
      {Object.values(SUPPORTED_KYC_PROVIDERS).map((provider, idx) => (
        <KycProvidersItem
          key={idx}
          className='kyc-providers__list-item'
          supportedKycProvider={provider}
          name={KYC_PROVIDERS_DETAILS_MAP[provider].name}
          iconName={KYC_PROVIDERS_DETAILS_MAP[provider].iconName}
          isWalletRequired={
            KYC_PROVIDERS_DETAILS_MAP[provider].isWalletRequired
          }
        />
      ))}
    </div>
  )
}

export default KycProviders
