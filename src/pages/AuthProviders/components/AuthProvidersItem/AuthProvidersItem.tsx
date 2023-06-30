import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement>

const AuthProvidersItem: FC<Props> = () => {
  return (
    <div className='auth-providers-item'>
      <Icon
        className='auth-providers-item__icon'
        name={ICON_NAMES.providerCivic}
      />
      <h5 className='auth-providers-item__name'>{`Wordlcoin.org`}</h5>
      <Icon
        className='auth-providers-item__icon auth-providers-item__icon--decor'
        name={ICON_NAMES.arrowRight}
      />

      <button
        className='auth-providers-item__button'
        onClick={() => alert('hello world')}
      />
    </div>
  )
}

export default AuthProvidersItem
