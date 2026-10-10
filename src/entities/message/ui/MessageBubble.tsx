import { CheckOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

import { formatTime } from '@/shared/lib'

import type { Message } from '../model/types'
import styles from './MessageBubble.module.scss'

const StatusIcon = ({ status }: Pick<Message, 'status'>) => {
  switch (status) {
    case 'pending':
      return <ClockCircleOutlined aria-label="Отправляется" />
    case 'sent':
      return <CheckOutlined aria-label="Отправлено" />
    case 'failed':
      return (
        <Tooltip title="Не удалось отправить">
          <ExclamationCircleOutlined className={styles.failed} aria-label="Ошибка отправки" />
        </Tooltip>
      )
  }
}

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutgoing = message.direction === 'outgoing'

  return (
    <div className={`${styles.row} ${isOutgoing ? styles.outgoing : styles.incoming}`}>
      <div className={styles.bubble}>
        <p className={styles.text}>
          {message.text}
          <span className={styles.meta}>
            <time dateTime={new Date(message.timestamp).toISOString()}>
              {formatTime(message.timestamp)}
            </time>
            {isOutgoing && <StatusIcon status={message.status} />}
          </span>
        </p>
      </div>
    </div>
  )
}
