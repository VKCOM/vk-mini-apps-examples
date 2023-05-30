import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import React, { useState } from 'react'
import { Card } from '@vkontakte/vkui'
import cx from 'classnames'
import { ViewingPanel } from 'src/routes'
import { Product } from 'src/types'

import './ProductCard.css'

export type ProductCardProps = Omit<
  Product,
  'id' | 'maxAvailable' | 'categoryId' | 'description'
>

let ProductCard: React.FC<ProductCardProps> = ({
  preview,
  price,
  name,
  productType,
  ...props
}) => {
  const [isPreviewLoad, setIsPreviewLoad] = useState(false)
  const routeNavigator = useRouteNavigator()

  return (
    <Card
      {...props}
      onClick={() => routeNavigator.push(`/${ViewingPanel.ProductInfo}`)}
      className={cx('ProductCard', {
        ProductCard__active: isPreviewLoad,
      })}
    >
      <div
        className={cx('ProductCard_preview', {
          ProductCard_preview__unload: !isPreviewLoad,
        })}
      >
        <img onLoad={() => setIsPreviewLoad(true)} src={preview} />
      </div>

      <div className="ProductCard_info">
        <div className="ProductCard_title">{productType}</div>
        <div className="ProductCard_title">{name}</div>
        <div className="ProductCard_price">{price.toString() + ' ₽'}</div>
      </div>
    </Card>
  )
}

ProductCard = React.memo(ProductCard)
export { ProductCard }
