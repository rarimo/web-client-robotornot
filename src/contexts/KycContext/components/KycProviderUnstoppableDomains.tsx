import UAuth from '@uauth/js'
import debounce from 'lodash/debounce'
import { FC, HTMLAttributes, useCallback, useMemo } from 'react'
import { useEffectOnce } from 'react-use'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => void
}

const KycProviderUnstoppableDomains: FC<Props> = ({ loginCb }) => {
  const uauth = useMemo(
    () =>
      new UAuth({
        clientID: '6411ad0a-4502-4cae-84ae-f810634f25b8',
        redirectUri: 'http://localhost:8095',
        scope: 'openid wallet messaging:notifications:optional',
      }),
    [],
  )

  const login = useCallback(async () => {
    const response = await uauth.loginWithPopup()
    loginCb(response)
  }, [loginCb, uauth])

  useEffectOnce(
    debounce(() => {
      login()
    }, 100),
  )

  return <></>
}

export default KycProviderUnstoppableDomains
