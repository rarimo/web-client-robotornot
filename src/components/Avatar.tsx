import { Box } from '@mui/material'
import * as jdenticon from 'jdenticon'
import { useEffect, useRef, useState } from 'react'

type AvatarProps = {
  address: string
  imageUrl?: string
  imageSize?: number | string
}

const getSx = (imageSize?: number | string) => ({
  width: imageSize || '28px',
  height: imageSize || '28px',
  minWidth: imageSize || '28px',
  minHeight: imageSize || '28px',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
  },
})

const Avatar = ({ imageUrl, address, imageSize }: AvatarProps) => {
  const icon = useRef(null)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (icon?.current) jdenticon.update(icon.current, address)
  }, [address, error, imageUrl])

  useEffect(() => {
    setError(false)
  }, [address])

  const handleError = () => {
    setError(true)
  }

  const sx = getSx(imageSize)

  return imageUrl ? (
    <Box component={'img'} onError={handleError} sx={sx} src={imageUrl} />
  ) : (
    <Box
      component={'svg'}
      data-jdenticon-value={address}
      height='100%'
      ref={icon}
      sx={sx}
      width='100%'
    />
  )
}

export default Avatar
