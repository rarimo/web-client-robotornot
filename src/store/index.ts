import { configureStore } from '@reduxjs/toolkit'

import { uiStorage, web3Storage } from '@/store/storages'

import uiReducer from './ui'
import web3Reducer from './web3'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    web3: web3Reducer,
  },
  preloadedState: {
    ui: uiStorage.getStorage(),
    web3: web3Storage.getStorage(),
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export * from './ui'
export * from './web3'
