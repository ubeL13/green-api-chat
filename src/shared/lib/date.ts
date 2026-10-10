const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
const dayWithYearFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const DAY_MS = 24 * 60 * 60 * 1000

export const isSameDay = (a: number, b: number): boolean =>
  new Date(a).toDateString() === new Date(b).toDateString()

export const formatTime = (timestamp: number): string => timeFormatter.format(timestamp)

export const formatShortDate = (timestamp: number): string =>
  isSameDay(timestamp, Date.now()) ? formatTime(timestamp) : shortDateFormatter.format(timestamp)

export const formatDayLabel = (timestamp: number, now = Date.now()): string => {
  if (isSameDay(timestamp, now)) return 'Сегодня'
  if (isSameDay(timestamp, now - DAY_MS)) return 'Вчера'

  const isThisYear = new Date(timestamp).getFullYear() === new Date(now).getFullYear()
  return isThisYear
    ? dayFormatter.format(timestamp)
    : dayWithYearFormatter.format(timestamp).replace(/\s*г\.$/, '')
}
