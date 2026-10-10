export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type WithCredentials<T> = T & { credentials: Credentials }

export type StateInstance =
  'notAuthorized' | 'authorized' | 'blocked' | 'sleepMode' | 'starting' | 'yellowCard'

export interface GetStateInstanceResponse {
  stateInstance: StateInstance
}

type YesNo = 'yes' | 'no'

export interface GetSettingsResponse {
  wid: string
  webhookUrl: string
  incomingWebhook: YesNo
  outgoingWebhook: YesNo
  outgoingMessageWebhook: YesNo
  outgoingAPIMessageWebhook: YesNo
}

export interface CheckWhatsappRequest {
  phoneNumber: number
}

export interface CheckWhatsappResponse {
  existsWhatsapp: boolean
}

export interface SendMessageRequest {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface NotificationSenderData {
  chatId: string
  sender: string
  chatName?: string
  senderName?: string
  senderContactName?: string
  senderPhoneNumber?: number
}

export interface NotificationMessageData {
  typeMessage: string
  textMessageData?: { textMessage: string }
  extendedTextMessageData?: { text: string }
}

export interface NotificationBody {
  typeWebhook: string
  timestamp: number
  idMessage?: string
  senderData?: NotificationSenderData
  messageData?: NotificationMessageData
}

export interface ReceiveNotificationResponse {
  receiptId: number
  body: NotificationBody
}

export interface DeleteNotificationRequest {
  receiptId: number
}

export interface DeleteNotificationResponse {
  result: boolean
}
