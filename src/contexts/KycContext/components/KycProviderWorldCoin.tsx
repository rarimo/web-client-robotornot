import { config } from '@config'
import { Time } from '@distributedlab/tools'
import { FC, HTMLAttributes } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { v4 as uuidv4 } from 'uuid'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
  errorCb?: (error: Error) => void
}

const KycProviderUnstoppableDomains: FC<Props> = ({ loginCb }) => {
  const [searchParams] = useSearchParams()

  const RESPONSE_TYPE = 'id_token'

  const state = `session_${new Time().ms}`
  const nonce = uuidv4()

  useEffectOnce(() => {
    const wcRedirectUrl = `https://id.worldcoin.org/authorize?client_id=${
      config.WORLDCOIN_APP_ID
    }&response_type=${RESPONSE_TYPE}&redirect_uri=${
      new URL(window.location.href).href
    }&scope=openid&state=${state}&nonce=${nonce}`

    searchParams.get('id_token')
      ? loginCb(searchParams.get('id_token'))
      : window.open(wcRedirectUrl, '_self', 'noopener,noreferrer')
  })

  return <></>
}

export default KycProviderUnstoppableDomains
