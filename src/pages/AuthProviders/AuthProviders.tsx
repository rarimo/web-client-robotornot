import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'

import { AuthProvidersItem } from './components'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProviders: FC<Props> = () => {
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
        <AuthProvidersItem
          className='auth-providers__list-item'
          supportedKycProvider={SUPPORTED_KYC_PROVIDERS.WORDLCOIN}
        />
        <AuthProvidersItem
          className='auth-providers__list-item'
          supportedKycProvider={SUPPORTED_KYC_PROVIDERS.CIVIC}
        />
        <AuthProvidersItem
          className='auth-providers__list-item'
          supportedKycProvider={SUPPORTED_KYC_PROVIDERS.GITCOIN}
        />
        <AuthProvidersItem
          className='auth-providers__list-item'
          supportedKycProvider={SUPPORTED_KYC_PROVIDERS.UNSTOPPABLEDOMAINS}
        />
      </div>

      <div className='auth-providers__tip'>
        {`Dont have any account? `}
        <span className='auth-providers__tip-link'>{`Create Now`}</span>
      </div>
    </div>
  )
}

export default AuthProviders
