export const normalizePhone = (input: string): string | null => {
  let digits = input.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }
  if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`
  }

  return digits.length >= 11 && digits.length <= 15 ? digits : null
}

const PERSONAL_CHAT_SUFFIX = '@c.us'

export const toChatId = (phone: string): string => `${phone}${PERSONAL_CHAT_SUFFIX}`

export const phoneFromChatId = (chatId: string): string | undefined =>
  chatId.endsWith(PERSONAL_CHAT_SUFFIX) ? chatId.slice(0, -PERSONAL_CHAT_SUFFIX.length) : undefined

export const formatPhone = (phone: string): string => {
  const match = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone)
  return match ? `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}` : `+${phone}`
}
