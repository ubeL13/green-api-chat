import type { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#00a884',
    colorLink: '#008069',
    colorError: '#ea0038',
    colorText: '#111b21',
    colorTextSecondary: '#667781',
    borderRadius: 8,
    fontFamily:
      "'Segoe UI', 'Helvetica Neue', Helvetica, 'Lucida Grande', Arial, Ubuntu, Cantarell, 'Fira Sans', sans-serif",
  },
  components: {
    Input: {
      colorFillTertiary: '#f0f2f5',
    },
  },
}
