import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, Icon } from '@/common'
import { useKycContext } from '@/contexts'
import { ICON_NAMES } from '@/enums'
import { abbrCenter, copyToClipboard } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement>

const AuthSuccess: FC<Props> = () => {
  const { selectedKycDetails } = useKycContext()

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
          {selectedKycDetails?.map(([label, value], idx) => (
            <div className='auth-success__metadata-item' key={idx}>
              <span className='auth-success__metadata-item-label'>{label}</span>
              <span className='auth-success__metadata-item-value'>{value}</span>
            </div>
          ))}
        </div>

        <div className='auth-success__card-divider' />

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
