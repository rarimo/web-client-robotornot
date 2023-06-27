import './styles.scss'

import { FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProviders: FC<Props> = () => {
  return <div className='auth-providers'></div>
}

export default AuthProviders
