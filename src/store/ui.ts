import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ThemeMode } from '@/enums'
import { RootState } from '@/store/index'
import { uiStorage } from '@/store/storages'
import { UiStorageState } from '@/types'

export const uiInitialState: UiStorageState = {
  viewportWidth: window.innerWidth,
  themeMode: '' as ThemeMode,
}

export const uiSlice = createSlice({
  name: 'ui',

  initialState: uiInitialState,

  reducers: {
    setViewportWidth: (state, action: PayloadAction<number>) => {
      state.viewportWidth = action.payload
    },

    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload
      uiStorage.save(state)
    },
  },
})

export const { setViewportWidth, setThemeMode } = uiSlice.actions

export const viewportWidth = (state: RootState) => state.ui.viewportWidth
export const themeMode = (state: RootState) => state.ui.themeMode

export default uiSlice.reducer
