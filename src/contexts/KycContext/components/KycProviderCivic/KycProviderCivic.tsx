import './style.scss'

import { State } from '@civic/common-gateway-react/dist/esm/types'
import {
  GatewayProvider,
  IdentityButton,
  useGateway,
} from '@civic/ethereum-gateway-react'
import { providers, Wallet } from 'ethers'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'

import { api } from '@/api'
import { AppButton, BasicModal } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const UNIQUENESS_PASS = 'uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv'

const KycProviderCivicContent: FC<Props> = ({ loginCb }) => {
  const { gatewayToken } = useGateway()

  const { provider } = useWeb3Context()

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
      await loginCb({
        chainName: 'ethereum',
        address: provider?.address,
        signature: signedMessage,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [loginCb, provider])

  return (
    <div>
      <IdentityButton />
      <AppButton
        className='kyc-provider-civic__login-btn'
        isDisabled={!gatewayToken || gatewayToken.state !== State.ACTIVE}
        text={'Login'}
        onClick={getSignedNonce}
      />
    </div>
  )
}

const KycProviderCivic: FC<Props> = ({ loginCb }) => {
  const [isModalShown, setIsModalShown] = useState(true)

  const { provider } = useWeb3Context()

  const wallet = useMemo(
    () =>
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ).getSigner() as unknown as Wallet,
    [provider?.rawProvider],
  )

  return (
    <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
      <GatewayProvider wallet={wallet} gatekeeperNetwork={UNIQUENESS_PASS}>
        <KycProviderCivicContent loginCb={loginCb} />
      </GatewayProvider>
    </BasicModal>
  )
}

export default KycProviderCivic
