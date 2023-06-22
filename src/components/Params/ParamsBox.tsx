import { Skeleton, Stack, Typography, useTheme } from '@mui/material'

type ParamsBoxProps = {
  title: string | JSX.Element
  details: {
    label: string | number | JSX.Element
    detail: string | number | JSX.Element
  }[]
  isLoading: boolean
}
const ParamsBox = ({ title, details, isLoading }: ParamsBoxProps) => {
  const theme = useTheme()
  return (
    <Stack direction={'column'} padding={theme.spacing(1)}>
      <Typography variant={'h4'} paddingBottom={theme.spacing(1.5)}>
        {title}
      </Typography>
      {details.map((x, i) => {
        return (
          <div key={i}>
            <Stack
              justifyContent={'space-between'}
              direction={'row'}
              borderTop={'1px solid var(--col-border-light)'}
              padding={theme.spacing(1.5, 0)}
            >
              {isLoading ? (
                <Skeleton width={'100%'} />
              ) : (
                <Typography variant='body1'>{x.label}</Typography>
              )}
              {isLoading ? (
                <Skeleton width={'100%'} />
              ) : (
                <Typography variant='body1'>{x.detail}</Typography>
              )}
            </Stack>
          </div>
        )
      })}
    </Stack>
  )
}

export default ParamsBox
