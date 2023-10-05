import './styles.scss'

import { config } from '@config'
import { motion } from 'framer-motion'
import { type FC, useCallback, useState } from 'react'

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
import { StepProps } from '@/pages/MainPage/components/types'

const ProofGenerating: FC<StepProps> = ({
  nextStepCb,
  onErrorCb,
  className,
  ...rest
}) => {
  const [isPending, setIsPending] = useState(false)

  const { provider } = useWeb3Context()
  const { identityBigIntString, getZkProof } = useZkpContext()

  const { isIdentityProved, isSenderAddressProved } = useIdentityVerifier(
    config?.[`IDENTITY_VERIFIER_CONTRACT_ADDRESS_${config.DEFAULT_CHAIN}`],
  )

  const checkIsIdentityProved = useCallback(async () => {
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
      return true
    }

    return false
  }, [
    identityBigIntString,
    isIdentityProved,
    isSenderAddressProved,
    provider?.address,
  ])

  const handleGenerateProof = useCallback(async () => {
    setIsPending(true)

    try {
      nextStepCb()

      if (config.ENVIRONMENT !== 'dev') {
        if (await checkIsIdentityProved())
          throw new TypeError(`Identity already proved`)
      }

      await getZkProof()
    } catch (error) {
      ErrorHandler.process(error)
      onErrorCb?.(error as Error)
    }

    gaSendCustomEvent(GaCategories.GenerateProof)
    setIsPending(false)
  }, [checkIsIdentityProved, getZkProof, nextStepCb, onErrorCb])

  return (
    <motion.div className={['proof-generating', className].join(' ')} {...rest}>
      <AppButton
        text={`Generate proof`}
        modification='border-circle'
        onClick={handleGenerateProof}
        isDisabled={isPending}
      />
    </motion.div>
  )
}

export default ProofGenerating
