import { Box, Paper, Stack, useTheme } from '@mui/material'

interface DashboardStatisticRowProps {
  header: {
    icon: JSX.Element
    body: JSX.Element
    title: JSX.Element
  }
  footer: {
    icon: JSX.Element
    body: JSX.Element
    title: JSX.Element
  }
  marginLeft?: string
}

const DashboardStatisticRow = ({
  header,
  footer,
}: DashboardStatisticRowProps) => {
  const theme = useTheme()

  return (
    <Stack
      padding={theme.spacing(2)}
      spacing={theme.spacing(2)}
      component={Paper}
      direction={'column'}
      flex={'1 1 auto'}
      boxShadow={'var(--ui-box-shadow)'}
      borderRadius={'var(--ui-content-border-radius)'}
      maxWidth={'50%'}
    >
      <Stack
        direction={'row'}
        alignItems={'center'}
        paddingBottom={theme.spacing(2)}
        borderBottom={'1px solid var(--col-border-light)'}
      >
        <Box marginRight={theme.spacing(1.5)}>{header.icon}</Box>
        <Stack
          direction={'column'}
          alignItems={'flex-start'}
          minWidth={0}
          flex={1}
        >
          <Box paddingBottom={theme.spacing(1)}>{header.title}</Box>
          <Box width={'100%'}>{header.body}</Box>
        </Stack>
      </Stack>
      <Stack direction={'row'} alignItems={'center'}>
        <Box marginRight={theme.spacing(1.5)}> {footer.icon}</Box>
        <Stack
          direction={'column'}
          alignItems={'flex-start'}
          minWidth={0}
          flex={1}
        >
          <Box paddingBottom={theme.spacing(1)}>{footer.title}</Box>
          <Box width={'100%'}>{footer.body}</Box>
        </Stack>
      </Stack>
    </Stack>
  )
}
export default DashboardStatisticRow
