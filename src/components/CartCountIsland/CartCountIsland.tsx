import { FC, memo, useCallback, useMemo } from 'react'
import { Cell, Group } from '@vkontakte/vkui'
import {
  Icon28ShoppingCartOutline,
  Icon24ChevronCompactRight,
} from '@vkontakte/icons'
import { PaymentPanel } from 'src/routes'
import { selectShoppingCart } from 'src/store/shoppingCart.reducer'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useAppSelector } from 'src/store'
import { formatWordByNumber } from 'src/utils'
import { PriceDisplay } from 'src/components'

export type CartCountIslandProps = Record<string, never>

let CartCountIsland: FC = () => {
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

  const onCounterClick = useCallback(() => {
    routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
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
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CartCountIsland = memo(CartCountIsland)
export { CartCountIsland }
