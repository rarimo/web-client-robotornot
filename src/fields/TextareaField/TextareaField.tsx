import './styles.scss'

import {
  Dispatch,
  FC,
  FormEvent,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Collapse } from '@/common'

interface Props extends HTMLAttributes<HTMLDivElement> {
  scheme?: 'primary'
  value: string
  updateValue?: Dispatch<SetStateAction<string>>
  label?: string
  placeholder?: string
  errorMessage?: string
  note?: string
  tabindex?: number
  isDisabled?: boolean
  isReadonly?: boolean
}

const TextareaField: FC<Props> = ({
  scheme = 'primary',
  value,
  updateValue,
  label = '',
  placeholder = ' ',
  errorMessage = '',
  note = '',
  tabindex,
  isDisabled,
  isReadonly,
}) => {
  const uid = uuidv4()

  const textareaClasses = useMemo(
    () =>
      [
        'textarea-field',
        ...(isDisabled ? ['textarea-field--disabled'] : []),
        ...(isReadonly ? ['textarea-field--readonly'] : []),
        ...(errorMessage ? ['textarea-field--error'] : []),
        `textarea-field--${scheme}`,
      ].join(' '),
    [errorMessage, isDisabled, isReadonly, scheme],
  )

  const handleInput = useCallback(
    (e: FormEvent<HTMLTextAreaElement>) => {
      const eventTarget = e.target as HTMLTextAreaElement

      if (value === eventTarget.value) return

      updateValue?.(eventTarget.value)
    },
    [updateValue, value],
  )

  return (
    <>
      <div className={textareaClasses}>
        <div className='textarea-field__textarea-wrp'>
          <textarea
            className='textarea-field__textarea'
            id={`textarea-field--${uid}`}
            value={value}
            placeholder={!label ? placeholder : ' '}
            tabIndex={isDisabled || isReadonly ? -1 : (tabindex as number)}
            disabled={isDisabled || isReadonly}
            onInput={handleInput}
          />
          {label ? (
            <label
              htmlFor={`textarea-field--${uid}`}
              className='textarea-field__label'
            >
              {label}
            </label>
          ) : (
            <></>
          )}
        </div>
        <Collapse isOpen={!!errorMessage || !!note}>
          {errorMessage ? (
            <span className='textarea-field__err-msg'>{errorMessage}</span>
          ) : note ? (
            <span className='textarea-field__note'>{note}</span>
          ) : (
            <></>
          )}
        </Collapse>
      </div>
    </>
  )
}

export default TextareaField
