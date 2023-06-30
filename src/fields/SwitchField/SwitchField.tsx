import './styles.scss'

import {
  ChangeEvent,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
} from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  name?: string
  value: boolean
  updateValue: Dispatch<SetStateAction<boolean>>
  model?: string | number
  label?: string
  tabindex?: number
  isReadonly?: boolean
  isDisabled?: boolean
}

const SwitchField: FC<Props> = ({
  name,
  value,
  updateValue,
  model,
  label,
  tabindex,
  isReadonly,
  isDisabled,
}) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement

    updateValue(target.checked)
  }

  return (
    <label
      className={[
        'switch-field',
        ...(isDisabled || isReadonly ? ['switch-field--disabled'] : []),
        ...(value ? ['switch-field--checked'] : []),
      ].join(' ')}
    >
      <input
        className='switch-field__input'
        type='checkbox'
        tabIndex={isDisabled || isReadonly ? -1 : (tabindex as number)}
        checked={value}
        name={name}
        value={model}
        disabled={isDisabled || isReadonly}
        onChange={onChange}
      />

      <span className='switch-field__frame-wrp' aria-hidden='true'>
        <span
          className={[
            'switch-field__frame',
            ...(value ? ['switch-field__frame--checked'] : []),
          ].join(' ')}
        />
      </span>

      {label ? <span className='switch-field__label'>{label}</span> : <></>}
    </label>
  )
}

export default SwitchField
