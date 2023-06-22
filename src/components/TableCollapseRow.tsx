import { Box, Collapse, IconButton, TableCell, TableRow } from '@mui/material'
import { ArrowDown, ArrowUp } from 'iconoir-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const TableCollapseRow = ({
  heading,
  children,
}: {
  heading: string
  children: JSX.Element | JSX.Element[]
}) => {
  const [isOpened, setIsOpened] = useState(false)

  const { t } = useTranslation()

  const handleToggle = () => {
    setIsOpened(!isOpened)
  }
  return (
    <>
      <TableRow>
        <TableCell
          variant='head'
          sx={{
            width: { xs: 200, sm: 300 },
            minWidth: { xs: 200, sm: 'auto' },
            p: 0,
          }}
          colSpan={2}
        >
          <IconButton
            aria-label={
              isOpened
                ? t('table-collapse-row.hide-lbl')
                : t('table-collapse-row.show-lbl')
            }
            size='small'
            onClick={handleToggle}
            sx={{
              p: 2,
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              justifyContent: 'flex-start',
              minWidth: '100%',
            }}
          >
            {isOpened ? <ArrowUp /> : <ArrowDown />}
            {heading}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={2}
        >
          <Collapse in={isOpened} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>{children}</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TableCollapseRow
