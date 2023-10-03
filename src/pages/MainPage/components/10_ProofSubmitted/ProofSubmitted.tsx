import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const ProofSubmitted: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['proof-submitted', className].join(' ')} {...rest}>
      {`SUCCESS`}
    </div>
  )
}

export default ProofSubmitted
