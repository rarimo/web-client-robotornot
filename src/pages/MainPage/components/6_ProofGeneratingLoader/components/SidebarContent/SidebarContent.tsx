import { motion } from 'framer-motion'
import { FC, useState } from 'react'

import { AppButton, WordsScrambleGame } from '@/common'
import { SidebarProps } from '@/pages/MainPage/components/types'

const words = [
  'bitcoin',
  'luna',
  'rarimo',
  'moon',
  'polygon',
  'mumbai',
  'ether',
]
const rows = 9
const cols = 7

const SidebarContent: FC<SidebarProps> = ({ className, ...rest }) => {
  const [isShowGame, setIsShowGame] = useState(false)

  return (
    <motion.div
      className={[
        'sidebar-content',
        'app__step-sidebar-content',
        className,
      ].join(' ')}
      {...rest}
    >
      <WordsScrambleGame
        words={words}
        rows={rows}
        cols={cols}
        isShown={isShowGame}
        setIsShown={setIsShowGame}
      />
      <div className='app__step-sidebar-content-img-wrp'>
        <img
          className='app__step-sidebar-content-img'
          src='/images/box-game.png'
          alt='sidebar-content'
        />
      </div>

      <p className='app__step-sidebar-content-text'>
        {`Generating a Zero-Knowledge Proof (ZKP) can be time-consuming due to complex mathematical operations for ensuring privacy. But you know what they say: "Good proofs come to those who wait!" And given the unparalleled privacy offer, it's like waiting for a fine wine to age - totally worth it!`}
      </p>

      <div className='app__step-sidebar-content-actions'>
        <AppButton
          className='app__step-sidebar-content-actions-btn'
          text={`Play Game`}
          modification='border-circle'
          size='small'
          onClick={() => {
            setIsShowGame(prevState => !prevState)
          }}
        />
      </div>
    </motion.div>
  )
}

export default SidebarContent
