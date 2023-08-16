import { FC, memo, useMemo, useRef } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { AddToCartButton, PriceDisplay } from 'src/components'
import { ProductPreview } from 'src/types'
import { ShopPanel } from 'src/routes'

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
  const routeNavigator = useRouteNavigator()
  const $card = useRef<HTMLDivElement>(null)

  const onCardClick = () => {
    routeNavigator.push(
      `/${ShopPanel.ProductInfo}?id=${id}&name=${name}&price=${price}`
    )
  }

  const onProductPreviewLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const el = e.target as HTMLElement
    el.classList.remove('ProductCard_preview_picture_photo__unload')
    if ($card.current) $card.current.classList.add('ProductCard__active')
  }

  const product = useMemo(() => {
    return { id, name, price, preview, isInCart, maxAvailable }
  }, [id, name, price, preview, isInCart, maxAvailable])

  return (
    <div
      onClick={onCardClick}
      className="ProductCard"
      ref={$card}
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
            className="ProductCard_preview_picture_photo ProductCard_preview_picture_photo__unload"
            onLoad={onProductPreviewLoad}
          />
        </picture>
      </div>

      <div className="ProductCard_bottom">
        <div className="ProductCard_info">
          <PriceDisplay className="ProductCard_price" price={price} />
          <div className="ProductCard_title">{name}</div>
        </div>
        <AddToCartButton size="m" product={product} isInCart={isInCart} />
      </div>
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
ProductCard = memo(ProductCard)
export { ProductCard }
