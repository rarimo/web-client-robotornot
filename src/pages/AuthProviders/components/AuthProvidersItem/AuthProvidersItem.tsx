import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback, useState } from 'react'

import { Icon } from '@/common'
import {
  useKycContext,
  useMetamaskZkpSnapContext,
  useWeb3Context,
} from '@/contexts'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'
import { ErrorHandler, GaCategories, gaSendCustomEvent } from '@/helpers'

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
  const [isPending, setIsPending] = useState(false)

  const { login } = useKycContext()
  const { provider, init, isValidChain } = useWeb3Context()
  const { connectOrInstallSnap } = useMetamaskZkpSnapContext()

  const connectProvider = useCallback(async () => {
    setIsPending(true)

    try {
      await init(PROVIDERS.Metamask)
      await connectOrInstallSnap()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    setIsPending(false)
  }, [connectOrInstallSnap, init])

  const handleLogin = useCallback(async () => {
    if (!provider?.isConnected && isWalletRequired) {
      await connectProvider()
    }

    if (!isValidChain) return

    await login(supportedKycProvider)

    gaSendCustomEvent(GaCategories.ProviderSelection, {
      provider: supportedKycProvider,
    })

    gaSendCustomEvent(supportedKycProvider)
  }, [
    connectProvider,
    isValidChain,
    isWalletRequired,
    login,
    provider?.isConnected,
    supportedKycProvider,
  ])

  return (
    <div
      className={[
        'auth-providers-item',
        ...(isPending ? ['auth-providers-item--disabled'] : []),
      ].join(' ')}
    >
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
