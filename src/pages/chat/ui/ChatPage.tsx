import { selectActiveChatId } from '@/entities/chat'
import { useReceiveMessages } from '@/features/receive-messages'
import { useAppSelector } from '@/shared/lib'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'
import { NavigationRail } from '@/widgets/navigation-rail'

import styles from './ChatPage.module.scss'

export const ChatPage = () => {
  const receiveStatus = useReceiveMessages()
  const hasActiveChat = useAppSelector(selectActiveChatId) !== null

  return (
    <main className={`${styles.page} ${hasActiveChat ? styles.hasActiveChat : ''}`}>
      <NavigationRail className={styles.rail} />
      <ChatSidebar className={styles.sidebar} receiveStatus={receiveStatus} />
      <ChatWindow className={styles.window} />
    </main>
  )
}
