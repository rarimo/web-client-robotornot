import './styles.scss'

import { State } from '@civic/common-gateway-react'
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
import { BasicModal, Icon } from '@/common'
import { config } from '@/config'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { bus, BUS_EVENTS, ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

/**
 * unique pass for the gateway to work with biometrics identity verification
 */
const GATEKEEPER_NETWORK_MAP = {
  uniqness: 'uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv',
  captcha: 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6',
}

const KycProviderCivicContent: FC<Props & { handleSigned: () => void }> = ({
  loginCb,
  handleSigned,
}) => {
  const { gatewayToken, requestGatewayToken } = useGateway()
  const [signedNonce, setSignedNonce] = useState<string>()
  const btnRef = useRef<HTMLButtonElement>()

  const { provider } = useWeb3Context()

  const getSignedNonce = useCallback(async () => {
    try {
      const { data } = await api.post<{
        message: string
      }>('/integrations/kyc-service/v1/public/nonce', {
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
      handleSigned()

      const KYC_CIVIC_CHAINS_NAMES_MAP = {
        [config.SUPPORTED_CHAINS_DETAILS?.['MAINNET'].id]: 'ethereum',
        [config.SUPPORTED_CHAINS_DETAILS?.['SEPOLIA'].id]: 'ethereum',
        [config.SUPPORTED_CHAINS_DETAILS?.['POLYGON'].id]: 'polygon',
        [config.SUPPORTED_CHAINS_DETAILS?.['POLYGON_TESTNET'].id]: 'polygon',
        [config.SUPPORTED_CHAINS_DETAILS?.['ARBITRUM'].id]: 'arbitrum',
        [config.SUPPORTED_CHAINS_DETAILS?.['XDC'].id]: 'xdc',
      }

      if (!provider?.chainId)
        throw new Error('Provider Chain ID is not defined')

      await loginCb({
        chainName: KYC_CIVIC_CHAINS_NAMES_MAP[provider.chainId] || 'ethereum',
        address: provider?.address,
        signature: signedMessage,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [loginCb, provider, handleSigned])

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

  const isProduction = useMemo(() => config.ENVIRONMENT === 'production', [])

  const [gatekeeperNetwork, setGatekeeperNetwork] = useState<string>()

  useEffectOnce(() => {
    if (!provider?.isConnected) {
      bus.emit(BUS_EVENTS.warning, `Please connect your wallet.`)
    }
  })

  const handleSigned = useCallback(() => {
    setIsModalShown(false)
  }, [])

  if (isProduction) {
    return (
      <GatewayProvider
        wallet={wallet}
        gatekeeperNetwork={GATEKEEPER_NETWORK_MAP.uniqness}
        options={{
          autoShowModal: true,
        }}
      >
        <KycProviderCivicContent
          loginCb={loginCb}
          handleSigned={handleSigned}
        />
      </GatewayProvider>
    )
  }

  return (
    <BasicModal
      className='kyc-provider-civic__modal'
      title={`Verification`}
      isShown={isModalShown}
      updateIsShown={setIsModalShown}
    >
      <div className='kyc-provider-civic__modal-body'>
        <button
          className='kyc-provider-civic__modal-body-btn'
          onClick={() => setGatekeeperNetwork(GATEKEEPER_NETWORK_MAP.uniqness)}
        >
          <span className='kyc-provider-civic__modal-body-btn-icon-wrp'>
            <Icon
              className='kyc-provider-civic__modal-body-btn-icon'
              name={ICON_NAMES.usersGroup4}
            />
          </span>
          {`Unique Verification`}
        </button>

        <button
          className='kyc-provider-civic__modal-body-btn'
          onClick={() => setGatekeeperNetwork(GATEKEEPER_NETWORK_MAP.captcha)}
        >
          <span className='kyc-provider-civic__modal-body-btn-icon-wrp'>
            <Icon
              className='kyc-provider-civic__modal-body-btn-icon'
              name={ICON_NAMES.robot}
            />
          </span>
          {`CAPTCHA Verification`}
        </button>
      </div>

      {gatekeeperNetwork && (
        <GatewayProvider
          wallet={wallet}
          gatekeeperNetwork={gatekeeperNetwork}
          options={{
            autoShowModal: true,
          }}
        >
          <KycProviderCivicContent
            loginCb={loginCb}
            handleSigned={handleSigned}
          />
        </GatewayProvider>
      )}
    </BasicModal>
  )
}

export default KycProviderCivic
