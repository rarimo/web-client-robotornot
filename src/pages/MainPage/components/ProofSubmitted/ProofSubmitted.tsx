import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

import { AppButton } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement>

const ProofSubmitted: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['proof-submitted', className].join(' ')} {...rest}>
      <AppButton
        iconLeft={ICON_NAMES.metamask}
        text={`Submit Proof`}
        modification='border-circle'
      />
    </div>
  )
}

export default ProofSubmitted
