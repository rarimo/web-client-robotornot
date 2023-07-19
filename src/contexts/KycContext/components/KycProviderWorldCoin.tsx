import { config } from '@config'
import { FC, HTMLAttributes } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

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

  useEffectOnce(() => {
    searchParams.get('id_token')
      ? loginCb(searchParams.get('id_token'))
      : window.open(
          `https://id.worldcoin.org/authorize?client_id=${config.WORLDCOIN_APP_ID}&response_type=${responseType}&redirect_uri=${redirectUrl}&state=${state}&nonce=${nonce}`,
          '_blank',
          'noopener, noreferrer',
        )
  })

  return <></>
}

export default KycProviderUnstoppableDomains
