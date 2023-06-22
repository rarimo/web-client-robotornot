import { Box, CardContent, Grid, Skeleton, Typography } from '@mui/material'

const style = {
  card: {
    borderBottom: '1px solid var(--col-border-light)',
  },
}
interface IProps {
  isLoading?: boolean
  head?: JSX.Element
  footer?: JSX.Element
  subfooter?: JSX.Element
  subhead?: JSX.Element
  icon?: JSX.Element
}

const RowComponent = ({
  head,
  subfooter,
  footer,
  subhead,
  icon,
  isLoading,
}: IProps) => {
  return (
    <CardContent sx={style.card}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          {icon}
        </Grid>
        <Grid
          item
          xs={5}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-around'}
        >
          <Box overflow={'hidden'} textOverflow={'ellipsis'}>
            {isLoading ? <Skeleton /> : head}
          </Box>
          <Box>
            <Typography component={'span'} fontSize='12px'>
              {isLoading ? <Skeleton /> : footer}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={5}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-around'}
        >
          <Box overflow={'hidden'} textOverflow={'ellipsis'}>
            <Typography
              fontSize='0.75rem'
              component={'span'}
              whiteSpace={'nowrap'}
            >
              {isLoading ? <Skeleton /> : subhead}
            </Typography>
          </Box>
          <Box overflow={'hidden'} textOverflow={'ellipsis'}>
            {isLoading ? <Skeleton /> : subfooter}
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default RowComponent
