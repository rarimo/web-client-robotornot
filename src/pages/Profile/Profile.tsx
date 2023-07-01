import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const Profile: FC<Props> = () => {
  return (
    <div className='profile'>
      <div className='profile__header'>
        <div className='profile__header-icon-wrp'>
          <Icon className='profile__header-icon' name={ICON_NAMES.user} />
        </div>
        <h2 className='profile__header-title'>
          {abbrCenter('#8211374652873645sb2914')}
        </h2>
        <span className='profile__header-subtitle'>
          {`Show your private key`}
        </span>
      </div>

      <div className='profile__card'>
        <span className='profile__card-title'>
          {`Preserve or Utilize These Keys for Profile Restoration or Cross-Device use`}
        </span>

        <div className='profile__copy-field-wrp'>
          <div className='profile__copy-field'>
            {abbrCenter('66eus7EDFSFV3djAp9otX75w284vs8SODot27XHn21', 10)}
            <AppButton
              className='profile__copy-field-btn'
              modification='none'
              iconLeft={ICON_NAMES.download}
              onClick={() => copyToClipboard('')}
              text={`EXPORT`}
              size='small'
            />
          </div>
        </div>
      </div>

      <div className='profile__tip'>
        {`Would you like to restore some other account? `}
        <span className='profile__tip-link'>{`Import Key`}</span>
      </div>
    </div>
  )
}

export default Profile
