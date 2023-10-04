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
        {`RariMe Snap allows users to store and manage identity credentials through MetaMask wallet`}
      </p>
      <p className='app__step-sidebar-content-text'>
        {`You can utilize the RariMe Identity Snap to seamlessly integrate any identity credential and use them across various blockchains without any additional effort.`}
      </p>
      <p className='app__step-sidebar-content-text'>
        {`Is not that cool? Same wallet for managing your Crypto and identity`}
      </p>
    </div>
  )
}

export default SidebarContent
