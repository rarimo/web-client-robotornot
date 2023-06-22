import { Components } from '@mui/material'
import { NavArrowDown } from 'iconoir-react'

import { BaseTheme } from '@/types'

export const componentsTheme: Components<BaseTheme> = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: 'var(--col-btn-txt)',
        padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontSize,
        lineHeight: theme.typography.button.lineHeight,
        letterSpacings: theme.typography.button.letterSpacings,
        height: theme.spacing(6),
      }),
      outlined: ({ theme }) => ({
        color: theme.palette.primary.main,
      }),
    },
    defaultProps: {
      variant: 'contained',
      disableElevation: true,
      disableFocusRipple: true,
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
    },
  },
  MuiFormControl: {
    defaultProps: {
      fullWidth: true,
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'unset',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        borderRadius: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold,

        '& > .MuiChip-label': {
          padding: 0,
        },
      }),
      outlined: ({ theme }) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& > .MuiPaper-root': {
          minWidth: '100px',
          borderRadius: theme.spacing(2),
          boxShadow: 'var(--ui-box-shadow)',
        },
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(1),
        margin: `0 ${theme.spacing(1)}`,
        padding: `12px ${theme.spacing(2)}`,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: '14px',
        color: theme.palette.text.primary,

        '&:hover': {
          backgroundColor: 'var(--col-bg-secondary)',
        },

        '&:not(:first-of-type)': {
          marginTop: theme.spacing(1),
        },
      }),
    },
  },
  MuiSnackbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& > .MuiPaper-root': {
          borderRadius: theme.spacing(1),
          boxShadow: 'var(--ui-box-shadow)',
          border: '1px solid var(--col-border-light)',
        },
      }),
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontWeight: theme.typography.fontWeightBold,
      }),
    },
    defaultProps: {
      underline: 'hover',
      fontSize: '0.875rem',
    },
  },
  MuiSelect: {
    styleOverrides: {
      icon: ({ theme }) => ({
        top: theme.spacing(2),
        right: theme.spacing(2),
      }),
    },
    defaultProps: {
      IconComponent: NavArrowDown,
    },
  },
  MuiTablePagination: {
    defaultProps: {
      rowsPerPageOptions: [10, 15, 25, 50],
    },
    styleOverrides: {
      root: {
        borderTop: '1px solid var(--col-border-light)',
      },
      selectIcon: {
        top: 'calc(50% - 0.7em)',
        right: 0,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: 'var(--col-border-light)',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 0,
        color: theme.palette.text.primary,
        transition: 'color 0.2s',

        '&[disabled]': {
          color: theme.palette.text.disabled,
        },

        '&:not([disabled]):hover': {
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
        },

        '&:not([disabled]).active, &:not([disabled]):active': {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
  MuiSkeleton: {
    defaultProps: {
      animation: 'wave',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        transform: 'none',
        borderRadius: theme.spacing(0.5),
        backgroundColor: 'var(--col-bg-tertiary)',
      }),
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      leaveDelay: 200,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        maxWidth: 300,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
        boxShadow: 'var(--ui-box-shadow)',
        borderRadius: theme.spacing(2),
      }),
    },
  },
}
