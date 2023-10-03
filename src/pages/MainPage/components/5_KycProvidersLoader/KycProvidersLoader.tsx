import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const KycProvidersLoader: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['kyc-providers', className].join(' ')} {...rest}>
      {'Loading...'}
    </div>
  )
}

export default KycProvidersLoader
