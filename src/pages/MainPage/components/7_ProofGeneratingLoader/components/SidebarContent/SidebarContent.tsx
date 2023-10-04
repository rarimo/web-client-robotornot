import { FC, HTMLAttributes } from 'react'

import { AppButton } from '@/common'

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

      <p className='app__step-sidebar-content-text'>
        {`Generating a Zero-Knowledge Proof (ZKP) can be time-consuming due to complex mathematical operations for ensuring privacy. But you know what they say: "Good proofs come to those who wait!" And given the unparalleled privacy offer, it's like waiting for a fine wine to age - totally worth it!`}
      </p>

      <div className='app__step-sidebar-content-actions'>
        <AppButton
          className='app__step-sidebar-content-actions-btn'
          text={`Play Game`}
          modification='border-circle'
          size='small'
        />
      </div>
    </div>
  )
}

export default SidebarContent
