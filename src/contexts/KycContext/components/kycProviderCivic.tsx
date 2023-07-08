import { GatewayStatus } from '@civic/common-gateway-react/dist/esm/types'
import {
  GatewayProvider,
  IdentityButton,
  useGateway,
} from '@civic/ethereum-gateway-react'
import { CivicProfile, Profile } from '@civic/profile'
import { providers, Wallet } from 'ethers'
import { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { BasicModal, ErrorMessage } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const UNIQUENESS_PASS = 'uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv'

const KycProviderCivicContent: FC<Props> = ({ loginCb }) => {
  const [isModalShown, setIsModalShown] = useState(true)

  const { gatewayStatus, gatewayToken } = useGateway()

  useEffect(() => {
    if (
      gatewayToken &&
      gatewayStatus &&
      gatewayStatus === GatewayStatus.USER_INFORMATION_VALIDATED
    ) {
      loginCb(gatewayToken)
    }
  }, [gatewayToken, gatewayStatus, loginCb])

  return (
    <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
      <IdentityButton />
    </BasicModal>
  )
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

  const init = async () => {
    try {
      const profile: Profile = await CivicProfile.get(provider?.address ?? '')

      // eslint-disable-next-line no-console
      console.log(profile)
      // eslint-disable-next-line no-console
      console.log(await profile.getPasses())
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  useEffectOnce(() => {
    init()
  })

  try {
    return (
      <GatewayProvider wallet={wallet} gatekeeperNetwork={UNIQUENESS_PASS}>
        <KycProviderCivicContent loginCb={loginCb} />
      </GatewayProvider>
    )
  } catch (error) {
    ErrorHandler.process(error)

    return (
      <BasicModal
        isShown={true}
        updateIsShown={() => {
          /* empty */
        }}
      >
        <ErrorMessage message={`Ooops... Something went wrong`} />
      </BasicModal>
    )
  }
}

export default KycProviderCivic
