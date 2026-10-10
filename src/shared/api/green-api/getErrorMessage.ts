import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error

export const getErrorMessage = (error: unknown): string => {
  if (!isFetchBaseQueryError(error)) {
    return 'Неизвестная ошибка'
  }

  switch (error.status) {
    case 'FETCH_ERROR':
      return 'Сервер GREEN-API недоступен. Проверьте API URL и подключение к интернету'
    case 'TIMEOUT_ERROR':
      return 'Сервер GREEN-API не ответил вовремя'
    case 'PARSING_ERROR':
      return 'Некорректный ответ сервера. Проверьте API URL'
    case 401:
    case 403:
      return 'Неверный idInstance или apiTokenInstance'
    case 429:
      return 'Слишком много запросов, попробуйте позже'
    case 466:
      return 'Превышен лимит запросов тарифа GREEN-API'
    default: {
      const data = error.data as { message?: string } | undefined
      return data?.message ?? `Ошибка сервера (${String(error.status)})`
    }
  }
}
