import './styles.scss'

import { FC, HTMLAttributes } from 'react'

const Spinner: FC<HTMLAttributes<HTMLDivElement>> = ({ ...rest }) => {
  return <div className='spinner' {...rest} />
}

export default Spinner
