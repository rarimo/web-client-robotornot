import './styles.scss'

import { type EthereumProvider, PROVIDERS } from '@distributedlab/w3p'
import { FC, HTMLAttributes, useCallback, useState } from 'react'

import { AppButton, AppLogo, Drawer, Dropdown } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES, RoutesPaths } from '@/enums'
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
  const { provider, init } = useWeb3Context()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.process(error)
    }

    gaSendCustomEvent(GaCategories.WalletConnection, { location: `Navbar` })
  }, [init])

  const trySwitchAccount = useCallback(async () => {
    try {
      if (!provider?.rawProvider) throw new TypeError('Provider is not defined')

      if (localStorage.getItem('vc')) {
        bus.emit(
          BUS_EVENTS.warning,
          `You're trying to switch wallet after pass kyc verification, please ensure you're using exact same wallet`,
        )
      }

      await switchAccount(provider.rawProvider as EthereumProvider)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsDropdownShown(false)
  }, [provider?.rawProvider])

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
                  !provider?.isConnected
                    ? `CONNECT METAMASK`
                    : abbrCenter(provider?.address ?? '')
                }
                iconLeft={ICON_NAMES.metamask}
                onClick={
                  provider?.isConnected
                    ? () => setIsDropdownShown(prev => !prev)
                    : connectProvider
                }
                isDisabled={provider?.isConnected}
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

          <AppButton
            className='navbar__account-link'
            iconLeft={ICON_NAMES.user}
            scheme='flat'
            size='large'
            routePath={RoutesPaths.profile}
          />
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
                !provider?.isConnected
                  ? `CONNECT METAMASK`
                  : abbrCenter(provider?.address ?? '')
              }
              iconLeft={ICON_NAMES.metamask}
              iconRight={
                provider?.isConnected ? ICON_NAMES.chevronDown : undefined
              }
              onClick={
                provider?.isConnected
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

        <AppButton
          className='navbar__account-link'
          iconLeft={ICON_NAMES.user}
          scheme='flat'
          size='large'
          routePath={RoutesPaths.profile}
        />
      </div>
    </div>
  )
}

export default AppNavbar
