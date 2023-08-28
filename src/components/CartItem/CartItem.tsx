import { FC, memo, useCallback } from 'react'
import { Icon24DeleteOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { OrderProduct } from 'src/types'
import { ShopPanel } from 'src/routes'
import { Counter, PriceDisplay } from 'src/components'
import { useAppDispatch } from 'src/store'
import { deleteCartItem, updateCartItem } from 'src/store/shoppingCart.reducer'

import './CartItem.css'

/** Блок товара в корзине */
export const CartItem: FC<OrderProduct> = memo(
  ({
    id,
    name,
    back,
    price,
    preview,
    maxAvailable,
    numItemsToBuy,
  }: OrderProduct) => {
    const dispatch = useAppDispatch()
    const routeNavigator = useRouteNavigator()

    /** Удаляем товар из корзины */
    const onCancelClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(deleteCartItem(id))
      },
      [dispatch, id]
    )

    /** При изменении количества выбранных товаров, обновляем цену и количество товаров */
    const onCounterChange = useCallback(
      (value: number) => dispatch(updateCartItem({ id, numItemsToBuy: value })),
      [id, dispatch]
    )

    /** При клике переходим на страницу товара */
    const onItemClick = () => {
      const params = `id=${id}&name=${name}&price=${price}&back=${back}`
      routeNavigator.push(`/${ShopPanel.ProductInfo}?${params}`)
    }

    /** При загрузке изображения убираем класс-заглушку */
    const onPreviewLoad = (
      e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
      const el = e.target as HTMLElement
      el.classList.remove('CartItem_preview_image__unload')
    }

    return (
      <div onClick={onItemClick} className="CartItem">
        <div className="CartItem_preview">
          <picture>
            <source srcSet={preview + '.webp'} type="image/webp"></source>
            <img
              className="CartItem_preview_image CartItem_preview_image__unload"
              onLoad={onPreviewLoad}
              src={preview + '.png'}
              alt=""
              width={120}
              height={120}
            />
          </picture>
        </div>

        <div className="CartItem_info">
          <div>
            <PriceDisplay
              price={price * numItemsToBuy}
              className="CartItem_info_price"
            />
            <div className="CartItem_info_name">{name}</div>
          </div>

          <div className="CartItem_info_controller">
            <Counter
              maxValue={maxAvailable}
              defaultValue={numItemsToBuy}
              minValue={1}
              onChange={onCounterChange}
            />

            <div
              onClick={onCancelClick}
              className="CartItem_info_controller_deleteButton"
            >
              <Icon24DeleteOutline />
              <div className="CartItem_info_controller_deleteButton_text">
                Удалить
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CartItem.displayName = 'CartItem'
