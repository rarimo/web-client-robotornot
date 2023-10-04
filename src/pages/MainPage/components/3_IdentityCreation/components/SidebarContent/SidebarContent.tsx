import { FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const SidebarContent: FC<Props> = ({ className, ...rest }) => {
  return (
    <div
      className={['sidebar-content', className].join(' ')}
      {...rest}
    >{`Identity creation sidebar content`}</div>
  )
}

export default SidebarContent
