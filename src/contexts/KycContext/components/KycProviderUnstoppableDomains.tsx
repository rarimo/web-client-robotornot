import { config } from '@config'
import UAuth from '@uauth/js'
import { FC, HTMLAttributes, useCallback, useMemo } from 'react'
import { useEffectOnce } from 'react-use'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => void
  setKycDetails: (details: unknown) => void
}

const KycProviderUnstoppableDomains: FC<Props> = ({
  loginCb,
  setKycDetails,
}) => {
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
    const authorization = await uauth.loginWithPopup()

    const user = await uauth.user()

    setKycDetails(user)

    loginCb(authorization)
  }, [loginCb, setKycDetails, uauth])

  useEffectOnce(() => {
    login()
  })

  return <></>
}

export default KycProviderUnstoppableDomains
