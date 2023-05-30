import React from 'react'
import { Alert } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { INITIAL_URL } from 'src/routes'

export const PayConfirmPopout: React.FC = () => {
  const routeNavigator = useRouteNavigator()
  return (
    <Alert
      actions={[
        {
          title: 'Купить',
          autoClose: false,
          mode: 'default',
          action: () => setTimeout(() => routeNavigator.push(INITIAL_URL), 200),
        },
      ]}
      onClose={() => routeNavigator.hidePopout()}
      header="Подтверждение оплаты"
      text="Вы уверены, что хотите совершить покупку"
    />
  )
}
