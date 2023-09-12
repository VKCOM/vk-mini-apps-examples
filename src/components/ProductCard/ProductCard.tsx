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

/** Компонент карточки продукта */
export const ProductCard: FC<ProductCardProps> = memo(
  ({
    id,
    name,
    back,
    price,
    preview,
    isInCart,
    maxAvailable,
    ...props
  }: ProductCardProps) => {
    const routeNavigator = useRouteNavigator()
    const $card = useRef<HTMLDivElement>(null)

    /** При клике на карту переходим на страницу товара */
    const onCardClick = () => {
      const params = `id=${id}&name=${name}&price=${price}&back=${back}`
      routeNavigator.push(`/${ShopPanel.ProductInfo}?${params}`)
    }

    /** При загрузке фотографии убираем класс заглушку */
    const onProductPreviewLoad = (
      e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      const el = e.target as HTMLElement
      el.classList.remove('ProductCard_preview_picture_photo__unload')
      if ($card.current) $card.current.classList.add('ProductCard__active')
    }

    const product = useMemo(() => {
      return { id, name, back, price, preview, maxAvailable }
    }, [id, name, back, price, preview, maxAvailable])

    return (
      <div onClick={onCardClick} className="ProductCard" ref={$card} {...props}>
        <div className="ProductCard_preview">
          <picture className="ProductCard_preview_picture">
            <source srcSet="" type="image/webp"></source>
            <img
              src=""
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
)

ProductCard.displayName = 'ProductCard'
