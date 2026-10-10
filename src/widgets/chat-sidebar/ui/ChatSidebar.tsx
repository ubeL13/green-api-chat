import { SearchOutlined } from '@ant-design/icons'
import { Empty, Input } from 'antd'
import { useMemo, useState } from 'react'

import { ChatListItem, chatSelected, selectActiveChatId, selectAllChats } from '@/entities/chat'
import { selectLastMessageByChat } from '@/entities/message'
import { CreateChatButton } from '@/features/create-chat'
import { LogoutButton } from '@/features/logout'
import type { ReceiveStatus } from '@/features/receive-messages'
import { useAppDispatch, useAppSelector } from '@/shared/lib'

import styles from './ChatSidebar.module.scss'

interface ChatSidebarProps {
  receiveStatus: ReceiveStatus
  className?: string
}

export const ChatSidebar = ({ receiveStatus, className }: ChatSidebarProps) => {
  const dispatch = useAppDispatch()
  const chats = useAppSelector(selectAllChats)
  const activeChatId = useAppSelector(selectActiveChatId)
  const lastMessages = useAppSelector(selectLastMessageByChat)
  const [query, setQuery] = useState('')

  const visibleChats = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const digitsQuery = normalizedQuery.replace(/\D/g, '')

    return chats
      .filter(
        (chat) =>
          !normalizedQuery ||
          chat.name.toLowerCase().includes(normalizedQuery) ||
          (digitsQuery.length > 0 && chat.phone?.includes(digitsQuery)),
      )
      .toSorted(
        (a, b) =>
          (lastMessages[b.id]?.timestamp ?? b.createdAt) -
          (lastMessages[a.id]?.timestamp ?? a.createdAt),
      )
  }, [chats, lastMessages, query])

  const emptyText =
    chats.length === 0 ? 'Чатов пока нет. Нажмите «+», чтобы начать переписку' : 'Ничего не найдено'

  return (
    <aside className={`${styles.sidebar} ${className ?? ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <LogoutButton className={styles.mobileLogout} />
        <CreateChatButton />
      </header>

      <div className={styles.search}>
        <Input
          variant="filled"
          placeholder="Найти"
          prefix={<SearchOutlined />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          allowClear
          aria-label="Поиск по чатам"
        />
      </div>

      {receiveStatus === 'error' && (
        <div className={styles.status} role="status">
          Нет связи с GREEN-API, переподключаемся…
        </div>
      )}

      {visibleChats.length === 0 ? (
        <Empty
          className={styles.empty}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyText}
        />
      ) : (
        <ul className={styles.list}>
          {visibleChats.map((chat) => (
            <li key={chat.id}>
              <ChatListItem
                chat={chat}
                preview={lastMessages[chat.id]?.text}
                timestamp={lastMessages[chat.id]?.timestamp}
                active={chat.id === activeChatId}
                onClick={(id) => dispatch(chatSelected(id))}
              />
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
