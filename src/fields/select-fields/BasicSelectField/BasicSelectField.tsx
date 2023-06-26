import './styles.scss'

import { FC, HTMLAttributes, useMemo } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { SelectField } from '@/fields'

type ValueOption = {
  title: string
  value: string | number
  iconName: ICON_NAMES
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  scheme?: 'primary'
  valueOptions: ValueOption[]
  value: string | number
  updateValue: (value: string | number) => void
  label?: string
  placeholder?: string
  errorMessage?: string
  note?: string
  isDisabled?: string | boolean
  isReadonly?: string | boolean
  tabindex?: number
}

const BasicSelectField: FC<Props> = ({
  scheme = 'primary',
  valueOptions,
  value,
  updateValue,
  label,
  errorMessage,
  note,
  isDisabled,
  isReadonly,
  tabindex,
  className = '',
  placeholder = ' ',
}) => {
  const selectedOption = useMemo(() => {
    return valueOptions?.find(el => el.value === value)
  }, [value, valueOptions])

  return (
    <SelectField
      className={className}
      scheme={scheme}
      valueOptions={valueOptions.map(el => el.value)}
      value={value}
      updateValue={updateValue}
      label={label}
      errorMessage={errorMessage}
      note={note}
      isDisabled={isDisabled}
      isReadonly={isReadonly}
      tabindex={tabindex}
      placeholder={placeholder}
      headerNode={
        selectedOption ? (
          <div className='basic-select-field__header'>
            <Icon
              className='basic-select-field__header-icon'
              name={selectedOption.iconName}
            />
            <span className='basic-select-field__header-title'>
              {selectedOption.title}
            </span>
          </div>
        ) : undefined
      }
    >
      {valueOptions.map((option, idx) => (
        <button
          className={[
            'basic-select-field__option',
            ...(option.value === value
              ? ['basic-select-field__option--active']
              : []),
          ].join(' ')}
          key={idx}
          onClick={() => updateValue(option.value)}
        >
          <Icon
            className='basic-select-field__option-icon'
            name={option.iconName}
          />
          <span className='basic-select-field__option-title'>
            {option.title}
          </span>
        </button>
      ))}
    </SelectField>
  )
}

export default BasicSelectField
