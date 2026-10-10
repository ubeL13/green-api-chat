import type { Store } from '@reduxjs/toolkit'

import { loadFromStorage, saveToStorage } from '@/shared/lib'

import type { AppState } from './store'

const STORAGE_KEY = 'green-api-chat:state:v1'
const SAVE_DELAY_MS = 300

type PersistedState = Pick<AppState, 'session' | 'chat' | 'message'>

export const loadPersistedState = (): PersistedState | undefined =>
  loadFromStorage<PersistedState>(STORAGE_KEY)

export const persistState = (store: Store<AppState>) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  let lastSaved: PersistedState | undefined

  store.subscribe(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const { session, chat, message } = store.getState()
      if (
        lastSaved?.session === session &&
        lastSaved.chat === chat &&
        lastSaved.message === message
      ) {
        return
      }
      lastSaved = { session, chat, message }
      saveToStorage(STORAGE_KEY, lastSaved)
    }, SAVE_DELAY_MS)
  })
}
