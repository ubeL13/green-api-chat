import { formatShortDate } from '@/shared/lib'

import type { Chat } from '../model/types'
import { ChatAvatar } from './ChatAvatar'
import styles from './ChatListItem.module.scss'

interface ChatListItemProps {
  chat: Chat
  preview?: string
  timestamp?: number
  active: boolean
  onClick: (id: string) => void
}

export const ChatListItem = ({ chat, preview, timestamp, active, onClick }: ChatListItemProps) => (
  <button
    type="button"
    className={`${styles.item} ${active ? styles.active : ''}`}
    aria-current={active}
    onClick={() => onClick(chat.id)}
  >
    <ChatAvatar id={chat.id} />
    <div className={styles.body}>
      <div className={styles.row}>
        <span className={styles.name}>{chat.name}</span>
        {timestamp && <span className={styles.time}>{formatShortDate(timestamp)}</span>}
      </div>
      <div className={styles.preview}>{preview ?? 'Нет сообщений'}</div>
    </div>
  </button>
)
