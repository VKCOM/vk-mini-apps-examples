import React from 'react'
import { Input } from '@vkontakte/vkui'
import { PriceDisplay } from 'src/components'

import './Subtotal.css'

export type SubtotalProps = {
  totalPrice: number
}

let Subtotal: React.FC<SubtotalProps> = ({ totalPrice }) => {
  return (
    <div className="Subtotal">
      <div className="Subtotal_price">
        <div className="Subtotal_price_title">Итого</div>
        <PriceDisplay price={totalPrice} className="Subtotal_price_counter" />
      </div>
      <Input type="text" placeholder="Промокод" />
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Subtotal = React.memo(Subtotal)
export { Subtotal }
