import { Paper, Stack, SxProps, useTheme } from '@mui/material'

const ContentBox = ({
  children,
  sx,
}: {
  children: JSX.Element | JSX.Element[]
  sx?: SxProps
} & JSX.IntrinsicAttributes) => {
  const theme = useTheme()

  return (
    <Stack
      component={Paper}
      spacing={theme.spacing(3)}
      padding={theme.spacing(2)}
      sx={{
        maxWidth: 'var(--ui-max-width)',
        boxShadow: 'var(--ui-box-shadow)',
        borderRadius: 'var(--ui-content-border-radius)',
        ...(sx ? sx : {}),
      }}
    >
      {children}
    </Stack>
  )
}

export default ContentBox
