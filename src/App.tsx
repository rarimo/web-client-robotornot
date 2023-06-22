import { CONFIG } from '@config'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import * as jdenticon from 'jdenticon'
import { useEffect, useState } from 'react'

import { ColorModeContext } from '@/contexts'
import { ErrorHandler } from '@/helpers'
import { useLocalize, useThemeMode, useViewportSizes, useWeb3 } from '@/hooks'
import AppRoutes from '@/routes'

const App = () => {
  const [isAppInitialised, setIsAppInitialised] = useState(false)

  const { init } = useLocalize()
  const { theme, colorMode } = useThemeMode()
  useViewportSizes()

  const { isConnected, connect } = useWeb3()

  useEffect(() => {
    const initApp = async () => {
      setIsAppInitialised(false)
      try {
        init()
        if (isConnected) {
          await connect()
        }

        jdenticon.configure({
          hues: [207],
          lightness: {
            color: [0.84, 0.84],
            grayscale: [0.84, 0.84],
          },
          saturation: {
            color: 0.48,
            grayscale: 0.48,
          },
          backColor: '#2a4766',
        })

        document.title = CONFIG.APP_NAME
      } catch (e) {
        ErrorHandler.process(e)
      }
      setIsAppInitialised(true)
    }

    initApp()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='App'>{isAppInitialised && <AppRoutes />}</div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
