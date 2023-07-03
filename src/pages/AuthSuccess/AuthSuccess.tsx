import './styles.scss'

import { FC, HTMLAttributes, useState } from 'react'

import { AppButton, Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthSuccess: FC<Props> = () => {
  const [isNftMinted] = useState(false)

  return (
    <div className='auth-success'>
      <div className='auth-success__header'>
        <div className='auth-success__header-icon-wrp'>
          <Icon className='auth-success__header-icon' name={ICON_NAMES.check} />
        </div>
        <h2 className='auth-success__header-title'>{`Proof Submitted`}</h2>
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
                name={ICON_NAMES.polygon}
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

        {isNftMinted ? (
          <>
            <div className='auth-success__minted-nft'>
              <span className='auth-success__minted-nft-title'>
                {`You’ve received an SBT / NFT `}
              </span>

              <div className='auth-success__minted-nft-card'>
                <div className='auth-success__minted-nft-card-img-wrp'>
                  <img
                    src='/images/minted-nft-stub.png'
                    alt=''
                    className='auth-success__minted-nft-card-img'
                  />
                </div>

                <div className='auth-success__minted-nft-card-details'>
                  <span className='auth-success__minted-nft-card-title'>
                    {`POH Early Adopter`}
                  </span>

                  <span className='auth-success__minted-nft-card-subtitle'>
                    {abbrCenter('0X989023123412347b41')}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className='auth-success__card-divider' />
        )}

        <span className='auth-success__card-title'>{`Share manually`}</span>

        <div className='auth-success__copy-field-wrp'>
          <div className='auth-success__copy-field'>
            {abbrCenter('66eus7EDFSFV3djAp9otX75w284vs8SODot27XHn21', 10)}
            <AppButton
              scheme='none'
              modification='none'
              size='none'
              iconLeft={ICON_NAMES.duplicate}
              onClick={() =>
                copyToClipboard('66eus7EDFSFV3djAp9otX75w284vs8SODot27XHn21')
              }
            />
          </div>
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
