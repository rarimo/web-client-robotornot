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
      <div className='app-tooltip' data-tooltip-id={uuid}>
        {children}
      </div>

      <Tooltip id={uuid} style={style} className={className} {...rest}>
        {msgContent}
      </Tooltip>
    </>
  )
}

export default AppTooltip
