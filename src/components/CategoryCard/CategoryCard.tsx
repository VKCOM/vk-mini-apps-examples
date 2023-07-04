import React from 'react'
import { Card } from '@vkontakte/vkui'
import { formatWordByNumber } from 'src/utils/formatByNumbers'

import './CategoryCard.css'

export type CategoryCardProps = {
  name: string
  productCount: number
  preview?: string
}

let CategoryCard: React.FC<
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

CategoryCard = React.memo(CategoryCard)
export { CategoryCard }
