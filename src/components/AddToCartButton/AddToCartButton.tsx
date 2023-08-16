import { useAppDispatch } from 'src/store'
import { Button, ButtonProps } from '@vkontakte/vkui'
import { FC, memo, useCallback } from 'react'
import { ProductPreview } from 'src/types'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ShopPanel } from 'src/routes'
import { addCartItem } from 'src/store/shoppingCart.reducer'

export type AddToCartButtonProps = {
  isInCart: boolean
  product: ProductPreview
  defaultMode?: ButtonProps['mode']
} & ButtonProps

let AddToCartButton: FC<AddToCartButtonProps> = ({
  isInCart,
  product,
  defaultMode,
  ...props
}) => {
  const dispatch = useAppDispatch()
  const routeNavigator = useRouteNavigator()

  const onButtonClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation()
      if (isInCart) routeNavigator.push(`/${ShopPanel.ShoppingCart}`)
      else dispatch(addCartItem(product))
    },
    [product, isInCart, routeNavigator, dispatch]
  )

  return (
    <Button
      onClick={onButtonClick}
      mode={isInCart ? 'outline' : defaultMode ?? 'secondary'}
      {...props}
    >
      {isInCart ? 'В корзине' : 'В корзину'}
    </Button>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
AddToCartButton = memo(AddToCartButton)
export { AddToCartButton }
