import React from 'react'
import { Card, Input } from '@vkontakte/vkui'

import './Subtotal.css'

export type SubtotalProps = Record<string, never>

let Subtotal: React.FC<SubtotalProps> = () => {
  return (
    <Card>
      <div className="Subtotal">
        <div className="Subtotal_price">
          <div className="Sutotal_price_title">Итого</div>
          <div className="Sutotal_price_counter">199 ₽</div>
        </div>
        <Input type="text" placeholder="Промокод" />
      </div>
    </Card>
  )
}

Subtotal = React.memo(Subtotal)
export { Subtotal }
