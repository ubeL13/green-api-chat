import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
  CheckWhatsappRequest,
  CheckWhatsappResponse,
  Credentials,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
  GetSettingsResponse,
  GetStateInstanceResponse,
  ReceiveNotificationResponse,
  SendMessageRequest,
  SendMessageResponse,
  WithCredentials,
} from './types'

const RECEIVE_TIMEOUT_SEC = 20

const buildUrl = (
  { apiUrl, idInstance, apiTokenInstance }: Credentials,
  method: string,
  suffix = '',
) => `${apiUrl.replace(/\/+$/, '')}/waInstance${idInstance}/${method}/${apiTokenInstance}${suffix}`

export const greenApi = createApi({
  reducerPath: 'greenApi',
  baseQuery: fetchBaseQuery(),
  endpoints: (build) => ({
    getStateInstance: build.query<GetStateInstanceResponse, Credentials>({
      query: (credentials) => buildUrl(credentials, 'getStateInstance'),
      keepUnusedDataFor: 0,
    }),
    getSettings: build.query<GetSettingsResponse, Credentials>({
      query: (credentials) => buildUrl(credentials, 'getSettings'),
      keepUnusedDataFor: 0,
    }),
    checkWhatsapp: build.mutation<CheckWhatsappResponse, WithCredentials<CheckWhatsappRequest>>({
      query: ({ credentials, ...body }) => ({
        url: buildUrl(credentials, 'checkWhatsapp'),
        method: 'POST',
        body,
      }),
    }),
    sendMessage: build.mutation<SendMessageResponse, WithCredentials<SendMessageRequest>>({
      query: ({ credentials, ...body }) => ({
        url: buildUrl(credentials, 'sendMessage'),
        method: 'POST',
        body,
      }),
    }),
    receiveNotification: build.mutation<ReceiveNotificationResponse | null, Credentials>({
      query: (credentials) => ({
        url: buildUrl(credentials, 'receiveNotification', `?receiveTimeout=${RECEIVE_TIMEOUT_SEC}`),
        timeout: (RECEIVE_TIMEOUT_SEC + 40) * 1000,
      }),
    }),
    deleteNotification: build.mutation<
      DeleteNotificationResponse,
      WithCredentials<DeleteNotificationRequest>
    >({
      query: ({ credentials, receiptId }) => ({
        url: buildUrl(credentials, 'deleteNotification', `/${receiptId}`),
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useLazyGetStateInstanceQuery,
  useLazyGetSettingsQuery,
  useCheckWhatsappMutation,
  useSendMessageMutation,
} = greenApi
