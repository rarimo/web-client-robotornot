import './styles.scss'

import { config } from '@config'
import { type FC, HTMLAttributes, useCallback, useState } from 'react'

import { AppButton } from '@/common'
import { useWeb3Context, useZkpContext } from '@/contexts'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  GaCategories,
  gaSendCustomEvent,
} from '@/helpers'
import { useIdentityVerifier } from '@/hooks/contracts'

type Props = HTMLAttributes<HTMLDivElement>

const ProofGenerating: FC<Props> = ({ className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)

  const { provider } = useWeb3Context()
  const { identityBigIntString, getZkProof } = useZkpContext()

  const { isIdentityProved, isSenderAddressProved } = useIdentityVerifier(
    config?.[`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`],
  )

  const handleGenerateProof = useCallback(async () => {
    setIsPending(true)

    try {
      if (!identityBigIntString || !provider?.address)
        throw new TypeError(`Identity or provider is not defined`)

      const isDIDProved = await isIdentityProved(identityBigIntString)

      const isAddressProved = await isSenderAddressProved(provider.address)

      let provedMsg = ''

      if (isDIDProved && isAddressProved) {
        provedMsg =
          'Your identity has been verified as human, and the wallet address is already linked to it.'
      } else if (isDIDProved && !isAddressProved) {
        provedMsg = 'Identity verification already completed'
      } else if (!isDIDProved && isAddressProved) {
        provedMsg =
          'The wallet address you entered is associated with another identity. Please use a different wallet address.'
      }

      if (provedMsg) {
        bus.emit(BUS_EVENTS.warning, provedMsg)

        setIsPending(false)
        return
      }

      await getZkProof()
    } catch (error) {
      ErrorHandler.process(error)
    }

    gaSendCustomEvent(GaCategories.GenerateProof)
    setIsPending(false)
  }, [
    getZkProof,
    identityBigIntString,
    isIdentityProved,
    isSenderAddressProved,
    provider?.address,
  ])

  return (
    <div className={['proof-generating', className].join(' ')} {...rest}>
      <AppButton
        text={`Generate proof`}
        modification='border-circle'
        onClick={handleGenerateProof}
        isDisabled={isPending}
      />
    </div>
  )
}

export default ProofGenerating
