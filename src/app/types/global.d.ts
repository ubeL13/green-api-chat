import type { AppDispatch as Dispatch, RootState as State } from '../store'

declare global {
  type RootState = State
  type AppDispatch = Dispatch
}

export {}
