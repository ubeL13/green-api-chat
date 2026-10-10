import { App, Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'

import { loggedIn } from '@/entities/session'
import {
  type Credentials,
  getErrorMessage,
  type GetSettingsResponse,
  type StateInstance,
  useLazyGetSettingsQuery,
  useLazyGetStateInstanceQuery,
} from '@/shared/api'
import { useAppDispatch } from '@/shared/lib'

const STATE_ERRORS: Record<Exclude<StateInstance, 'authorized'>, string> = {
  notAuthorized: 'Инстанс не авторизован: отсканируйте QR-код в личном кабинете GREEN-API',
  blocked: 'Аккаунт WhatsApp заблокирован',
  sleepMode: 'Инстанс в спящем режиме: проверьте, что телефон с WhatsApp в сети',
  starting: 'Инстанс запускается, попробуйте через минуту',
  yellowCard: 'Отправка сообщений временно ограничена WhatsApp',
}

const getSettingsWarnings = (settings: GetSettingsResponse): string[] => {
  const warnings: string[] = []
  if (settings.webhookUrl) {
    warnings.push('В настройках инстанса задан webhook URL — очистите его, иначе ответы не придут.')
  }
  if (settings.incomingWebhook !== 'yes') {
    warnings.push('Включите «Получать уведомления о входящих сообщениях» в настройках инстанса.')
  }
  return warnings
}

const initialValues: Credentials = {
  apiUrl: (import.meta.env.DEV && import.meta.env.VITE_API_URL) || 'https://api.green-api.com',
  idInstance: (import.meta.env.DEV && import.meta.env.VITE_ID_INSTANCE) || '',
  apiTokenInstance: (import.meta.env.DEV && import.meta.env.VITE_API_TOKEN) || '',
}

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { notification } = App.useApp()
  const [form] = Form.useForm<Credentials>()
  const [getStateInstance, { isFetching }] = useLazyGetStateInstanceQuery()
  const [getSettings] = useLazyGetSettingsQuery()

  const handleFinish = async (values: Credentials) => {
    const credentials: Credentials = {
      apiUrl: values.apiUrl.trim(),
      idInstance: values.idInstance.trim(),
      apiTokenInstance: values.apiTokenInstance.trim(),
    }

    try {
      const { stateInstance } = await getStateInstance(credentials).unwrap()
      if (stateInstance !== 'authorized') {
        form.setFields([{ name: 'idInstance', errors: [STATE_ERRORS[stateInstance]] }])
        return
      }
    } catch (error) {
      form.setFields([{ name: 'apiTokenInstance', errors: [getErrorMessage(error)] }])
      return
    }

    dispatch(loggedIn(credentials))
    navigate('/', { replace: true })

    getSettings(credentials)
      .unwrap()
      .then((settings) => {
        const warnings = getSettingsWarnings(settings)
        if (warnings.length > 0) {
          notification.warning({
            message: 'Проверьте настройки инстанса',
            description: warnings.join(' '),
            duration: 0,
          })
        }
      })
      .catch(() => {})
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={handleFinish}
      disabled={isFetching}
    >
      <Form.Item
        label="API URL"
        name="apiUrl"
        tooltip="apiUrl из личного кабинета GREEN-API"
        rules={[
          { required: true, message: 'Укажите API URL' },
          { type: 'url', message: 'Некорректный URL' },
        ]}
      >
        <Input placeholder="https://api.green-api.com" autoComplete="url" />
      </Form.Item>
      <Form.Item
        label="idInstance"
        name="idInstance"
        rules={[
          { required: true, message: 'Укажите idInstance' },
          { pattern: /^\s*\d+\s*$/, message: 'idInstance состоит из цифр' },
        ]}
      >
        <Input placeholder="1101000001" inputMode="numeric" autoComplete="username" />
      </Form.Item>
      <Form.Item
        label="apiTokenInstance"
        name="apiTokenInstance"
        rules={[{ required: true, whitespace: true, message: 'Укажите apiTokenInstance' }]}
      >
        <Input.Password
          placeholder="d75b3a66374942c5b3c019c698abc2067e151558acbd24da"
          autoComplete="current-password"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" size="large" block loading={isFetching}>
        Войти
      </Button>
    </Form>
  )
}
