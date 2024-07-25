import { FC, memo, useCallback, useMemo } from 'react'
import { Cell, Group } from '@vkontakte/vkui'
import {
  Icon28ShoppingCartOutline,
  Icon24ChevronCompactRight,
} from '@vkontakte/icons'
import { ShopPanel } from 'src/routes'
import { selectShoppingCart } from 'src/store/shoppingCart.reducer'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useAppSelector } from 'src/store'
import { formatWordByNumber } from 'src/utils'
import { PriceDisplay } from 'src/components'

/** Остров в Desktop версии для отображении информации о корзине */
export const CartCountIsland: FC = memo(() => {
  const routeNavigator = useRouteNavigator()
  const shoppingCart = useAppSelector(selectShoppingCart)
  const productCount = shoppingCart.orderProducts.length

  const title = useMemo(() => {
    const noun = formatWordByNumber(productCount, 'товар', 'товара', 'товаров')
    return productCount
      ? `${productCount} ${noun} в корзине`
      : 'В корзине ничего нет'
  }, [productCount])

  const subtitle = useMemo(
    () => <PriceDisplay prevText="на " price={shoppingCart.totalPrice} />,
    [shoppingCart.totalPrice]
  )

  /** При клике на остров переходим на страницу корзины */
  const onCounterClick = useCallback(() => {
    routeNavigator.push(`/${ShopPanel.ShoppingCart}`)
  }, [routeNavigator])

  return (
    <Group separator="hide">
      <Cell
        before={<Icon28ShoppingCartOutline />}
        after={<Icon24ChevronCompactRight />}
        onClick={onCounterClick}
        subtitle={shoppingCart.totalPrice ? subtitle : undefined}
      >
        {title}
      </Cell>
    </Group>
  )
})

CartCountIsland.displayName = 'CartCountIsland'
