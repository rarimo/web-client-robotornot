import { GatewayProvider, IdentityButton } from '@civic/ethereum-gateway-react'
import { PopulatedTransaction, providers, Wallet } from 'ethers'
import { FC, HTMLAttributes, useCallback, useMemo, useState } from 'react'

import { api } from '@/api'
import { BasicModal } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ErrorHandler } from '@/helpers'

interface Props extends HTMLAttributes<HTMLDivElement> {
  loginCb: (response: unknown) => Promise<void>
}

const UNIQUENESS_PASS = 'ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6'

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

  const getSignedNonce = useCallback(async () => {
    const { data } = await api.get<{
      message: string
    }>('integrations/kyc-service/v1/public/nonce')

    return provider?.signMessage?.(data.message)
  }, [provider])

  const handleSuccessKyc = useCallback(
    async (populatedTransaction: PopulatedTransaction) => {
      try {
        await provider?.signAndSendTx(populatedTransaction)

        await loginCb({
          chain_name: 'ethereum',
          address: provider?.address,
          signature: await getSignedNonce(),
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    [getSignedNonce, loginCb, provider],
  )

  return (
    <BasicModal isShown={isModalShown} updateIsShown={setIsModalShown}>
      <GatewayProvider
        wallet={wallet}
        gatekeeperNetwork={UNIQUENESS_PASS}
        gatekeeperSendsTransaction={false}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        handleTransaction={handleSuccessKyc}
      >
        <IdentityButton />
      </GatewayProvider>
    </BasicModal>
  )
}

export default KycProviderCivic
