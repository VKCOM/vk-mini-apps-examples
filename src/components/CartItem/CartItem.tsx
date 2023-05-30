import React, { useState } from 'react'
import cx from 'classnames'
import { IconButton } from '@vkontakte/vkui'
import { Icon24Cancel } from '@vkontakte/icons'
import { Counter } from 'src/components'

import './CartItem.css'

export type CartItemProps = {
  id: number
  price: number
  preview: string
  productName: string
}

let CartItem: React.FC<CartItemProps> = ({ price, preview, productName }) => {
  const [isPreviewLoad, setIsPreviewLoad] = useState(false)

  return (
    <div className="CartItem">
      <div
        className={cx('CartItem_preview', {
          CartProduct_preview__unload: !isPreviewLoad,
        })}
      >
        <img onLoad={() => setIsPreviewLoad(true)} src={preview} />
      </div>

      <div className="CartItem_info">
        <div className="CartItem_info_name">{productName}</div>
        <div className="CartItem_info_price">{price} ₽</div>

        <div className="CartItem_info_controller">
          <IconButton aria-label="cancel">
            <Icon24Cancel fill="#99A2AD" />
          </IconButton>
          <Counter
            maxValue={2}
            defaultValue={3}
            onSubtract={() => null}
            onAdd={() => null}
          />
        </div>
      </div>
    </div>
  )
}

CartItem = React.memo(CartItem)
export { CartItem }
