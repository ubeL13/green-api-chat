import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Credentials } from '@/shared/api'

interface SessionState {
  credentials: Credentials | null
}

const initialState: SessionState = {
  credentials: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<Credentials>) => {
      state.credentials = action.payload
    },
    loggedOut: () => initialState,
  },
})

export const { loggedIn, loggedOut } = sessionSlice.actions

export const selectCredentials = (state: RootState) => state.session.credentials
export const selectIsAuthorized = (state: RootState) => state.session.credentials !== null
