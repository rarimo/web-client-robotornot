import './styles.scss'

import { type FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const MainPage: FC<Props> = ({ className, ...rest }) => {
  // TODO: add big initialization method, which is checks connected wallet status

  // TODO: add steps indicator
  return (
    <div className={['main-page', className].join(' ')} {...rest}>
      <div className='main-page__content'></div>
      <div className='main-page__extra'></div>
    </div>
  )
}

export default MainPage
