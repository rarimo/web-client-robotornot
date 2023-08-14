import './styles.scss'

import { FC, HTMLAttributes, useState } from 'react'

import { AppButton, Dropdown, Icon } from '@/common'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'

import { AuthProvidersItem } from './components'

type Props = HTMLAttributes<HTMLDivElement>

const KYC_PROVIDERS_MAP: Record<
  SUPPORTED_KYC_PROVIDERS,
  {
    name: string
    iconName: ICON_NAMES
    link: string
  }
> = {
  [SUPPORTED_KYC_PROVIDERS.WORLDCOIN]: {
    name: 'Worldcoin',
    iconName: ICON_NAMES.providerWorldCoin,
    link: 'https://worldcoin.org/download-app',
  },
  [SUPPORTED_KYC_PROVIDERS.CIVIC]: {
    name: 'Civic',
    iconName: ICON_NAMES.providerCivic,
    link: 'https://civic.me/',
  },
  [SUPPORTED_KYC_PROVIDERS.GITCOIN]: {
    name: 'Gitcoin Passport',
    iconName: ICON_NAMES.providerGitCoin,
    link: 'https://passport.gitcoin.co/',
  },
  [SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS]: {
    name: 'Unstoppable domains',
    iconName: ICON_NAMES.providerUnstoppable,
    link: 'https://unstoppabledomains.com/auth',
  },
}

const AuthProviders: FC<Props> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className='auth-providers'>
      <div className='auth-providers__header'>
        <Icon
          className='auth-providers__header-icon'
          name={ICON_NAMES.reCaptcha}
        />
        <h2 className='auth-providers__header-title'>{`You’re not a robot!`}</h2>
        <span className='auth-providers__header-subtitle'>{`Try something new`}</span>
      </div>

      <div className='auth-providers__list'>
        {Object.values(SUPPORTED_KYC_PROVIDERS).map((provider, idx) => (
          <AuthProvidersItem
            key={idx}
            className='auth-providers__list-item'
            supportedKycProvider={provider}
            name={KYC_PROVIDERS_MAP[provider].name}
            iconName={KYC_PROVIDERS_MAP[provider].iconName}
          />
        ))}
      </div>

      <div className='auth-providers__tip'>
        {`Don't have any account?`}
        <Dropdown
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
          direction='top-center'
          head={
            <AppButton
              className='auth-providers__dropdown-btn'
              scheme='none'
              size='none'
              iconRight={ICON_NAMES.chevronDown}
              text={`Create Now`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          }
        >
          <div className='auth-providers__links-list'>
            {Object.values(SUPPORTED_KYC_PROVIDERS).map((provider, idx) => (
              <AppButton
                className='auth-providers__links-item'
                scheme='none'
                key={idx}
                text={KYC_PROVIDERS_MAP[provider].name}
                iconLeft={KYC_PROVIDERS_MAP[provider].iconName}
                href={KYC_PROVIDERS_MAP[provider].link}
                target='_blank'
              />
            ))}
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default AuthProviders
