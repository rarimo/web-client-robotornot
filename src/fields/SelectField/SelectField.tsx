import './styles.scss'

import { useSelect } from 'downshift'
import {
  cloneElement,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useClickAway } from 'react-use'
import { v4 as uuidv4 } from 'uuid'

import { Collapse, Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

interface Props<T> extends HTMLAttributes<HTMLSelectElement> {
  scheme?: 'primary'
  valueOptions: T[]
  value: T
  updateValue: (value: T) => void
  label?: string
  placeholder?: string
  errorMessage?: string
  note?: string
  isDisabled?: string | boolean
  isReadonly?: string | boolean
  tabindex?: number
  children?: ReactElement<HTMLAttributes<HTMLElement>>[]
  headerNode?: ReactNode
}

function SelectField<T>({
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
  children,
  headerNode,
}: Props<T>) {
  const uid = uuidv4()

  const selectElement = useRef<HTMLDivElement>(null)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const {
    getLabelProps,
    getToggleButtonProps,
    getMenuProps,
    closeMenu,
    getItemProps,
  } = useSelect<T>({
    items: valueOptions,
    selectedItem: value,
    onSelectedItemChange: ({ selectedItem }) => {
      updateValue(selectedItem as T)
      closeMenu()
    },
  })

  const isLabelActive = useMemo(
    () => isDropdownOpen || !!value,
    [isDropdownOpen, value],
  )

  const selectFieldClasses = useMemo(
    () =>
      [
        'select-field',
        `select-field--${scheme}`,
        ...(className ? [className] : []),
        ...(errorMessage ? ['select-field--error'] : []),
        ...(isDropdownOpen ? ['select-field--open'] : []),
        ...(isDisabled ? ['select-field--disabled'] : []),
        ...(isReadonly ? ['select-field--readonly'] : []),
        ...(isLabelActive ? ['select-field--label-active'] : []),
      ].join(' '),
    [
      className,
      errorMessage,
      isDisabled,
      isDropdownOpen,
      isLabelActive,
      isReadonly,
      scheme,
    ],
  )

  useClickAway(selectElement, () => {
    setIsDropdownOpen(false)
  })

  const openDropdown = useCallback(() => {
    if (isDisabled || isReadonly) return

    setIsDropdownOpen(true)
  }, [isDisabled, isReadonly])

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  const toggleDropdown = useCallback(() => {
    isDropdownOpen ? closeDropdown() : openDropdown()
  }, [closeDropdown, isDropdownOpen, openDropdown])

  const select = useCallback(
    (value: T) => {
      if (isDisabled || isReadonly) return

      updateValue(value as T)
      closeDropdown()
    },
    [closeDropdown, isDisabled, isReadonly, updateValue],
  )

  useEffect(() => {
    closeDropdown()
  }, [closeDropdown, value])

  return (
    <div className={selectFieldClasses}>
      <div ref={selectElement} className='select-field__select-wrp'>
        <div className='select-field__select-head-wrp'>
          <button
            type='button'
            className='select-field__select-head'
            aria-label={'toggle menu'}
            tabIndex={isDisabled || isReadonly ? -1 : tabindex}
            {...getToggleButtonProps()}
            onClick={toggleDropdown}
          >
            {!label && !!placeholder && !value ? (
              <span className='select-field__placeholder'>{placeholder}</span>
            ) : headerNode ? (
              headerNode
            ) : value ? (
              value
            ) : (
              <></>
            )}
            <Icon
              className={[
                'select-field__select-head-indicator',
                ...(isDropdownOpen
                  ? ['select-field__select-head-indicator--open']
                  : []),
              ].join(' ')}
              name={ICON_NAMES.chevronDown}
            />
          </button>

          {label && (
            <label
              className='select-field__label'
              {...getLabelProps()}
              htmlFor={`select-field--${uid}`}
            >
              {label}
            </label>
          )}
        </div>

        <div className='select-field__select-dropdown-wrp' {...getMenuProps()}>
          <Collapse
            isOpen={isDropdownOpen}
            className='select-field__select-dropdown'
          >
            {children
              ? children.map((el, idx) => {
                  const newProps = {
                    ...el.props,
                    key: idx,
                    ...getItemProps({
                      key: idx,
                      index: idx,
                      item: valueOptions[idx],
                      onClick: () => {
                        select(valueOptions[idx])
                      },
                    }),
                  }

                  return el ? cloneElement(el, newProps) : <></>
                })
              : valueOptions.map((el, idx) => (
                  <button
                    type='button'
                    className={[
                      'select-field__select-dropdown-item',
                      ...(value === el
                        ? ['select-field__select-dropdown-item--active']
                        : []),
                    ].join(' ')}
                    key={idx}
                    onClick={() => select(el)}
                  >
                    {String(el)}
                  </button>
                ))}
          </Collapse>
        </div>
      </div>

      <Collapse isOpen={!!errorMessage || !!note}>
        {errorMessage ? (
          <span className='select-field__err-msg'>{errorMessage}</span>
        ) : note ? (
          <span className='select-field__note'>{note}</span>
        ) : (
          <></>
        )}
      </Collapse>
    </div>
  )
}

export default SelectField
