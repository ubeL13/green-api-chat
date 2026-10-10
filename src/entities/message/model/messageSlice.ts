import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

import type { Message } from './types'

const messageAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.timestamp - b.timestamp,
})

export const messageSlice = createSlice({
  name: 'message',
  initialState: messageAdapter.getInitialState(),
  reducers: {
    messageAdded: messageAdapter.addOne,
    messageSent: (state, action: PayloadAction<{ localId: string; id: string }>) => {
      const { localId, id } = action.payload
      const message = state.entities[localId]
      if (!message) return

      messageAdapter.removeOne(state, localId)
      messageAdapter.addOne(state, { ...message, id, status: 'sent' })
    },
    messageFailed: (state, action: PayloadAction<string>) => {
      messageAdapter.updateOne(state, { id: action.payload, changes: { status: 'failed' } })
    },
  },
})

export const { messageAdded, messageSent, messageFailed } = messageSlice.actions

const { selectAll } = messageAdapter.getSelectors((state: RootState) => state.message)

export const selectMessagesByChatId = createSelector(
  [selectAll, (_state: RootState, chatId: string) => chatId],
  (messages, chatId) => messages.filter((message) => message.chatId === chatId),
)

export const selectLastMessageByChat = createSelector([selectAll], (messages) => {
  const result: Record<string, Message> = {}
  for (const message of messages) {
    result[message.chatId] = message
  }
  return result
})
