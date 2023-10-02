import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const SnapConnection: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['snap-connection', className].join(' ')} {...rest}></div>
  )
}

export default SnapConnection
