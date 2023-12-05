import { FC, HTMLAttributes, useEffect } from 'react'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
  errorCb: (error: Error) => void
}

const KycProviderKleros: FC<Props> = ({ loginCb, errorCb }) => {
  const { provider } = useWeb3Context()

  useEffect(() => {
    let getSignedNonce = async () => {
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
        errorCb(error as Error)
      }
    }

    getSignedNonce()

    return () => {
      getSignedNonce = async () => {
        /* empty */
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}

export default KycProviderKleros
