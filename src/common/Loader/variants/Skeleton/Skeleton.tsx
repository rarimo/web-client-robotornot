import './styles.scss'

import { FC, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  scheme?: 'thin' | 'medium' | 'circle'
}

const Skeleton: FC<Props> = ({ scheme, ...rest }) => {
  return (
    <div className={['skeleton', `skeleton--${scheme}`].join(' ')} {...rest} />
  )
}

export default Skeleton
