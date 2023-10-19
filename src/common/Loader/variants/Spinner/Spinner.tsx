import './styles.scss'

import { FC, HTMLAttributes } from 'react'

const Spinner: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return <div className={['spinner', className].join(' ')} {...rest} />
}

export default Spinner
