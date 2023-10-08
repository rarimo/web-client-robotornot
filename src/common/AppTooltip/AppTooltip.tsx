import './styles.scss'

import { FC, HTMLAttributes, ReactElement, useMemo } from 'react'
import { type ITooltip, Tooltip } from 'react-tooltip'
import { v4 as uuidv4 } from 'uuid'

type Props = ITooltip &
  HTMLAttributes<HTMLDivElement> & {
    msgContent: string | ReactElement
  }

const AppTooltip: FC<Props> = ({
  msgContent,
  className,
  children,
  style,
  ...rest
}) => {
  const uuid = useMemo(() => uuidv4(), [])

  return (
    <>
      <div
        className={['app-tooltip', className].join(' ')}
        data-tooltip-id={uuid}
        {...rest}
      >
        {children}
      </div>

      <Tooltip id={uuid} style={style}>
        {msgContent}
      </Tooltip>
    </>
  )
}

export default AppTooltip
