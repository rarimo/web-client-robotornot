import { Box, SxProps, useTheme } from '@mui/material'

const ContentWrapper = ({
  children,
  sx,
}: {
  children: JSX.Element | JSX.Element[]
  sx?: SxProps
} & JSX.IntrinsicAttributes) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: '1px solid var(--col-border-light)',
        borderRadius: theme.spacing(0.8),
        ...(sx ? sx : {}),
      }}
    >
      {children}
    </Box>
  )
}

export default ContentWrapper
