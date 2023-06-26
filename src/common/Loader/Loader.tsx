import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { Spinner } from './variants'

enum SCHEMES {
  spinner = 'spinner',
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  scheme?: keyof typeof SCHEMES
}

const Loader: FC<Props> = ({ scheme, className = '', ...rest }) => {
  let variant

  switch (scheme) {
    default:
      variant = <Spinner />
  }

  return (
    <div className={`loader ${className}`} {...rest}>
      {variant}
    </div>
  )
}

export default Loader
