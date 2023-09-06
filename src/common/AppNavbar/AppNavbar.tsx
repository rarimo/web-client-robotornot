import './styles.scss'

import { type EthereumProvider, PROVIDERS } from '@distributedlab/w3p'
import { type VerifiableCredentials } from '@rarimo/auth-zkp-iden3'
import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocalStorage } from 'react-use'

import { AppButton, AppLogo, Drawer, Dropdown } from '@/common'
import { useMetamaskZkpSnapContext, useWeb3Context } from '@/contexts'
import type { QueryVariableName } from '@/contexts/ZkpContext/ZkpContext'
import { ICON_NAMES } from '@/enums'
import {
  abbrCenter,
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
  switchAccount,
} from '@/helpers'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const [isDrawerShown, setIsDrawerShown] = useState(false)
  const [isDropdownShown, setIsDropdownShown] = useState(false)
  const { provider, init: initProvider } = useWeb3Context()
  const { isSnapInstalled, init: initZkpSnap } = useMetamaskZkpSnapContext()

  const [vc] = useLocalStorage<VerifiableCredentials<QueryVariableName> | null>(
    'vc',
    null,
  )

  const isWalletAccountValid = useMemo(() => {
    if (!vc?.body?.credential?.credentialSubject) return true

    return Boolean(
      vc?.body?.credential?.credentialSubject &&
        'address' in vc.body.credential.credentialSubject &&
        typeof vc.body.credential.credentialSubject?.address === 'string' &&
        vc?.body?.credential?.credentialSubject?.address?.toLowerCase() ===
          provider?.address?.toLowerCase(),
    )
  }, [provider?.address, vc?.body.credential.credentialSubject])

  const connectProvider = useCallback(async () => {
    try {
      await initProvider(PROVIDERS.Metamask)

      const { isSnapInstalled } = await initZkpSnap()

      if (!isSnapInstalled) {
        await initZkpSnap()

        await initZkpSnap()
      }
    } catch (error) {
      ErrorHandler.process(error)
    }

    gaSendCustomEvent(GaCategories.WalletConnection, { location: `Navbar` })
  }, [initZkpSnap, initProvider])

  const trySwitchAccount = useCallback(async () => {
    try {
      if (!provider?.rawProvider) throw new TypeError('Provider is not defined')

      if (isWalletAccountValid) {
        bus.emit(
          BUS_EVENTS.warning,
          `Looks like you're trying to switch your MetaMask address! Please use the same account that you've used during the verification process.`,
        )
      }

      await switchAccount(provider.rawProvider as EthereumProvider)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsDropdownShown(false)
  }, [isWalletAccountValid, provider?.rawProvider])

  useEffect(() => {
    if (isWalletAccountValid) return

    bus.emit(
      BUS_EVENTS.warning,
      `Looks like you've switched your MetaMask address! Please use the same account that you've used during the verification process.`,
    )
  }, [isWalletAccountValid, provider?.address])

  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />

      <AppButton
        className='app-navbar__menu-btn'
        scheme='none'
        iconRight={ICON_NAMES.menu}
        onClick={() => setIsDrawerShown(!isDrawerShown)}
      />

      <Drawer isShown={isDrawerShown} updateIsShown={setIsDrawerShown}>
        <div className='app-navbar__drawer-body'>
          <Dropdown
            className='navbar__connection-dropdown'
            isOpen={isDropdownShown}
            setIsOpen={setIsDropdownShown}
            head={
              <AppButton
                className='navbar__connection-btn'
                scheme='flat'
                text={
                  !provider?.isConnected || !isSnapInstalled
                    ? `CONNECT METAMASK`
                    : abbrCenter(provider?.address ?? '')
                }
                iconLeft={ICON_NAMES.metamask}
                iconRight={
                  provider?.isConnected && isSnapInstalled
                    ? ICON_NAMES.chevronDown
                    : undefined
                }
                onClick={
                  provider?.isConnected && isSnapInstalled
                    ? () => setIsDropdownShown(prev => !prev)
                    : connectProvider
                }
              />
            }
          >
            <div className='navbar__connection-dropdown-body'>
              <AppButton
                className='navbar__connection-dropdown-btn'
                text={`SWITCH ACCOUNT`}
                iconLeft={ICON_NAMES.refresh}
                size='small'
                scheme='none'
                onClick={trySwitchAccount}
              />
            </div>
          </Dropdown>
        </div>
      </Drawer>

      <div className='app-navbar__actions'>
        <Dropdown
          className='navbar__connection-dropdown'
          isOpen={isDropdownShown}
          setIsOpen={setIsDropdownShown}
          head={
            <AppButton
              className='navbar__connection-btn'
              scheme='flat'
              text={
                !provider?.isConnected || !isSnapInstalled
                  ? `CONNECT METAMASK`
                  : abbrCenter(provider?.address ?? '')
              }
              iconLeft={ICON_NAMES.metamask}
              iconRight={
                provider?.isConnected && isSnapInstalled
                  ? ICON_NAMES.chevronDown
                  : undefined
              }
              onClick={
                provider?.isConnected && isSnapInstalled
                  ? () => setIsDropdownShown(prev => !prev)
                  : connectProvider
              }
            />
          }
        >
          <div className='navbar__connection-dropdown-body'>
            <AppButton
              className='navbar__connection-dropdown-btn'
              text={`SWITCH ACCOUNT`}
              iconLeft={ICON_NAMES.refresh}
              size='small'
              scheme='none'
              onClick={trySwitchAccount}
            />
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default AppNavbar
