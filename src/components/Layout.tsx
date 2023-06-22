import { Box, Stack, useTheme } from '@mui/material'
import { useState } from 'react'

import { Header, Navbar } from '@/components'

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const [isMobileNavbarOpened, setIsMobileNavbarOpened] = useState(false)
  const theme = useTheme()

  const toggleMobileNavbar = () => {
    setIsMobileNavbarOpened(!isMobileNavbarOpened)
  }

  const topPadding = `calc(var(--ui-appbar-height) + ${theme.spacing(4.5)})`

  const layoutMixin = {
    spacing: {
      xs: theme.spacing(4.5),
      xl: theme.spacing(6),
    },
    sx: {
      width: '100%',
      maxWidth: 'var(--ui-max-width)',
      margin: theme.spacing(0, 'auto'),
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      padding: {
        xs: theme.spacing(topPadding, 2.5, 2.5),
        sm: theme.spacing(topPadding, 4.5),
        lg: theme.spacing(topPadding, 0, 12.5),
      },
    },
  }

  return (
    <Box
      component='main'
      sx={{
        display: 'flex',
        flex: 1,
        bgcolor: 'var(--ui-app-background)',
      }}
    >
      <Navbar
        isMobileNavbarOpened={isMobileNavbarOpened}
        toggleMobileNavbar={toggleMobileNavbar}
      >
        <Header
          isMobileNavbarOpened={isMobileNavbarOpened}
          toggle={toggleMobileNavbar}
        />
      </Navbar>
      <Stack className='Layout__content' {...layoutMixin}>
        <Stack>{children}</Stack>
      </Stack>
    </Box>
  )
}

export default Layout
