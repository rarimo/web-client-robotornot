import { CircularProgress, Grid } from '@mui/material'

const Loader = () => {
  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      justifyContent='center'
      style={{ flex: '1' }}
    >
      <CircularProgress />
    </Grid>
  )
}

export default Loader
