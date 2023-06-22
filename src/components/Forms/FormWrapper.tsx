import { Backdrop, Box, CircularProgress, Stack, useTheme } from '@mui/material'
import { BaseSyntheticEvent } from 'react'

const FormWrapper = ({
  id,
  onSubmit,
  isFormDisabled,
  children,
}: {
  id: string
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  isFormDisabled: boolean
  children: JSX.Element | JSX.Element[]
}) => {
  const theme = useTheme()

  return (
    <Box
      id={id}
      component='form'
      noValidate
      autoComplete='off'
      width={'100%'}
      onSubmit={onSubmit}
    >
      <Backdrop
        sx={{
          color: theme.palette.info.main,
          zIndex: theme.zIndex.drawer + 1,
        }}
        open={isFormDisabled}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Stack spacing={4.5}>{children}</Stack>
    </Box>
  )
}

export default FormWrapper
