import React from 'react'
import { Icon56MoneyTransferOutline } from '@vkontakte/icons'
import { Button, ModalCard, NavIdProps } from '@vkontakte/vkui'
import { useAppSelector } from 'src/store'

const OnboardingModal: React.FC<NavIdProps & { onClose: () => void }> = (
  props
) => {
  const { name } = useAppSelector((state) => state.user)
  return (
    <ModalCard
      {...props}
      icon={<Icon56MoneyTransferOutline />}
      header={`Привет ${name}!`}
      subheader="Добро пожаловать в наш тестовый магазин)"
      actions={
        <Button size="l" mode="primary" stretched onClick={props.onClose}>
          Продолжить
        </Button>
      }
    />
  )
}

export { OnboardingModal }
