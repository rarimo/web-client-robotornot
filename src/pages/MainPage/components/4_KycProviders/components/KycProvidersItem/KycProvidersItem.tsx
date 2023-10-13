import './styles.scss'

import { FC, HTMLAttributes, ReactElement } from 'react'

import { AppTooltip, Icon } from '@/common'
import { ICON_NAMES, SUPPORTED_KYC_PROVIDERS } from '@/enums'

interface Props extends HTMLAttributes<HTMLDivElement> {
  supportedKycProvider: SUPPORTED_KYC_PROVIDERS
  iconName: ICON_NAMES
  name: string

  handleLogin: (kycProvider: SUPPORTED_KYC_PROVIDERS) => void
  isDisabled?: boolean
  tooltipMsg?: string | ReactElement
}

const KycProvidersItem: FC<Props> = ({
  tooltipMsg,
  iconName,
  name,
  supportedKycProvider,
  handleLogin,
  isDisabled = false,
}) => {
  return (
    <div
      className={[
        'kyc-providers-item',
        ...(isDisabled ? ['kyc-providers-item--disabled'] : []),
      ].join(' ')}
    >
      <Icon className='kyc-providers-item__icon' name={iconName} />
      <h5 className='kyc-providers-item__name'>{name}</h5>

      {tooltipMsg && (
        <div className='kyc-providers-item__icon-wrp'>
          <AppTooltip
            className='kyc-providers-item__tooltip'
            msgContent={tooltipMsg}
          >
            <Icon
              className='kyc-providers-item__icon kyc-providers-item__icon--decor'
              name={ICON_NAMES.informationCircle}
            />
          </AppTooltip>
        </div>
      )}

      <button
        className='kyc-providers-item__button'
        onClick={() => handleLogin(supportedKycProvider)}
        disabled={isDisabled}
      />
    </div>
  )
}

export default KycProvidersItem
