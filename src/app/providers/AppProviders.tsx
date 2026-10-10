import { App as AntApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { theme } from '@/shared/config'

import { store } from '../store'

export const AppProviders = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <ConfigProvider locale={ruRU} theme={theme}>
      <AntApp className="app-root">{children}</AntApp>
    </ConfigProvider>
  </Provider>
)
