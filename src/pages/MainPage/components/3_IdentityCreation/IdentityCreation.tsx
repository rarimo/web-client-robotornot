import './styles.scss'

import { type FC, HTMLAttributes, useCallback, useState } from 'react'

import { AppButton } from '@/common'
import { useZkpContext } from '@/contexts'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const IdentityCreation: FC<Props> = ({ className, ...rest }) => {
  const [isPending, setIsPending] = useState(false)

  const { createIdentity } = useZkpContext()

  const requestCreateIdentity = useCallback(async () => {
    setIsPending(true)

    try {
      await createIdentity()
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsPending(false)
  }, [createIdentity])

  return (
    <div className={['identity-creation', className].join(' ')} {...rest}>
      <AppButton
        onClick={requestCreateIdentity}
        text={`Create profile`}
        modification='border-circle'
        isDisabled={isPending}
      />
    </div>
  )
}

export default IdentityCreation
