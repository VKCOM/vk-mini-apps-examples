import { FC } from 'react'
import { Alert } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useAppDispatch } from 'src/store'
import { setShoppingCart, initialState } from 'src/store/shoppingCart.reducer'

const TIMEOUT = 200

export const PayConfirmPopout: FC = () => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()

  return (
    <Alert
      actions={[
        {
          title: 'Отмена',
          autoClose: true,
          mode: 'cancel',
        },
        {
          title: 'Купить',
          autoClose: false,
          mode: 'default',
          action: () =>
            // Таймаут для плавного перехода между страницами
            setTimeout(() => {
              routeNavigator.hidePopout()
              dispatch(setShoppingCart(initialState))
            }, TIMEOUT),
        },
      ]}
      actionsLayout="horizontal"
      onClose={() => routeNavigator.hidePopout()}
      header="Подтверждение оплаты"
      text="Вы уверены, что хотите совершить покупку"
    />
  )
}
