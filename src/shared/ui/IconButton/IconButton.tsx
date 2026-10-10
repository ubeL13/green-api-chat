import { Tooltip, type TooltipProps } from 'antd'
import type { ComponentProps, ReactNode } from 'react'

import styles from './IconButton.module.scss'

interface IconButtonProps extends ComponentProps<'button'> {
  icon: ReactNode
  label: string
  tooltipPlacement?: TooltipProps['placement']
}

export const IconButton = ({
  icon,
  label,
  tooltipPlacement,
  className,
  type = 'button',
  ...props
}: IconButtonProps) => (
  <Tooltip title={label} placement={tooltipPlacement}>
    <button
      {...props}
      type={type}
      aria-label={label}
      className={`${styles.button} ${className ?? ''}`}
    >
      {icon}
    </button>
  </Tooltip>
)
