import { Box, useTheme } from '@mui/material'
import { ElementType } from 'react'
import { NavLink } from 'react-router-dom'

import LogoSVG from '@/assets/logo.svg'
import { RoutePaths } from '@/enums'
// eslint-disable-next-line @typescript-eslint/no-empty-function
const Logo = ({ onClick = () => {} }: { onClick?: () => void }) => {
  const theme = useTheme()

  return (
    <Box
      component={NavLink}
      to={RoutePaths.Dashboard}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: theme.spacing(-1),
      }}
      onClick={onClick}
    >
      <Box
        component={LogoSVG as ElementType}
        height={42}
        width={140}
        color={theme.palette.text.primary}
      />
    </Box>
  )
}

export default Logo
