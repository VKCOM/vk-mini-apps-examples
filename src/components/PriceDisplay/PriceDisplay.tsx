import React from 'react'

import './PriceDisplay.css'

export type PriceDisplayProps = {
  price: number
}

let PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => {
  const thousandsCount = Math.floor(price / 1000)
  const priceRemainder = price % 1000
  return (
    <div className="PriceDisplay">
      {thousandsCount > 0 && (
        <span className="PriceDisplay_name">
          {thousandsCount.toString()}
          <span>&thinsp;</span>
        </span>
      )}

      {priceRemainder.toString().padEnd(3, '0')}
      <span className="PriceDisplay_name">&thinsp;</span>
      {'₽'}
    </div>
  )
}

PriceDisplay = React.memo(PriceDisplay)
export { PriceDisplay }
