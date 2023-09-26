import './styles.scss'

import { type EthereumProvider, PROVIDERS } from '@distributedlab/w3p'
import { W3CCredential } from '@rarimo/rarime-connector'
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
  const {
    isSnapInstalled,
    isMetamaskInstalled,
    connectOrInstallSnap,
    checkSnapStatus,
  } = useMetamaskZkpSnapContext()

  const [vc] = useLocalStorage<W3CCredential | null>('vc', null)

  const isWalletAccountValid = useMemo(() => {
    if (!vc?.credentialSubject) return true

    return Boolean(
      vc?.credentialSubject &&
        'address' in vc.credentialSubject &&
        typeof vc.credentialSubject?.address === 'string' &&
        vc?.credentialSubject?.address?.toLowerCase() ===
          provider?.address?.toLowerCase(),
    )
  }, [provider?.address, vc?.credentialSubject])

  const connectProvider = useCallback(async () => {
    if (!isMetamaskInstalled) return

    try {
      await initProvider(PROVIDERS.Metamask)
      await connectOrInstallSnap()

      await checkSnapStatus()
    } catch (error) {
      ErrorHandler.process(error)
    }

    gaSendCustomEvent(GaCategories.WalletConnection, { location: `Navbar` })
  }, [isMetamaskInstalled, initProvider, connectOrInstallSnap, checkSnapStatus])

  const trySwitchAccount = useCallback(async () => {
    try {
      if (!provider?.rawProvider) throw new TypeError('Provider is not defined')

      await switchAccount(provider.rawProvider as EthereumProvider)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsDropdownShown(false)
  }, [provider?.rawProvider])

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
