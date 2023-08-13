import { FC, memo, useCallback } from 'react'
import { Counter, TabbarItem, Tabbar } from '@vkontakte/vkui'
import { Icon28ShoppingCartOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { PaymentPanel, ShopView } from 'src/routes'

export type CustomTabbarProps = {
  activeView: string
}
let CustomTabbar: FC<CustomTabbarProps> = ({ activeView }) => {
  const routeNavigator = useRouteNavigator()

  const onPaymantTabbarItemClick = useCallback(() => {
    if (activeView === ShopView.Payment) return
    routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
  }, [routeNavigator, activeView])

  const onViewingTabbarItemClick = useCallback(() => {
    if (activeView === ShopView.Viewing) return
    routeNavigator.push('/')
  }, [routeNavigator, activeView])

  return (
    <Tabbar>
      <TabbarItem
        onClick={onViewingTabbarItemClick}
        selected={activeView === ShopView.Viewing}
        data-story="feed"
        text="Каталог"
      >
        <Icon28ShoppingCartOutline />
      </TabbarItem>
      <TabbarItem
        onClick={onPaymantTabbarItemClick}
        selected={activeView === ShopView.Payment}
        data-story="messages"
        indicator={
          <Counter size="s" mode="prominent">
            12
          </Counter>
        }
        text="Корзина"
      >
        <Icon28ShoppingCartOutline />
      </TabbarItem>
    </Tabbar>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CustomTabbar = memo(CustomTabbar)
export { CustomTabbar }
