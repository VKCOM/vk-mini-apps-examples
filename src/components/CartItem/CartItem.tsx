import React, { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { IconButton } from '@vkontakte/vkui'
import { Icon24Cancel } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ViewingPanel } from 'src/routes'
import { Counter, PriceDisplay } from 'src/components'
import { OrderProduct } from 'src/types'
import { useAppDispatch } from 'src/store'
import { deleteCartItem, updateCartItem } from 'src/store/shoppingCart.reducer'

import './CartItem.css'

let CartItem: React.FC<OrderProduct> = ({
  id,
  name,
  price,
  preview,
  maxAvailable,
  productNumber,
}) => {
  const dispatch = useAppDispatch()
  const routeNavigator = useRouteNavigator()
  const [isPreviewLoad, setIsPreviewLoad] = useState(false)
  const [itemNumber, setItemNumber] = useState(productNumber)

  const onCancelClick = useCallback(
    (e: React.MouseEvent) => {
      dispatch(deleteCartItem(id))
      e.stopPropagation()
    },
    [dispatch, id]
  )

  const onItemClick = useCallback(() => {
    routeNavigator.push(`/${ViewingPanel.ProductInfo}?id=${id}`)
  }, [id, routeNavigator])

  const onSubstract = useCallback((e: React.MouseEvent) => {
    setItemNumber((itemNumber) => itemNumber - 1)
    e.stopPropagation()
  }, [])

  const onAdd = useCallback((e: React.MouseEvent) => {
    setItemNumber((itemNumber) => itemNumber + 1)
    e.stopPropagation()
  }, [])

  /** Обновление товара в store при изменении количества */
  useEffect(() => {
    dispatch(updateCartItem({ id, productNumber: itemNumber }))
  }, [id, itemNumber, dispatch])

  return (
    <div onClick={onItemClick} className="CartItem">
      <div
        className={cx('CartItem_preview', {
          CartItem_preview__unload: !isPreviewLoad,
        })}
      >
        <img onLoad={() => setIsPreviewLoad(true)} src={preview} />
      </div>

      <div className="CartItem_info">
        <div className="CartItem_info_name">{name}</div>

        <PriceDisplay
          price={price * itemNumber}
          className="CartItem_info_price"
        />

        <div className="CartItem_info_controller">
          <div className="CartItem_info_controller_iconButton">
            <IconButton onClick={onCancelClick} aria-label="cancel">
              <Icon24Cancel fill="#99A2AD" />
            </IconButton>
          </div>
          <Counter
            maxValue={maxAvailable}
            value={itemNumber}
            onSubtract={onSubstract}
            onAdd={onAdd}
          />
        </div>
      </div>
    </div>
  )
}

CartItem = React.memo(CartItem)
export { CartItem }
