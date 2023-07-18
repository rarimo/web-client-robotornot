import './styles.scss'

import Lottie from 'lottie-react'
import { FC, HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  source: unknown
}

const Animation: FC<Props> = ({ source }) => {
  return <Lottie animationData={source} loop={true} />
}

export default Animation
