import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Card } from '@vkontakte/vkui'
import { PriceDisplay } from 'src/components'
import { ViewingPanel } from 'src/routes'
import { ProductPreview } from 'src/types'

import './ProductCard.css'

export type ProductCardProps = Omit<ProductPreview, 'maxAvailable'>

let ProductCard: React.FC<ProductCardProps> = ({
  id,
  preview,
  price,
  name,
  ...props
}) => {
  const [isPreviewLoad, setIsPreviewLoad] = useState(false)
  const routeNavigator = useRouteNavigator()

  const onProductCardClick = useCallback(() => {
    routeNavigator.push(`/${ViewingPanel.ProductInfo}?id=${id}`)
  }, [routeNavigator, id])

  const onProductPreviewLoad = useCallback(() => setIsPreviewLoad(true), [])

  return (
    <Card
      onClick={onProductCardClick}
      className={cx('ProductCard', {
        ProductCard__active: isPreviewLoad,
      })}
      {...props}
    >
      <div
        className={cx('ProductCard_preview', {
          ProductCard_preview__unload: !isPreviewLoad,
        })}
      >
        <img src={preview} onLoad={onProductPreviewLoad} />
      </div>

      <div className="ProductCard_info">
        <div className="ProductCard_title">{name}</div>
        <PriceDisplay price={price} />
      </div>
    </Card>
  )
}

ProductCard = React.memo(ProductCard)
export { ProductCard }
