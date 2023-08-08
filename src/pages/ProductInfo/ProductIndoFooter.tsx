import { FC, memo, useCallback, useLayoutEffect, useState } from 'react'
import { Button } from '@vkontakte/vkui'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { addCartItem } from 'src/store/shoppingCart.reducer'
import { PaymentPanel } from 'src/routes'
import cx from 'classnames'
import { Counter } from 'src/components'
import { Product } from 'src/types'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'src/store'

import './ProductInfo.css'

export type PriceDisplayProps = {
  isScrollPresent: boolean
  isProductFetched: boolean
  productId: number
  product: Product
}

let ProductInfoFooter: FC<PriceDisplayProps> = ({
  isProductFetched,
  isScrollPresent,
  productId,
  product,
}) => {
  const dispatch = useDispatch()
  const routeNavigator = useRouteNavigator()
  const [isProductInCart, setIsProductInCart] = useState(false)
  const [numItemsToBuy, setNumItemsToBuy] = useState(1)

  const { orderProducts } = useAppSelector((state) => state.shoppingCart)

  const addToShoppingCart = useCallback(() => {
    if (isProductFetched && !isProductInCart)
      dispatch(addCartItem({ ...product }))
    else routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
  }, [
    isProductInCart,
    routeNavigator,
    isProductFetched,
    product,
    dispatch,
  ])

  // Проверка находится ли карта в корзине
  useLayoutEffect(() => {
    if (!productId) return
    setIsProductInCart(orderProducts.some((item) => item.id === productId))
  }, [orderProducts, productId])

  return (
    <div
      className={cx('ProductInfo_footer', {
        ProductInfo_footer__scroll: isScrollPresent,
      })}
    >
      <Button stretched size="l" mode="primary" onClick={addToShoppingCart}>
        {!isProductInCart ? 'В корзину' : 'Посмотреть в корзине'}
      </Button>

      {!isProductInCart && (
        <Counter
          value={numItemsToBuy}
          maxValue={isProductFetched ? product.maxAvailable : 1}
          onAdd={() => setNumItemsToBuy((value) => value + 1)}
          onSubtract={() => setNumItemsToBuy((value) => value - 1)}
        />
      )}
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
ProductInfoFooter = memo(ProductInfoFooter)
export { ProductInfoFooter }
