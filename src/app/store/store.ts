import { combineReducers, configureStore, type Reducer, type UnknownAction } from '@reduxjs/toolkit'

import { chatSlice } from '@/entities/chat'
import { messageSlice } from '@/entities/message'
import { loggedOut, sessionSlice } from '@/entities/session'
import { greenApi } from '@/shared/api'

import { loadPersistedState, persistState } from './persist'

const appReducer = combineReducers({
  [sessionSlice.reducerPath]: sessionSlice.reducer,
  [chatSlice.reducerPath]: chatSlice.reducer,
  [messageSlice.reducerPath]: messageSlice.reducer,
  [greenApi.reducerPath]: greenApi.reducer,
})

export type AppState = ReturnType<typeof appReducer>

const rootReducer: Reducer<AppState, UnknownAction, Partial<AppState>> = (state, action) =>
  appReducer(loggedOut.match(action) ? undefined : state, action)

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPersistedState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(greenApi.middleware),
})

persistState(store)

export type RootState = AppState
export type AppDispatch = typeof store.dispatch
