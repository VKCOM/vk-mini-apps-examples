import React, { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { IconButton } from '@vkontakte/vkui'
import { Icon24Cancel } from '@vkontakte/icons'
import { Counter } from 'src/components'
import { OrderProduct } from 'src/types'
import { useAppDispatch } from 'src/store'
import { deleteCartItem, updateCartItem } from 'src/store/app'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { ViewingPanel } from 'src/routes'

import './CartItem.css'

export type CartItemProps = Omit<OrderProduct, 'productType'>

let CartItem: React.FC<CartItemProps> = ({
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

  useEffect(() => {
    dispatch(updateCartItem({ id, productNumber: itemNumber }))
  }, [itemNumber, dispatch, id])

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
        <div className="CartItem_info_price">{price * itemNumber} ₽</div>

        <div className="CartItem_info_controller">
          <IconButton onClick={onCancelClick} aria-label="cancel">
            <Icon24Cancel fill="#99A2AD" />
          </IconButton>
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
