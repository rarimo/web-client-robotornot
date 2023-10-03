import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const ProofGeneratingLoader: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['proof-generating-loader', className].join(' ')} {...rest}>
      {`proof-generating-loader`}
    </div>
  )
}

export default ProofGeneratingLoader
