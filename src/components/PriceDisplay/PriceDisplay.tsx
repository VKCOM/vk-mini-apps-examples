import React from 'react'

import './PriceDisplay.css'

function splitArrayFromEnd(splitString: string[], every: number) {
  const res: string[] = []
  while (splitString.length) {
    const startIndex = splitString.length - every
    res.push(
      splitString.splice(startIndex > 0 ? startIndex : 0, every).join('')
    )
  }
  return res.reverse()
}

export type PriceDisplayProps = {
  price: number
  currency?: string
}

let PriceDisplay: React.FC<
  PriceDisplayProps & React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ price, currency = '₽', ...props }) => {
  const pricebyNumber = price.toString().split('')

  return (
    <div {...props}>
      {splitArrayFromEnd(pricebyNumber, 3).map((item, index) => (
        <span key={index}>
          {item}
          <span className="PriceDisplay_space">&thinsp;</span>
        </span>
      ))}
      {currency}
    </div>
  )
}

PriceDisplay = React.memo(PriceDisplay)
export { PriceDisplay }
