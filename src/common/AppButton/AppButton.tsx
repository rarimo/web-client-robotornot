import './styles.scss'

import { AnchorHTMLAttributes, HTMLAttributes, useMemo } from 'react'
import { LinkProps, NavLink } from 'react-router-dom'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props<R extends string, H extends string> = {
  text?: string
  scheme?: 'filled' | 'flat' | 'none'
  modification?: 'border-circle' | 'border-rounded' | 'none'
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'none'
  size?: 'large' | 'medium' | 'small' | 'x-small' | 'none'
  href?: H
  routePath?: R
  iconLeft?: ICON_NAMES
  iconRight?: ICON_NAMES
  isDisabled?: boolean
} & (R extends string
  ? Omit<LinkProps, 'to'>
  : H extends string
  ? AnchorHTMLAttributes<HTMLAnchorElement>
  : HTMLAttributes<HTMLButtonElement>)

const AppButton = <R extends string, H extends string>({
  text,
  scheme = 'filled',
  modification = 'border-rounded',
  color = 'primary',
  size = 'medium',
  href,
  routePath,
  iconLeft,
  iconRight,
  isDisabled = false,
  children,
  className = '',
  ...rest
}: Props<R, H>) => {
  const buttonClasses = useMemo(
    () =>
      [
        'app-button',
        `app-button--scheme-${scheme}`,
        `app-button--${modification}`,
        `app-button--${color}`,
        `app-button--${size}`,
        ...(isDisabled ? ['app-button--disabled'] : []),
        ...(className ? [className] : []),
        ...((iconLeft || iconRight) && !text && !children
          ? ['app-button--icon-only']
          : []),
      ].join(' '),
    [
      children,
      className,
      color,
      iconLeft,
      iconRight,
      isDisabled,
      modification,
      scheme,
      size,
      text,
    ],
  )

  const buttonContent = useMemo(
    () => (
      <>
        {iconLeft ? (
          <Icon className='app-button__icon-left' name={iconLeft} />
        ) : (
          <></>
        )}
        {children || text ? (
          <span className='app-button__text'>{text}</span>
        ) : (
          <></>
        )}
        {iconRight ? (
          <Icon className='app-button__icon-right' name={iconRight} />
        ) : (
          <></>
        )}
      </>
    ),
    [children, iconLeft, iconRight, text],
  )

  if (routePath) {
    return (
      <NavLink
        className={buttonClasses}
        to={routePath}
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {buttonContent}
      </NavLink>
    )
  } else if (href) {
    return (
      <a
        className={buttonClasses}
        href={href}
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {buttonContent}
      </a>
    )
  }

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {buttonContent}
    </button>
  )
}

export default AppButton
