import { State } from '@civic/common-gateway-react/dist/esm/types'
import { GatewayProvider, useGateway } from '@civic/ethereum-gateway-react'
import { providers, Wallet } from 'ethers'
import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { api } from '@/api'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

/**
 * unique pass for the gateway to work with biometrics identity verification
 */
const UNIQUENESS_PASS = 'uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv'

const KycProviderCivicContent: FC<Props> = ({ loginCb }) => {
  const { gatewayToken, requestGatewayToken } = useGateway()
  const [signedNonce, setSignedNonce] = useState<string>()
  const btnRef = useRef<HTMLButtonElement>()

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

      setSignedNonce(signedMessage)
      await loginCb({
        chainName: 'ethereum',
        address: provider?.address,
        signature: signedMessage,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [loginCb, provider])

  useEffect(() => {
    if (gatewayToken?.state === State.ACTIVE || signedNonce) return

    setTimeout(async () => {
      await requestGatewayToken()
    }, 500)
  }, [btnRef, gatewayToken?.state, requestGatewayToken, signedNonce])

  useEffect(() => {
    if (gatewayToken?.state !== State.ACTIVE || signedNonce) return

    getSignedNonce()
  }, [gatewayToken?.state, getSignedNonce, signedNonce])

  return <></>
}

const KycProviderCivic: FC<Props> = ({ loginCb }) => {
  const { provider } = useWeb3Context()

  const wallet = useMemo(
    () =>
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ).getSigner() as unknown as Wallet,
    [provider?.rawProvider],
  )

  return (
    <GatewayProvider
      wallet={wallet}
      gatekeeperNetwork={UNIQUENESS_PASS}
      options={{
        autoShowModal: true,
      }}
    >
      <KycProviderCivicContent loginCb={loginCb} />
    </GatewayProvider>
  )
}

export default KycProviderCivic
