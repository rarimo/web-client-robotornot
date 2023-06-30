import './styles.scss'

import { FC, HTMLAttributes } from 'react'

import { AppButton, Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { BasicSelectField } from '@/fields'

type Props = HTMLAttributes<HTMLDivElement>

const AuthConfirmation: FC<Props> = () => {
  return (
    <div className='auth-confirmation'>
      <div className='auth-confirmation__header'>
        <div className='auth-confirmation__header-icon-wrp'>
          <Icon
            className='auth-confirmation__header-icon'
            name={ICON_NAMES.check}
          />
        </div>
        <h2 className='auth-confirmation__header-title'>{`Proof Generated`}</h2>
        <span className='auth-confirmation__header-subtitle'>
          {`Proof is generated using Zero-Knowledge Proof (ZKP) and none of the personal info is shared with any party`}
        </span>
      </div>

      <div className='auth-confirmation__card'>
        <div className='auth-confirmation__card-header'>
          <h5 className='auth-confirmation__card-title'>
            {`Make it available on any chain`}
          </h5>
          <span className='auth-confirmation__card-subtitle'>
            {`Your proof has been published on Polygon as default`}
          </span>
        </div>

        <div className='auth-confirmation__chains'>
          <div className='auth-confirmation__chain-item'>
            <Icon
              className='auth-confirmation__chain-item-icon'
              name={ICON_NAMES.metamask}
            />
            <span className='auth-confirmation__chain-item-name'>
              {`Polygon chain`}
            </span>
          </div>

          {Array(2)
            .fill(0)
            .map((el, idx) => (
              <div
                key={idx}
                className='auth-confirmation__chain-item auth-confirmation__chain-item--select-wrp'
              >
                <BasicSelectField
                  label={`Select chain`}
                  value={el}
                  updateValue={() => {
                    //
                  }}
                  valueOptions={[
                    {
                      title: 'Polygon chain',
                      value: '1',
                      iconName: ICON_NAMES.xCircle,
                    },
                  ]}
                />

                <AppButton
                  className='auth-confirmation__chain-item-remove-btn'
                  scheme='none'
                  color='error'
                  size='none'
                  iconLeft={ICON_NAMES.trash}
                />
              </div>
            ))}

          <AppButton
            className='auth-confirmation__chain-add-btn'
            scheme='none'
            text={`Add other chain`}
            iconLeft={ICON_NAMES.plus}
          />
        </div>

        <div className='auth-confirmation__divider' />

        <AppButton
          className='auth-confirmation__submit-btn'
          text={`SUBMIT PROOF`}
          iconRight={ICON_NAMES.arrowRight}
          size='large'
        />
      </div>
    </div>
  )
}

export default AuthConfirmation
