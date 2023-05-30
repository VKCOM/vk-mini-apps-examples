import React from 'react'
import { Card } from '@vkontakte/vkui'
import { Icon28StickerOutline } from '@vkontakte/icons'
import { formatWordByNumber } from 'src/utils/formatByNumbers'

import './CategoryCard.css'

export type CategoryCardProps = {
  name: string
  productCount: number
  preview?: string
}

let CategoryCard: React.FC<
  CategoryCardProps & React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ name, productCount, preview, ...props }) => {
  return (
    <Card {...props} className="CategoryCard">
      <div className="CategoryCard_info">
        <div className="CategoryCard_name">{name}</div>
        <div className="CategoryCard_counter">
          {productCount}{' '}
          {formatWordByNumber(productCount, 'товар', 'товара', 'товаров')}
        </div>
      </div>

      <div className="CategoryCard_preview">
        {preview && <img src={preview}></img>}
        {!preview && <Icon28StickerOutline fill="2688EB" />}
      </div>
    </Card>
  )
}

CategoryCard = React.memo(CategoryCard)
export { CategoryCard }
