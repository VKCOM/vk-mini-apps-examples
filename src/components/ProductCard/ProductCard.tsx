import { FC, memo, useState } from 'react'
import cx from 'classnames'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Button } from '@vkontakte/vkui'
import { PriceDisplay } from 'src/components'
import { ProductPreview } from 'src/types'
import { PaymentPanel, ViewingPanel } from 'src/routes'
import { useAppDispatch } from 'src/store'
import { addCartItem } from 'src/store/shoppingCart.reducer'

import './ProductCard.css'

const MAX_PRODUCT_CARD_SIZE = 195

export type ProductCardProps = ProductPreview & {
  isInCart: boolean
}

let ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  preview,
  isInCart,
  maxAvailable,
  ...props
}) => {
  const [isPreviewLoad, setIsPreviewLoad] = useState(false)
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()

  const onCardClick = () => {
    routeNavigator.push(`/${ViewingPanel.ProductInfo}?id=${id}`)
  }

  const onButtonClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    if (isInCart) routeNavigator.push(`/${PaymentPanel.ShoppingCart}`)
    else dispatch(addCartItem({ id, name, price, preview, maxAvailable }))
  }

  const onProductPreviewLoad = () => setIsPreviewLoad(true)

  return (
    <div
      onClick={onCardClick}
      className={cx('ProductCard', {
        ProductCard__active: isPreviewLoad,
      })}
      {...props}
    >
      <div className="ProductCard_preview">
        <picture className="ProductCard_preview_picture">
          <source srcSet={preview + '.webp'} type="image/webp"></source>
          <img
            src={preview + '.png'}
            alt=""
            width={MAX_PRODUCT_CARD_SIZE}
            height={MAX_PRODUCT_CARD_SIZE}
            onLoad={onProductPreviewLoad}
            className={cx('ProductCard_preview_picture_photo', {
              ProductCard_preview_picture_photo__unload: !isPreviewLoad,
            })}
          />
        </picture>
      </div>

      <div className="ProductCard_bottom">
        <div className="ProductCard_info">
          <PriceDisplay className="ProductCard_price" price={price} />
          <div className="ProductCard_title">{name}</div>
        </div>
        <Button
          onClick={onButtonClick}
          size="m"
          mode={isInCart ? 'outline' : 'secondary'}
        >
          {isInCart ? 'В корзине' : 'В корзину'}
        </Button>
      </div>
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
ProductCard = memo(ProductCard)
export { ProductCard }
