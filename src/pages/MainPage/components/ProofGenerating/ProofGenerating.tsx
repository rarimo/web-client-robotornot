import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

import { AppButton } from '@/common'

type Props = HTMLAttributes<HTMLDivElement>

const ProofGenerating: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['proof-generating', className].join(' ')} {...rest}>
      <AppButton text={`Generate proof`} modification='border-circle' />
    </div>
  )
}

export default ProofGenerating
