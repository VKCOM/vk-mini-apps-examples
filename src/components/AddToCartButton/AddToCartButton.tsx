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

/** Компонент кнопки для добавления товара в корзину */
export const AddToCartButton: FC<AddToCartButtonProps> = memo(
  ({ isInCart, product, defaultMode, ...props }: AddToCartButtonProps) => {
    const dispatch = useAppDispatch()
    const routeNavigator = useRouteNavigator()

    /** При наличии товара в корзине переходим в корзину, иначе просто добавляем товар в корзину */
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
)

AddToCartButton.displayName = 'AddToCartButton'
