import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const KycProviders: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['kyc-providers', className].join(' ')} {...rest}></div>
  )
}

export default KycProviders
