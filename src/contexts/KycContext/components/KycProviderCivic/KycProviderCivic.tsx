import './styles.scss'

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
import { useEffectOnce } from 'react-use'

import { api } from '@/api'
import { AppButton, BasicModal } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
  setKycDetails: (details: unknown) => void
}

/**
 * unique pass for the gateway to work with biometrics identity verification
 */
const GATEKEEPER_NETWORK_MAP = {
  uniqness: 'uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv',
  captcha: 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6',
}

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

const KycProviderCivic: FC<Props> = ({ loginCb, setKycDetails }) => {
  const [isModalShown, setIsModalShown] = useState(true)
  const { provider } = useWeb3Context()

  const wallet = useMemo(() => {
    try {
      return new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ).getSigner() as unknown as Wallet
    } catch (error) {
      /* empty */
    }
  }, [provider?.rawProvider])

  const [gatekeeperNetwork, setGatekeeperNetwork] = useState<string>()

  useEffectOnce(() => {
    if (!provider?.isConnected) {
      bus.emit(BUS_EVENTS.warning, `Please connect your wallet.`)
    }
  })

  return (
    <BasicModal
      title={`Civic Pass verified users get permissioned access to dAPPs.`}
      isShown={isModalShown}
      updateIsShown={setIsModalShown}
    >
      <div className='kyc-provider-civic__modal-body'>
        <AppButton
          text={`Uniqness`}
          onClick={() => setGatekeeperNetwork(GATEKEEPER_NETWORK_MAP.uniqness)}
          iconLeft={ICON_NAMES.users}
        />
        <AppButton
          text={`Captcha`}
          onClick={() => setGatekeeperNetwork(GATEKEEPER_NETWORK_MAP.captcha)}
          iconLeft={ICON_NAMES.reCaptcha}
        />
      </div>

      {gatekeeperNetwork ? (
        <GatewayProvider
          wallet={wallet}
          gatekeeperNetwork={gatekeeperNetwork}
          options={{
            autoShowModal: true,
          }}
        >
          <KycProviderCivicContent
            loginCb={loginCb}
            setKycDetails={setKycDetails}
          />
        </GatewayProvider>
      ) : (
        <></>
      )}
    </BasicModal>
  )
}

export default KycProviderCivic
