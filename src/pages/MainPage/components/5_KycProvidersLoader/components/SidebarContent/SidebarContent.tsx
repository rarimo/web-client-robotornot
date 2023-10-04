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
        {`Identity credential is a piece of evidence or an attestation that verifies the identity or attributes of you.`}
      </p>
      <p className='app__step-sidebar-content-text'>
        {`The credential is encrypted within the MetaMask Snap (RariMe) wallet and only you the owner have the ability to unlock and access them.`}
      </p>
      <p className='app__step-sidebar-content-text'>
        {`Do you know the most significant innovation here? Once you're verified as a human, you can use this credential universally across various blockchain dApps and channels. This means you won't need to re-authorize or provide any additional information repeatedly.`}
      </p>
    </div>
  )
}

export default SidebarContent
