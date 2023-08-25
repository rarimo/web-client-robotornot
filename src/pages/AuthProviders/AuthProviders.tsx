import './styles.scss'

import { FC, HTMLAttributes, useState } from 'react'

import { AppButton, Dropdown, Icon } from '@/common'
import { useKycContext } from '@/contexts'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'

import { AuthProvidersItem } from './components'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProviders: FC<Props> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { KYC_PROVIDERS_DETAILS_MAP } = useKycContext()

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
            name={KYC_PROVIDERS_DETAILS_MAP[provider].name}
            iconName={KYC_PROVIDERS_DETAILS_MAP[provider].iconName}
            isWalletRequired={
              KYC_PROVIDERS_DETAILS_MAP[provider].isWalletRequired
            }
          />
        ))}
      </div>

      <div className='auth-providers__tip'>
        <div className='auth-providers__tip-text'>
          {`Don't have any account?`}
        </div>
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
                text={KYC_PROVIDERS_DETAILS_MAP[provider].name}
                iconLeft={KYC_PROVIDERS_DETAILS_MAP[provider].iconName}
                href={KYC_PROVIDERS_DETAILS_MAP[provider].link}
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
