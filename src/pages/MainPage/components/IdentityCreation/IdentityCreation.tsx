import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const IdentityCreation: FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={['identity-creation', className].join(' ')} {...rest}></div>
  )
}

export default IdentityCreation
