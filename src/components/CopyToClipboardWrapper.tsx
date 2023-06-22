import { IconButton, Stack, SxProps, useTheme } from '@mui/material'
import { CheckCircle, Copy } from 'iconoir-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Bus } from '@/helpers'

type CopyToClipboardWrapperProps = {
  value?: string | number
  children?: JSX.Element | JSX.Element[] | Element | Element[] | string
  sx?: SxProps
}

const CopyToClipboardWrapper = ({
  value,
  children,
  sx = {},
}: CopyToClipboardWrapperProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()

  let timeout: NodeJS.Timeout

  const copyToClipboard = async () => {
    try {
      clearTimeout(timeout)
      await navigator.clipboard.writeText(`${value}`)
      setIsCopied(true)
      timeout = setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    } catch (e) {
      Bus.error(t('copy-to-clipboard-wrapper.failed-msg'))
    }
  }

  return (
    <Stack
      flexDirection={'row'}
      spacing={1}
      sx={{ fontWeight: theme.typography.fontWeightMedium }}
    >
      <>
        {children}
        <IconButton
          sx={{
            color: theme.palette.primary.main,
            fontSize: 'inherit',
            lineHeight: 'inherit',
            pl: 0.5,
            ...sx,
          }}
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <CheckCircle aria-hidden={true} />
          ) : (
            <Copy aria-hidden={true} />
          )}
        </IconButton>
      </>
    </Stack>
  )
}

export default CopyToClipboardWrapper
