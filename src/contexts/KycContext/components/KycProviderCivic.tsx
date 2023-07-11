import { GatewayProvider, IdentityButton } from '@civic/ethereum-gateway-react'
import { providers, Wallet } from 'ethers'
import { FC, HTMLAttributes, useMemo, useState } from 'react'

// import { useEffectOnce } from 'react-use'
// import { api } from '@/api'
import { BasicModal, ErrorMessage } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const UNIQUENESS_PASS = 'uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv'

// const KycProviderCivicContent: FC<Props> = ({ loginCb }) => {
//   const [isModalShown, setIsModalShown] = useState(true)
//
//   const { gatewayStatus, gatewayToken } = useGateway()
//
//   const { provider } = useWeb3Context()
//
//   const getSignedNonce = useCallback(async () => {
//     try {
//       const { data } = await api.get<{
//         message: string
//       }>('integrations/kyc-service/v1/public/nonce')
//
//       const signedMessage = await provider?.signMessage?.(data.message)
//       await loginCb(signedMessage)
//     } catch (error) {
//       ErrorHandler.process(error)
//     }
//   }, [loginCb, provider])
//
//   useEffect(() => {
//     if (
//       gatewayToken &&
//       gatewayStatus &&
//       gatewayStatus === GatewayStatus.USER_INFORMATION_VALIDATED
//     ) {
//       getSignedNonce()
//     }
//   }, [gatewayToken, gatewayStatus, loginCb, getSignedNonce])
//
//   return (
//     <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
//       <IdentityButton />
//     </BasicModal>
//   )
// }

const KycProviderCivic: FC<Props> = () => {
  const [isModalShown, setIsModalShown] = useState(true)

  const { provider } = useWeb3Context()

  const wallet = useMemo(
    () =>
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ).getSigner() as unknown as Wallet,
    [provider?.rawProvider],
  )

  try {
    return (
      <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
        <GatewayProvider wallet={wallet} gatekeeperNetwork={UNIQUENESS_PASS}>
          <IdentityButton />
        </GatewayProvider>
      </BasicModal>
    )
  } catch (error) {
    ErrorHandler.process(error)

    return (
      <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
        <ErrorMessage message={`Ooops... Something went wrong`} />
      </BasicModal>
    )
  }
}

export default KycProviderCivic
