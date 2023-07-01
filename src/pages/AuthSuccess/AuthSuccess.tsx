import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthSuccess: FC<Props> = ({ ...rest }) => {
  return (
    <div className='auth-success'>
      <div className='auth-success__header'>
        <div className='auth-success__header-icon-wrp'>
          <Icon className='auth-success__header-icon' name={ICON_NAMES.check} />
        </div>
        <h2 className='auth-success__header-title'>{`Proof Submited`}</h2>
      </div>

      <div className='auth-success__card'>
        <div className='auth-success__metadata'>
          <div className='auth-success__metadata-item'>
            <span className='auth-success__metadata-item-label'>
              {`Proof human verification`}
            </span>
            <div className='auth-success__metadata-item-value'>
              {`Maren Philips`}
            </div>
          </div>
          <div className='auth-success__metadata-item'>
            <span className='auth-success__metadata-item-label'>
              {`Chains available`}
            </span>
            <div className='auth-success__metadata-item-value'>
              {`MarenPhilips.nft`}
            </div>
          </div>
          <div className='auth-success__metadata-item'>
            <span className='auth-success__metadata-item-label'>
              {`Provider`}
            </span>
            <div className='auth-success__metadata-item-value'>
              <Icon
                className='auth-success__metadata-item-value-icon'
                name={ICON_NAMES.metamask}
              />
              {`Polygon`}
            </div>
          </div>
          <div className='auth-success__metadata-item'>
            <span className='auth-success__metadata-item-label'>
              {`Expiration time`}
            </span>
            <div className='auth-success__metadata-item-value'>
              {`Maren Philips`}
            </div>
          </div>
        </div>

        <div className='auth-success__card-divider' />

        <span className='auth-success__card-title'>{`Share manually`}</span>

        <div className='auth-success__copy-field'>
          {abbrCenter('66eus7EDFSFV3djAp9otX75w284vs8SODot27XHn21', 10)}
          <AppButton
            scheme='none'
            modification='none'
            size='none'
            iconLeft={ICON_NAMES.duplicate}
            onClick={() => copyToClipboard('')}
          />
        </div>
      </div>

      <div className='auth-success__tip'>
        {`Automatically redirected in `}
        <span className='auth-success__tip-link'>{`(10sec)`}</span>
      </div>
    </div>
  )
}

export default AuthSuccess
