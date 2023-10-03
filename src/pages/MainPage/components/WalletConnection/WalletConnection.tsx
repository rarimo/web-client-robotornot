import './styles.scss'

import { PROVIDERS } from '@distributedlab/w3p'
import { type FC, HTMLAttributes, useCallback } from 'react'

import { AppButton } from '@/common'
import { useWeb3Context } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const WalletConnection: FC<Props> = ({ className, ...rest }) => {
  const { init } = useWeb3Context()

  const connectProvider = useCallback(async () => {
    try {
      await init(PROVIDERS.Metamask)
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }, [init])

  return (
    <div className={['wallet-connection', className].join(' ')} {...rest}>
      <AppButton
        iconLeft={ICON_NAMES.metamask}
        onClick={connectProvider}
        text={`Connect metamask`}
        modification='border-circle'
      />
    </div>
  )
}

export default WalletConnection
