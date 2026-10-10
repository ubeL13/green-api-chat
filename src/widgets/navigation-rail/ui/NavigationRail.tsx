import { MessageFilled } from '@ant-design/icons'
import { Tooltip } from 'antd'

import { LogoutButton } from '@/features/logout'

import styles from './NavigationRail.module.scss'

interface NavigationRailProps {
  className?: string
}

export const NavigationRail = ({ className }: NavigationRailProps) => (
  <nav className={`${styles.rail} ${className ?? ''}`} aria-label="Навигация">
    <Tooltip title="Чаты" placement="right">
      <div className={`${styles.item} ${styles.active}`} aria-current="page" aria-label="Чаты">
        <MessageFilled aria-hidden />
      </div>
    </Tooltip>
    <div className={styles.spacer} />
    <LogoutButton />
  </nav>
)
