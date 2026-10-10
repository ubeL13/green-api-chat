import { MessageFilled } from '@ant-design/icons'
import { Card } from 'antd'

import { LoginForm } from '@/features/auth-by-credentials'

import styles from './LoginPage.module.scss'

export const LoginPage = () => (
  <main className={styles.page}>
    <Card className={styles.card}>
      <div className={styles.logo} aria-hidden>
        <MessageFilled />
      </div>
      <h1 className={styles.title}>GREEN-API Chat</h1>
      <p className={styles.subtitle}>Введите данные инстанса из личного кабинета GREEN-API</p>
      <LoginForm />
    </Card>
  </main>
)
