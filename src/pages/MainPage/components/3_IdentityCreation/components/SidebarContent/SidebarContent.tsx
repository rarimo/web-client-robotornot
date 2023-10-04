import { FC, HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const SidebarContent: FC<Props> = ({ className, ...rest }) => {
  return (
    <div
      className={[
        'sidebar-content',
        'app__step-sidebar-content',
        className,
      ].join(' ')}
      {...rest}
    >
      <div className='app__step-sidebar-content-img-wrp'>
        <img
          className='app__step-sidebar-content-img'
          src='/images/box-game.png'
          alt='sidebar-content'
        />
      </div>

      <p className='app__step-sidebar-content-text'>
        {`Create your profile is just one click and generates a unique identifier within the MetaMask Snap!`}
      </p>
    </div>
  )
}

export default SidebarContent
