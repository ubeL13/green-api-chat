import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Modal } from 'antd'
import { useState } from 'react'

import { chatAdded, chatSelected } from '@/entities/chat'
import { selectCredentials } from '@/entities/session'
import { getErrorMessage, useCheckWhatsappMutation } from '@/shared/api'
import { formatPhone, normalizePhone, toChatId, useAppDispatch, useAppSelector } from '@/shared/lib'
import { IconButton } from '@/shared/ui'

interface FormValues {
  phone: string
}

export const CreateChatButton = () => {
  const dispatch = useAppDispatch()
  const credentials = useAppSelector(selectCredentials)
  const [checkWhatsapp, { isLoading }] = useCheckWhatsappMutation()
  const [isOpen, setIsOpen] = useState(false)
  const [form] = Form.useForm<FormValues>()

  const close = () => {
    setIsOpen(false)
    form.resetFields()
  }

  const handleFinish = async ({ phone: rawPhone }: FormValues) => {
    const phone = normalizePhone(rawPhone)
    if (!phone || !credentials) return

    try {
      const { existsWhatsapp } = await checkWhatsapp({
        credentials,
        phoneNumber: Number(phone),
      }).unwrap()

      if (!existsWhatsapp) {
        form.setFields([{ name: 'phone', errors: ['Этот номер не зарегистрирован в WhatsApp'] }])
        return
      }

      const chatId = toChatId(phone)
      dispatch(chatAdded({ id: chatId, name: formatPhone(phone), phone, createdAt: Date.now() }))
      dispatch(chatSelected(chatId))
      close()
    } catch (error) {
      form.setFields([{ name: 'phone', errors: [getErrorMessage(error)] }])
    }
  }

  return (
    <>
      <IconButton icon={<PlusOutlined />} label="Новый чат" onClick={() => setIsOpen(true)} />
      <Modal
        title="Новый чат"
        open={isOpen}
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={isLoading}
        onOk={form.submit}
        onCancel={close}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
          <Form.Item
            label="Номер телефона получателя"
            name="phone"
            rules={[
              { required: true, message: 'Введите номер телефона' },
              {
                validator: (_, value: string | undefined) =>
                  !value || normalizePhone(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error('Некорректный номер')),
              },
            ]}
          >
            <Input placeholder="+7 999 123-45-67" inputMode="tel" autoComplete="tel" autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
