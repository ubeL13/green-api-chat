import { Button, Result } from 'antd'

export const RouteError = () => (
  <Result
    status="error"
    title="Что-то пошло не так"
    subTitle="Попробуйте перезагрузить страницу"
    extra={
      <Button type="primary" onClick={() => window.location.reload()}>
        Перезагрузить
      </Button>
    }
  />
)
