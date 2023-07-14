import { FC, HTMLAttributes, useCallback, useState } from 'react'

import { api } from '@/api'
import { AppButton, BasicModal } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const KycProviderGitCoin: FC<Props> = ({ loginCb }) => {
  const { provider } = useWeb3Context()
  const [isModalShown, setIsModalShown] = useState(true)

  const getSignedNonce = useCallback(async () => {
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
      setIsModalShown(false)
      await loginCb({
        address: provider?.address,
        signature: signedMessage,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [loginCb, provider])

  return (
    <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
      <AppButton text={'Verify'} onClick={getSignedNonce} />
    </BasicModal>
  )
}

export default KycProviderGitCoin
