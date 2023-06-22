import { useTheme } from '@mui/material'
import ReactJson from 'react-json-view'

import { useThemeMode } from '@/hooks'

const JsonViewer = ({ value }: { value: object }) => {
  const { isDarkThemeMode } = useThemeMode()
  const theme = useTheme()

  return (
    <ReactJson
      style={{ padding: theme.spacing(2), backgroundColor: 'transparent' }}
      src={value}
      theme={isDarkThemeMode ? 'monokai' : 'rjv-default'}
    />
  )
}

export default JsonViewer
