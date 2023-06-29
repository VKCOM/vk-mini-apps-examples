import React from 'react'
import { Alert } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useAppDispatch } from 'src/store'
import { setShoppingCart } from 'src/store/app'

export const PayConfirmPopout: React.FC = () => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()

  return (
    <Alert
      actions={[
        {
          title: 'Купить',
          autoClose: false,
          mode: 'default',
          action: () =>
            setTimeout(() => {
              routeNavigator.hidePopout()
              dispatch(setShoppingCart([]))
            }, 200),
        },
      ]}
      onClose={() => routeNavigator.hidePopout()}
      header="Подтверждение оплаты"
      text="Вы уверены, что хотите совершить покупку"
    />
  )
}
