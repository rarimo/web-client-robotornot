import './styles.scss'

import { type FC, HTMLAttributes, useCallback } from 'react'

import { AppButton } from '@/common'
import { useMetamaskZkpSnapContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const SnapConnection: FC<Props> = ({ className, ...rest }) => {
  const { connectOrInstallSnap, checkSnapStatus } = useMetamaskZkpSnapContext()

  const installSnap = useCallback(async () => {
    try {
      await connectOrInstallSnap()
      await checkSnapStatus()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [checkSnapStatus, connectOrInstallSnap])

  return (
    <div className={['snap-connection', className].join(' ')} {...rest}>
      <AppButton
        iconLeft={ICON_NAMES.rarimeSnap}
        onClick={installSnap}
        text={`Install Snap`}
        modification='border-circle'
      />
    </div>
  )
}

export default SnapConnection
