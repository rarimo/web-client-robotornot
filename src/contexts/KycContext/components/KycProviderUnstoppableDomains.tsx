import { config } from '@config'
import UAuth from '@uauth/js'
import { FC, HTMLAttributes, useCallback, useMemo } from 'react'
import { useEffectOnce } from 'react-use'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => void
}

const KycProviderUnstoppableDomains: FC<Props> = ({ loginCb }) => {
  const uauth = useMemo(
    () =>
      new UAuth({
        clientID: config.UNSTOPPABLE_DOMAINS_CLIENT_ID,
        redirectUri: new URL(window.location.href).origin,
        scope: 'openid wallet messaging:notifications:optional',
      }),
    [],
  )

  const login = useCallback(async () => {
    const response = await uauth.loginWithPopup()
    loginCb(response)
  }, [loginCb, uauth])

  useEffectOnce(() => {
    login()
  })

  return <></>
}

export default KycProviderUnstoppableDomains
