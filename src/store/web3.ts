import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/store'
import { web3Storage } from '@/store/storages'
import { Web3StorageState } from '@/types'

export const web3InitialState: Web3StorageState = {
  isConnected: false,
  isValidator: false,
  address: '',
}

export const web3Slice = createSlice({
  name: 'web3',

  initialState: web3InitialState,

  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
      web3Storage.save(state)
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload ?? ''
      web3Storage.save(state)
    },
    setIsValidator: (state, action: PayloadAction<boolean>) => {
      state.isValidator = action.payload ?? false
      web3Storage.save(state)
    },
  },
})

export const { setIsConnected, setAddress, setIsValidator } = web3Slice.actions

export const isConnected = (state: RootState) => state.web3.isConnected
export const address = (state: RootState) => state.web3.address
export const isValidator = (state: RootState) => state.web3.isValidator

export default web3Slice.reducer
