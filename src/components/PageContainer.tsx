import { Stack, useTheme } from '@mui/material'

const PageContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const theme = useTheme()

  return (
    <Stack
      className='App__page'
      spacing={{
        xs: theme.spacing(4.5),
        xl: theme.spacing(6),
      }}
    >
      {children}
    </Stack>
  )
}

export default PageContainer
