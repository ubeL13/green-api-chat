import type { MessageDirection } from '@/entities/message'
import type { NotificationBody } from '@/shared/api'
import { formatPhone, phoneFromChatId } from '@/shared/lib'

export interface ParsedTextMessage {
  id: string
  chatId: string
  chatName: string
  phone?: string
  text: string
  timestamp: number
  direction: MessageDirection
}

const DIRECTIONS: Record<string, MessageDirection> = {
  incomingMessageReceived: 'incoming',
  outgoingMessageReceived: 'outgoing',
  outgoingAPIMessageReceived: 'outgoing',
}

const TEXT_TYPES = new Set(['textMessage', 'extendedTextMessage', 'quotedMessage'])

export const parseNotification = (body: NotificationBody): ParsedTextMessage | null => {
  const direction = DIRECTIONS[body.typeWebhook]
  const { idMessage, senderData, messageData } = body
  if (!direction || !idMessage || !senderData || !messageData) return null

  const text = TEXT_TYPES.has(messageData.typeMessage)
    ? (messageData.textMessageData?.textMessage ?? messageData.extendedTextMessageData?.text)
    : undefined
  if (text === undefined) return null

  const phone = phoneFromChatId(senderData.chatId)
  const senderName =
    direction === 'incoming' ? senderData.senderContactName || senderData.senderName : undefined

  return {
    id: idMessage,
    chatId: senderData.chatId,
    chatName: senderData.chatName || senderName || (phone ? formatPhone(phone) : senderData.chatId),
    phone,
    text,
    timestamp: body.timestamp * 1000,
    direction,
  }
}
