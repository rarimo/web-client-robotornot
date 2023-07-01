import './styles.scss'

import { FC, HTMLAttributes, useMemo } from 'react'

import { Icon } from '@/common'
import { useKycContext } from '@/contexts'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'

const KYC_PROVIDERS_MAP: Record<
  SUPPORTED_KYC_PROVIDERS,
  {
    name: string
    iconName: ICON_NAMES
  }
> = {
  [SUPPORTED_KYC_PROVIDERS.WORDLCOIN]: {
    name: 'Wordlcoin.org',
    iconName: ICON_NAMES.providerWorldCoin,
  },
  [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
    name: 'Civic.me',
    iconName: ICON_NAMES.providerCivic,
  },
  [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {
    name: 'Passport.gitcoin.co',
    iconName: ICON_NAMES.providerGitCoin,
  },
  [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
    name: 'Unstoppable domains',
    iconName: ICON_NAMES.providerUnstoppable,
  },
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  supportedKycProvider: SUPPORTED_KYC_PROVIDERS
}

const AuthProvidersItem: FC<Props> = ({ supportedKycProvider }) => {
  const { login } = useKycContext()

  const kycProvider = useMemo(
    () => KYC_PROVIDERS_MAP[supportedKycProvider],
    [supportedKycProvider],
  )

  return (
    <div className='auth-providers-item'>
      <Icon className='auth-providers-item__icon' name={kycProvider.iconName} />
      <h5 className='auth-providers-item__name'>{kycProvider.name}</h5>
      <Icon
        className='auth-providers-item__icon auth-providers-item__icon--decor'
        name={ICON_NAMES.arrowRight}
      />

      <button
        className='auth-providers-item__button'
        onClick={() => login(supportedKycProvider)}
      />
    </div>
  )
}

export default AuthProvidersItem
