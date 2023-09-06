import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback } from 'react'

import { Icon } from '@/common'
import { useKycContext, useWeb3Context } from '@/contexts'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { GaCategories, gaSendCustomEvent } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  supportedKycProvider: SUPPORTED_KYC_PROVIDERS
  iconName: ICON_NAMES
  name: string
  isWalletRequired: boolean
}

const AuthProvidersItem: FC<Props> = ({
  iconName,
  name,
  supportedKycProvider,
  isWalletRequired,
}) => {
  const { login } = useKycContext()
  const { provider, init } = useWeb3Context()

  const connectProvider = useCallback(async () => {
    await init(PROVIDERS.Metamask)
  }, [init])

  const handleLogin = useCallback(async () => {
    if (!provider?.isConnected && isWalletRequired) {
      await connectProvider()
    }

    await login(supportedKycProvider)

    gaSendCustomEvent(GaCategories.ProviderSelection, {
      provider: supportedKycProvider,
    })

    gaSendCustomEvent(supportedKycProvider)
  }, [
    connectProvider,
    isWalletRequired,
    login,
    provider?.isConnected,
    supportedKycProvider,
  ])

  return (
    <div className='auth-providers-item'>
      <Icon className='auth-providers-item__icon' name={iconName} />
      <h5 className='auth-providers-item__name'>{name}</h5>
      <Icon
        className='auth-providers-item__icon auth-providers-item__icon--decor'
        name={ICON_NAMES.arrowRight}
      />

      <button className='auth-providers-item__button' onClick={handleLogin} />
    </div>
  )
}

export default AuthProvidersItem
