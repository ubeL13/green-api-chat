import { SendOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { type FormEvent, type KeyboardEvent, useState } from 'react'

import { messageAdded, messageFailed, messageSent } from '@/entities/message'
import { selectCredentials } from '@/entities/session'
import { useSendMessageMutation } from '@/shared/api'
import { useAppDispatch, useAppSelector } from '@/shared/lib'
import { IconButton } from '@/shared/ui'

import styles from './SendMessageForm.module.scss'

const MAX_LENGTH = 20000

interface SendMessageFormProps {
  chatId: string
}

export const SendMessageForm = ({ chatId }: SendMessageFormProps) => {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector(selectCredentials)
  const [sendMessage] = useSendMessageMutation()
  const [text, setText] = useState('')

  const canSend = text.trim().length > 0

  const send = async () => {
    const message = text.trim()
    if (!message || !credentials) return

    const localId = `local-${crypto.randomUUID()}`
    dispatch(
      messageAdded({
        id: localId,
        chatId,
        text: message,
        timestamp: Date.now(),
        direction: 'outgoing',
        status: 'pending',
      }),
    )
    setText('')

    try {
      const { idMessage } = await sendMessage({ credentials, chatId, message }).unwrap()
      dispatch(messageSent({ localId, id: idMessage }))
    } catch {
      dispatch(messageFailed(localId))
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void send()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input.TextArea
        className={styles.input}
        variant="borderless"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Сообщение"
        autoSize={{ minRows: 1, maxRows: 6 }}
        maxLength={MAX_LENGTH}
        aria-label="Текст сообщения"
        autoFocus
      />
      <IconButton type="submit" icon={<SendOutlined />} label="Отправить" disabled={!canSend} />
    </form>
  )
}
