import { FC, memo } from 'react'

import './PriceDisplay.css'

/**
 * Функция разбивает строку на подстроки через каждые every символов начиная с конца
 * @param string - исходная строка
 * @param every - максимальная длина подстрок
 * @returns массив строк
 */
function splitArrayFromEnd(string: string, every: number) {
  const splitString = string.split('')
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

let PriceDisplay: FC<
  PriceDisplayProps & React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ price, currency = '₽', ...props }) => {
  const pricebyNumber = price.toString()

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

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
PriceDisplay = memo(PriceDisplay)
export { PriceDisplay }
