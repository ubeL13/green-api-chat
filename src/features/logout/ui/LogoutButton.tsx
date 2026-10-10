import { LogoutOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'

import { loggedOut } from '@/entities/session'
import { useAppDispatch } from '@/shared/lib'
import { IconButton } from '@/shared/ui'

interface LogoutButtonProps {
  className?: string
}

export const LogoutButton = ({ className }: LogoutButtonProps) => {
  const dispatch = useAppDispatch()

  return (
    <Popconfirm
      title="Выйти из аккаунта?"
      description="Чаты и сообщения на этом устройстве будут удалены"
      okText="Выйти"
      cancelText="Отмена"
      placement="rightBottom"
      onConfirm={() => dispatch(loggedOut())}
    >
      <IconButton
        className={className}
        icon={<LogoutOutlined />}
        label="Выйти"
        tooltipPlacement="right"
      />
    </Popconfirm>
  )
}
