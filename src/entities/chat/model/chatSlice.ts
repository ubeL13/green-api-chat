import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Chat } from './types'

const chatAdapter = createEntityAdapter<Chat>()

const initialState = chatAdapter.getInitialState({
  activeChatId: null as string | null,
})

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    chatAdded: chatAdapter.addOne,
    chatSelected: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload
    },
  },
})

export const { chatAdded, chatSelected } = chatSlice.actions

const selectors = chatAdapter.getSelectors((state: RootState) => state.chat)

export const selectAllChats = selectors.selectAll
export const selectChatById = selectors.selectById
export const selectActiveChatId = (state: RootState) => state.chat.activeChatId
export const selectActiveChat = (state: RootState) => {
  const id = state.chat.activeChatId
  return id ? selectors.selectById(state, id) : undefined
}
