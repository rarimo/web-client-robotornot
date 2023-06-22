import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  useTheme,
} from '@mui/material'
import { Cancel } from 'iconoir-react'
import { useTranslation } from 'react-i18next'

import { Logo, NavbarMenuList } from '@/components'

const container = window !== undefined ? () => window.document.body : undefined

const Navbar = ({
  children,
  isMobileNavbarOpened,
  toggleMobileNavbar,
}: {
  children: JSX.Element
  isMobileNavbarOpened: boolean
  toggleMobileNavbar: () => void
}) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const menuToolbar = (
    <Toolbar
      sx={{
        p: theme.spacing(4.5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '.Navbar:hover > .MuiDrawer-root .MuiPaper-root > .Navbar__menuList > & > .Navbar__sideToggleButton':
          {
            opacity: 1,
          },
      }}
    >
      <Box component='div' width={27} />

      <Logo onClick={toggleMobileNavbar} />

      <IconButton
        size='small'
        aria-label={t('common.close-btn')}
        edge='start'
        onClick={toggleMobileNavbar}
        sx={{
          display: { sm: 'none' },
        }}
      >
        <Cancel aria-hidden='true' />
      </IconButton>
    </Toolbar>
  )

  const menuList = (
    <Stack
      className='Navbar__menuList'
      sx={{ height: 'calc(100 * var(--vh))' }}
    >
      {menuToolbar}
      <Divider
        aria-hidden='true'
        sx={{
          transition: theme.transitions.create('opacity'),
        }}
      />
      <NavbarMenuList toggleMobileNavbar={toggleMobileNavbar} />
    </Stack>
  )

  return (
    <Box component='nav' className='Navbar'>
      {children}
      <Drawer
        container={container}
        variant='temporary'
        open={isMobileNavbarOpened}
        onClose={toggleMobileNavbar}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '100%',
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {menuList}
      </Drawer>
    </Box>
  )
}

export default Navbar
