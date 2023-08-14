import { FC, memo, useCallback } from 'react'
import { Counter, TabbarItem, Tabbar } from '@vkontakte/vkui'
import { Icon28ShoppingCartOutline, Icon28HomeOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { PaymentPanel, ShopView } from 'src/routes'
import { selectOrderProducts } from 'src/store/shoppingCart.reducer'
import { useAppSelector } from 'src/store'

export type CustomTabbarProps = {
  activeView: string
}
let CustomTabbar: FC<CustomTabbarProps> = ({ activeView }) => {
  const orderProducts = useAppSelector(selectOrderProducts)
  const routeNavigator = useRouteNavigator()
  const productCount = orderProducts.length

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
        <Icon28HomeOutline />
      </TabbarItem>
      <TabbarItem
        onClick={onPaymantTabbarItemClick}
        selected={activeView === ShopView.Payment}
        data-story="messages"
        indicator={
          productCount ? (
            <Counter size="s" mode="prominent">
              {productCount}
            </Counter>
          ) : undefined
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
