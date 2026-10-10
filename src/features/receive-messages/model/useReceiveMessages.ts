import { useEffect, useState } from 'react'

import { chatAdded } from '@/entities/chat'
import { messageAdded } from '@/entities/message'
import { selectCredentials } from '@/entities/session'
import { greenApi } from '@/shared/api'
import { useAppDispatch, useAppSelector } from '@/shared/lib'

import { parseNotification } from '../lib/parseNotification'

const RETRY_DELAY_MS = 5000

export type ReceiveStatus = 'online' | 'error'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const getHttpStatus = (error: unknown) =>
  typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined

export const useReceiveMessages = (): ReceiveStatus => {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector(selectCredentials)
  const [status, setStatus] = useState<ReceiveStatus>('online')

  useEffect(() => {
    if (!credentials) return

    let stopped = false
    let currentRequest: { abort: () => void } | null = null

    const poll = async () => {
      while (!stopped) {
        try {
          const receiveRequest = dispatch(
            greenApi.endpoints.receiveNotification.initiate(credentials, { track: false }),
          )
          currentRequest = receiveRequest
          const notification = await receiveRequest.unwrap()
          if (stopped) return
          setStatus('online')

          if (!notification) continue

          const message = parseNotification(notification.body)
          if (message) {
            dispatch(
              chatAdded({
                id: message.chatId,
                name: message.chatName,
                phone: message.phone,
                createdAt: message.timestamp,
              }),
            )
            dispatch(
              messageAdded({
                id: message.id,
                chatId: message.chatId,
                text: message.text,
                timestamp: message.timestamp,
                direction: message.direction,
                status: 'sent',
              }),
            )
          }

          const deleteRequest = dispatch(
            greenApi.endpoints.deleteNotification.initiate(
              { credentials, receiptId: notification.receiptId },
              { track: false },
            ),
          )
          currentRequest = deleteRequest
          await deleteRequest.unwrap()
        } catch (error) {
          if (stopped) return

          const status = getHttpStatus(error)
          if (status === 408 || status === 'TIMEOUT_ERROR') {
            setStatus('online')
            continue
          }
          if (status !== 429) {
            setStatus('error')
          }
          await delay(RETRY_DELAY_MS)
        }
      }
    }

    void poll()

    return () => {
      stopped = true
      currentRequest?.abort()
    }
  }, [credentials, dispatch])

  return status
}
