import './styles.scss'

import { config, SUPPORTED_CHAINS } from '@config'
import { type FC, HTMLAttributes, useCallback, useState } from 'react'

import { AppButton } from '@/common'
import { useZkpContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const ProofSubmitting: FC<Props> = ({ className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)
  const [selectedChainToPublish] = useState<SUPPORTED_CHAINS>(
    config.DEFAULT_CHAIN,
  )

  const { submitZkp } = useZkpContext()

  const requestSubmitZkp = useCallback(async () => {
    setIsPending(true)

    try {
      await submitZkp(selectedChainToPublish)
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [selectedChainToPublish, submitZkp])

  return (
    <div className={['proof-submitting', className].join(' ')} {...rest}>
      <AppButton
        iconLeft={ICON_NAMES.metamask}
        text={`Submit Proof`}
        modification='border-circle'
        onClick={requestSubmitZkp}
        isDisabled={isPending}
      />
    </div>
  )
}

export default ProofSubmitting
