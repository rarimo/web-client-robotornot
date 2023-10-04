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
        {`Zero-Knowledge Proofs (ZKPs) have been a theoretical concept in cryptography since the 1980s. However, their widespread practical use and adoption in identity systems have predominantly emerged in the 2020s. In a sense, you're part of a historic moment.`}
      </p>
    </div>
  )
}

export default SidebarContent
