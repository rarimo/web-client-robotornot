import { Button, ButtonProps } from '@mui/material'
import { forwardRef } from 'react'

import { ForwardRef } from '@/types'

type IButtonProps = ButtonProps

const TextButton = (
  { children, sx = {}, ...rest }: IButtonProps,
  ref: ForwardRef<HTMLButtonElement>,
) => {
  return (
    <Button
      {...rest}
      variant='text'
      sx={{
        fontSize: 14,
        p: 1,
        ...sx,
      }}
      ref={ref}
    >
      {children}
    </Button>
  )
}

export default forwardRef(TextButton)
