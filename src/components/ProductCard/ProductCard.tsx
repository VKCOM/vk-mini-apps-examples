import { FC, memo, useCallback, useRef, useState } from 'react'
import cx from 'classnames'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { Card } from '@vkontakte/vkui'
import { PriceDisplay } from 'src/components'
import { ViewingPanel } from 'src/routes'
import { ProductPreview } from 'src/types'

import './ProductCard.css'

export type ProductCardProps = Omit<ProductPreview, 'maxAvailable'>

let ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  preview,
  ...props
}) => {
  // Объект для навигации по приложению
  const routeNavigator = useRouteNavigator()
  const { panel } = useActiveVkuiLocation()
  const initialPanel = useRef(panel)
  const [isPreviewLoad, setIsPreviewLoad] = useState(false)

  const onProductCardClick = useCallback(() => {
    routeNavigator.push(`/${ViewingPanel.ProductInfo}?id=${id}`)
  }, [routeNavigator, id])

  const onProductPreviewLoad = useCallback(() => {
    if (panel === initialPanel.current)
      setIsPreviewLoad(true)
  }, [panel])

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
        <PriceDisplay className="ProductCard_price" price={price} />
      </div>
    </Card>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
ProductCard = memo(ProductCard)
export { ProductCard }
