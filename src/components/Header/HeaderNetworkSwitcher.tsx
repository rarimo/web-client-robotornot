import { CONFIG } from '@config'
import { MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const HeaderNetworkSwitcher = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  const [link, setLink] = React.useState(
    window.location.protocol + '//' + window.location.host,
  )
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleChange = (event: SelectChangeEvent) => {
    setLink(event.target.value)
    window.location.replace(`${event.target.value}`)
  }
  useEffect(() => {
    if (!import.meta.env.DEV) return

    if (CONFIG.CHAIN_RPC_URL.includes('devnet')) setLink(CONFIG.DEVNET_URL)

    if (CONFIG.CHAIN_RPC_URL.includes('testnet')) setLink(CONFIG.TESTNET_URL)

    if (CONFIG.CHAIN_RPC_URL.includes('mainnet')) setLink(CONFIG.DEVNET_URL)
  }, [])
  const listItem = [
    {
      label: t('header-switcher-network.devnet'),
      link: CONFIG.DEVNET_URL,
    },
    {
      label: t('header-switcher-network.testnet'),
      link: CONFIG.TESTNET_URL,
    },
    {
      label: t('header-switcher-network.mainnet'),
      link: CONFIG.MAINNET_URL,
    },
  ]

  return (
    <Select
      labelId='network-switcher'
      id='network-switcher'
      value={link}
      autoWidth
      sx={{
        '.MuiOutlinedInput-notchedOutline': { border: 0 },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent',
          borderWidth: 0,
        },
        minWidth: 110,
        marginLeft: theme.spacing(1),
      }}
      open={open}
      onMouseEnter={handleOpen}
      onClose={handleClose}
      MenuProps={{
        PaperProps: {
          onMouseLeave: handleClose,
        },
      }}
      onChange={handleChange}
    >
      {listItem.map(
        (item, index) =>
          Boolean(item.link) && (
            <MenuItem
              key={index}
              value={item.link}
              onClick={handleClose}
              sx={{
                color: theme.palette.secondary.light,
                '&.active': {
                  color: theme.palette.text.primary,
                },
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              {item.label}
            </MenuItem>
          ),
      )}
    </Select>
  )
}

export default HeaderNetworkSwitcher
