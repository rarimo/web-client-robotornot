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
        {`Since this app is built on the Rarimo protocol, a cross-chain identity layer, This means you don't have to manually handle proofs for different chains. dApps can easily verify your credentials across blockchains, sparing you from additional fees and unnecessary steps.`}
      </p>

      <p className='app__step-sidebar-content-text'>
        {`Learn more about`}{' '}
        <a className='app__text-link' href='https://google.com'>
          {`Rarimo`}
        </a>
      </p>
    </div>
  )
}

export default SidebarContent
