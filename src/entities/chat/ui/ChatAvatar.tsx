import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'

interface ChatAvatarProps {
  id: string
  size?: number
}

export const ChatAvatar = ({ id, size = 49 }: ChatAvatarProps) => (
  <Avatar
    size={size}
    icon={id.endsWith('@g.us') ? <TeamOutlined /> : <UserOutlined />}
    style={{ flexShrink: 0, backgroundColor: '#dfe5e7', color: '#ffffff' }}
  />
)
