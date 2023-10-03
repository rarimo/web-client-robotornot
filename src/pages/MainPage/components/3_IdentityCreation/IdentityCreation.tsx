import './styles.scss'

import { type FC, HTMLAttributes, useCallback } from 'react'

import { AppButton } from '@/common'
import { useZkpContext } from '@/contexts'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const IdentityCreation: FC<Props> = ({ className, ...rest }) => {
  const { createIdentity } = useZkpContext()

  const requestCreateIdentity = useCallback(async () => {
    try {
      await createIdentity()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [createIdentity])

  return (
    <div className={['identity-creation', className].join(' ')} {...rest}>
      <AppButton
        onClick={requestCreateIdentity}
        text={`Create profile`}
        modification='border-circle'
      />
    </div>
  )
}

export default IdentityCreation
