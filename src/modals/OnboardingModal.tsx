import React from 'react'
import { Icon56GestureOutline } from '@vkontakte/icons'
import { Button, ModalCard, NavIdProps } from '@vkontakte/vkui'
import { useAppSelector } from 'src/store'

const OnboardingModal: React.FC<NavIdProps & { onClose: () => void }> = (
  props
) => {
  const { name } = useAppSelector((state) => state.user)
  return (
    <ModalCard
      {...props}
      icon={<Icon56GestureOutline />}
      header={`Привет ${name}!`}
      subheader="Добро пожаловать в шаблон мини-приложения) Магазин доступен только в деморежиме, товары из него приобрести нельзя."
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
