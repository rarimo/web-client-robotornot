import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const ProofSubmittingLoader: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['proof-submitting-loader', className].join(' ')} {...rest}>
      {`ProofSubmittingLoader`}
    </div>
  )
}

export default ProofSubmittingLoader
