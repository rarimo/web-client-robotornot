import {
  GatewayProvider,
  IdentityButton,
  useGateway,
} from '@civic/ethereum-gateway-react'
import { providers, Wallet } from 'ethers'
import { debounce } from 'lodash'
import { FC, HTMLAttributes, useCallback, useMemo } from 'react'
import { useEffectOnce } from 'react-use'

import { Modal } from '@/common'
import { useWeb3Context } from '@/contexts/Web3ProviderContext'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => void
  updateIsShown: (isShown: boolean) => void
}

const UNIQUENESS_PASS = 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'

const CivicProviderContent = () => {
  const { gatewayToken } = useGateway()
  const token = useMemo(() => gatewayToken, [gatewayToken])
  console.log(token)

  return <></>
}

const KycProviderCivic: FC<Props> = ({ loginCb, updateIsShown }) => {
  const { provider } = useWeb3Context()

  const wallet = useMemo(
    () =>
      new providers.Web3Provider(
        provider?.rawProvider as providers.ExternalProvider,
      ).getSigner() as unknown as Wallet,
    [provider?.rawProvider],
  )

  // const login = useCallback(async () => {
  //   const response = loginCb(response)
  // }, [loginCb])

  // useEffectOnce(
  //   debounce(() => {
  //     login()
  //   }, 100),
  // )

  return (
    <GatewayProvider wallet={wallet} gatekeeperNetwork={UNIQUENESS_PASS}>
      <Modal isShown={true} updateIsShown={updateIsShown}>
        <CivicProviderContent />
        <IdentityButton />
      </Modal>
    </GatewayProvider>
  )
}

export default KycProviderCivic
