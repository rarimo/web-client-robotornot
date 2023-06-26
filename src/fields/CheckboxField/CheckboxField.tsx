import './styles.scss'

import {
  ChangeEvent,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
} from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

interface Props extends HTMLAttributes<HTMLInputElement> {
  name?: string
  model?: string | number
  value: boolean
  updateValue: Dispatch<SetStateAction<boolean>>
  label?: string
  isDisabled?: boolean
  isReadonly?: boolean
  tabindex?: number
}

const CheckboxField: FC<Props> = ({
  name,
  model,
  value,
  updateValue,
  label,
  tabindex,
  isDisabled,
  isReadonly,
  className = '',
}) => {
  const checkboxClasses = [
    'checkbox-field',
    ...(className ? [className] : []),
    ...[
      ...(isDisabled ? ['checkbox-field--disabled'] : []),
      ...(isReadonly ? ['checkbox-field--readonly'] : []),
      ...(value ? ['checkbox-field--checked'] : []),
    ],
  ].join(' ')

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement

    updateValue(target.checked)
  }

  return (
    <label className={checkboxClasses}>
      <input
        className='checkbox-field__input'
        type='checkbox'
        checked={value}
        name={name}
        value={model}
        tabIndex={isDisabled || isReadonly ? -1 : (tabindex as number)}
        disabled={isDisabled}
        onChange={onChange}
      />

      <span className='checkbox-field__frame-wrp' aria-hidden='true'>
        <span
          className={[
            'checkbox-field__frame',
            ...(value ? ['checkbox-field__frame--checked'] : []),
          ].join(' ')}
        >
          {value ? (
            <Icon
              className='checkbox-field__frame-icon'
              name={ICON_NAMES.check}
            />
          ) : (
            <></>
          )}
        </span>
      </span>

      {label ? <span className='checkbox-field__label'>{label}</span> : <></>}
    </label>
  )
}

export default CheckboxField
