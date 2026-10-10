# GREEN-API Chat

Чат для отправки и получения сообщений WhatsApp через [GREEN-API](https://green-api.com).

## Стек

- React 19, TypeScript, Vite
- Redux Toolkit + RTK Query
- React Router
- Ant Design, SCSS Modules
- Feature-Sliced Design
- ESLint, Prettier, Husky + lint-staged

## Запуск локально

Нужен Node.js 20+.

```bash
npm install
npm run dev
```

Затем открыть http://localhost:5173 и ввести API URL, `idInstance` и `apiTokenInstance` из личного кабинета GREEN-API.

## Настройки инстанса

Без них не придут ответы:

- webhook URL — пустой;
- получение уведомлений о входящих сообщениях — включено.

## Как проверить

1. Нажать «+» и ввести номер получателя.
2. Написать сообщение и отправить.
3. Получатель отвечает в WhatsApp.
4. Ответ появляется в чате.

