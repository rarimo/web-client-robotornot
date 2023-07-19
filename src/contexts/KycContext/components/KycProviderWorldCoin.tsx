import { config } from '@config'
import { FC, HTMLAttributes, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { api } from '@/api'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
  setKycDetails: (details: unknown) => void
}
const KycProviderUnstoppableDomains: FC<Props> = ({
  loginCb,
  setKycDetails,
}) => {
  const [searchParams] = useSearchParams()

  const redirectUrl = 'https://identity.146.190.48.227.sslip.io/auth/providers'
  const responseType = 'id_token'
  const state = 'session_102030405060708091'
  const nonce = 'z-dkEmoy_ujfk7B8uTiQph'

  const fetchUserData = useCallback(async (token: string) => {
    return await api.fetcher
      .withBaseUrl('https://id.worldcoin.org/userinfo')
      .post('', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  }, [])

  useEffectOnce(() => {
    const token = searchParams.get('id_token')
    if (token) {
      const user = fetchUserData(token)
      // eslint-disable-next-line no-console
      console.log(user)
      setKycDetails(user)
      loginCb(token)
    } else {
      window.open(
        `https://id.worldcoin.org/authorize?client_id=${config.WORLDCOIN_APP_ID}&response_type=${responseType}&redirect_uri=${redirectUrl}&state=${state}&nonce=${nonce}`,
        '_blank',
        'noopener, noreferrer',
      )
    }
  })

  return <></>
}

export default KycProviderUnstoppableDomains
