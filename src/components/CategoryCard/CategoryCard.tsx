import { FC, memo } from 'react'
import { Card } from '@vkontakte/vkui'
import { formatWordByNumber } from 'src/utils/formatByNumbers'

import './CategoryCard.css'

export type CategoryCardProps = {
  name: string
  productCount: number
  preview?: string
}

let CategoryCard: FC<
  CategoryCardProps & React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ name, productCount, ...props }) => {
  return (
    <Card className="CategoryCard" {...props}>
      <div className="CategoryCard_info">
        <div className="CategoryCard_name">{name}</div>
        <div className="CategoryCard_counter">
          {productCount}{' '}
          {formatWordByNumber(productCount, 'товар', 'товара', 'товаров')}
        </div>
      </div>
    </Card>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CategoryCard = memo(CategoryCard)
export { CategoryCard }
