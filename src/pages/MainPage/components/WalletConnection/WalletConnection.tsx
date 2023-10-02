import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const WalletConnection: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['wallet-connection', className].join(' ')} {...rest}></div>
  )
}

export default WalletConnection
