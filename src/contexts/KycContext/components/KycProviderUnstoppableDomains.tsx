import { config } from '@config'
import { fetcher } from '@distributedlab/fetcher'
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

  const getProfileDetails = useCallback(async () => {
    try {
      const { data } = await fetcher.get(
        `https://profile.unstoppabledomains.com/api/public/dlkharkiv.blockchain/badges`,
      )
    } catch (error) {}
  }, [])

  const login = useCallback(async () => {
    const response = await uauth.loginWithPopup()

    console.log(response)

    loginCb(response)
  }, [loginCb, uauth])

  useEffectOnce(() => {
    login()
  })

  return <></>
}

export default KycProviderUnstoppableDomains
