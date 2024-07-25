import React from 'react'
import { Icon56GestureOutline } from '@vkontakte/icons'
import { Button, ModalCard, NavIdProps } from '@vkontakte/vkui'
import { useAppSelector } from 'src/store'

/** Приветственная модальная страница */
const OnboardingModal: React.FC<NavIdProps & { onClose: () => void }> = (
  props
) => {
  const { name } = useAppSelector((state) => state.user)
  return (
    <ModalCard
      {...props}
      icon={<Icon56GestureOutline />}
      header={`Добрый день, ${name}!`}
      subheader="Добро пожаловать в шаблон магазина! Обратите внимание: приложение доступно в деморежиме, купить товары нельзя."
      actions={
        <Button
          size="l"
          mode="primary"
          stretched
          onClick={props.onClose}
        >
          Продолжить
        </Button>
      }
    />
  )
}

export { OnboardingModal }
