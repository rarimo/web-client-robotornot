import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { HeaderSwitcherNetwork } from '@/components'
import { usePages, useWeb3 } from '@/hooks'

const NavbarMenuList = ({
  toggleMobileNavbar,
}: {
  toggleMobileNavbar: () => void
}) => {
  const { connect, disconnect, isConnected, isConnecting } = useWeb3()
  const { t } = useTranslation()
  const theme = useTheme()
  const menuItemList = usePages()

  return (
    <Stack
      sx={{
        p: theme.spacing(3, 0, 4.5),
        flex: 1,
      }}
    >
      <Box
        sx={{
          m: theme.spacing('auto', 10, 2),
        }}
      >
        <HeaderSwitcherNetwork />
      </Box>
      <List sx={{ flex: 1 }}>
        {menuItemList.map((page, idx) => (
          <ListItem
            component={page.href ? 'a' : NavLink}
            {...(page.href
              ? { href: page.href, target: '_blank', rel: 'noopener' }
              : { to: page.path })}
            sx={{
              transition: theme.transitions.create(['color', 'padding']),
              color: theme.palette.secondary.light,
              mb: theme.spacing(1),
              p: {
                xs: theme.spacing(1.5, 6.5, 1.5),
              },
              '&.active': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.text.primary,
              },
            }}
            key={idx}
            aria-label={page.name}
            onClick={toggleMobileNavbar}
          >
            <ListItemIcon
              aria-hidden='true'
              sx={{
                color: 'inherit',
                minWidth: '40px',
              }}
            >
              <Box
                component={page.icon}
                sx={{ width: '24px', height: '24px' }}
              />
            </ListItemIcon>
            <ListItemText
              sx={{
                color: 'inherit',
                transition: theme.transitions.create('opacity'),
                '& > .MuiTypography-root': {
                  fontWeight: theme.typography.fontWeightMedium,
                },
              }}
              primary={page.name}
            />
          </ListItem>
        ))}
      </List>
      {isConnected ? (
        <Button
          size='small'
          variant='outlined'
          aria-label={t('common.disconnect-wallet-btn')}
          sx={{
            m: theme.spacing('auto', 10, 2),
          }}
          onClick={disconnect}
        >
          {t('common.disconnect-wallet-btn')}
        </Button>
      ) : (
        <Button
          size='small'
          sx={{
            m: theme.spacing('auto', 10, 2),
          }}
          onClick={connect}
          disabled={isConnecting}
        >
          {t('common.connect-wallet-btn')}
        </Button>
      )}
    </Stack>
  )
}

export default NavbarMenuList
