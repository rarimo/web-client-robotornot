import { Stack, Typography } from '@mui/material'
import { HelpCircle } from 'iconoir-react'

import { Tooltip } from '@/components'

const TableHeadCellWithTip = ({
  label,
  message,
  align = 'center',
}: {
  label?: string
  message: string | JSX.Element
  align?: 'flex-start' | 'center' | 'flex-end'
}) => {
  return (
    <Tooltip message={message}>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={align}>
        <Typography
          sx={{
            fontSize: 'inherit',
            fontWeight: 'inherit',
            mr: 0.5,
          }}
        >
          {label}
        </Typography>
        <HelpCircle
          width={16}
          height={16}
          aria-hidden='true'
          cursor={'pointer'}
        />
      </Stack>
    </Tooltip>
  )
}

export default TableHeadCellWithTip
