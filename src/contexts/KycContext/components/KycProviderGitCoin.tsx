import { FC, HTMLAttributes } from 'react'
import { useEffectOnce } from 'react-use'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const KycProviderGitCoin: FC<Props> = ({ loginCb }) => {
  const { provider } = useWeb3Context()

  useEffectOnce(() => {
    const getSignedNonce = async () => {
      try {
        const { data } = await api.post<{
          message: string
        }>('integrations/kyc-service/v1/public/nonce', {
          body: {
            data: {
              type: 'nonce_request',
              attributes: {
                address: provider?.address,
              },
            },
          },
        })

        const signedMessage = await provider?.signMessage?.(data.message)
        await loginCb({
          address: provider?.address,
          signature: signedMessage,
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
    }

    getSignedNonce()
  })

  return <></>
}

export default KycProviderGitCoin
