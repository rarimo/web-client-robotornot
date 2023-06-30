import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, CautionTip } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props = HTMLAttributes<HTMLDivElement>

const AuthPreview: FC<Props> = ({ ...rest }) => {
  return (
    <div className='auth-preview'>
      <div className='auth-preview__header'>
        <h2 className='auth-preview__header-title'>{`Proof of Human credentials`}</h2>
      </div>

      <div className='auth-preview__card'>
        <CautionTip
          className='auth-preview__card-caution-tip'
          message={`Proof is generated using Zero-Knowledge Proof (ZKP) using these credentials and is not shared with any party`}
        />
        <div className='auth-preview__metadata'>
          {Array(5)
            .fill(0)
            .map((el, idx) => (
              <div className='auth-preview__metadata-item' key={idx}>
                <span className='auth-preview__metadata-item-label'>{`Name`}</span>
                <span className='auth-preview__metadata-item-value'>{`Maren Philips`}</span>
              </div>
            ))}
        </div>
        <div className='auth-preview__card-divider' />
        <AppButton
          className='auth-preview__card-button'
          text={`GENERATE PROOF`}
          iconRight={ICON_NAMES.arrowRight}
          size='large'
        />
      </div>
    </div>
  )
}

export default AuthPreview
