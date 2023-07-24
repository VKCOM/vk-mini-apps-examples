import { FC, memo, useCallback, useEffect, useState } from 'react'
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

let CartItem: FC<OrderProduct> = ({
  id,
  name,
  price,
  preview,
  maxAvailable,
  numItemsToBuy,
}) => {
  // Получаем функцию для отправки данных в store
  const dispatch = useAppDispatch()
  // Объект для навигации по приложению
  const routeNavigator = useRouteNavigator()

  const [isPreviewLoad, setIsPreviewLoad] = useState(false)
  const [itemNumber, setItemNumber] = useState(numItemsToBuy)

  const onCancelClick = useCallback(
    (e: React.MouseEvent) => {
      // Удаляем карточку по id в корзине
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

  const onPreviewLoad = useCallback(() => setIsPreviewLoad(true), [])

  /** Обновление товара в store при изменении количества */
  useEffect(() => {
    dispatch(updateCartItem({ id, numItemsToBuy: itemNumber }))
  }, [id, itemNumber, dispatch])

  return (
    <div onClick={onItemClick} className="CartItem">
      <div
        className={cx('CartItem_preview', {
          CartItem_preview__unload: !isPreviewLoad,
        })}
      >
        <img onLoad={onPreviewLoad} src={preview} />
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

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CartItem = memo(CartItem)
export { CartItem }
