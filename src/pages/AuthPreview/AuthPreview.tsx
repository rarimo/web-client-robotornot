import './styles.scss'

import { FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const AuthPreview: FC<Props> = ({ ...rest }) => {
  return <div className='auth-preview'></div>
}

export default AuthPreview
