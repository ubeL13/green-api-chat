import { ArrowLeftOutlined, MessageOutlined } from '@ant-design/icons'
import { Fragment, useEffect, useRef } from 'react'

import { ChatAvatar, chatSelected, selectActiveChat } from '@/entities/chat'
import { MessageBubble, selectMessagesByChatId } from '@/entities/message'
import { SendMessageForm } from '@/features/send-message'
import {
  formatDayLabel,
  formatPhone,
  isSameDay,
  useAppDispatch,
  useAppSelector,
} from '@/shared/lib'
import { IconButton } from '@/shared/ui'

import styles from './ChatWindow.module.scss'

interface ChatWindowProps {
  className?: string
}

export const ChatWindow = ({ className }: ChatWindowProps) => {
  const dispatch = useAppDispatch()
  const chat = useAppSelector(selectActiveChat)
  const messages = useAppSelector((state) => selectMessagesByChatId(state, chat?.id ?? ''))
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [chat?.id, messages.length])

  if (!chat) {
    return (
      <section className={`${styles.placeholder} ${className ?? ''}`}>
        <MessageOutlined className={styles.placeholderIcon} aria-hidden />
        <h2 className={styles.placeholderTitle}>GREEN-API Chat</h2>
        <p className={styles.placeholderText}>
          Выберите чат слева или нажмите «+», чтобы написать по номеру телефона
        </p>
      </section>
    )
  }

  const phone = chat.phone ? formatPhone(chat.phone) : undefined
  const subtitle = phone && phone !== chat.name ? phone : 'WhatsApp'

  return (
    <section className={`${styles.window} ${className ?? ''}`}>
      <header className={styles.header}>
        <IconButton
          icon={<ArrowLeftOutlined />}
          label="Закрыть чат"
          onClick={() => dispatch(chatSelected(null))}
        />
        <ChatAvatar id={chat.id} size={40} />
        <div className={styles.info}>
          <h2 className={styles.name}>{chat.name}</h2>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      </header>

      <div ref={listRef} className={styles.messages} role="log" aria-live="polite">
        <div className={styles.column}>
          {messages.length === 0 ? (
            <div className={styles.pill}>Напишите первое сообщение</div>
          ) : (
            messages.map((message, index) => {
              const previous = messages[index - 1]
              const isNewDay = !previous || !isSameDay(previous.timestamp, message.timestamp)

              return (
                <Fragment key={message.id}>
                  {isNewDay && (
                    <div className={styles.pill}>{formatDayLabel(message.timestamp)}</div>
                  )}
                  <MessageBubble message={message} />
                </Fragment>
              )
            })
          )}
        </div>
      </div>

      <div className={styles.composer}>
        <SendMessageForm key={chat.id} chatId={chat.id} />
      </div>
    </section>
  )
}
