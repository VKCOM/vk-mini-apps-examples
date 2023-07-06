import React from 'react'
import { CategoryCard, CategoryCardProps } from '../CategoryCard/CategoryCard'

import './Categories.css'

type CategoriesRowProps = {
  categories: Array<CategoryCardProps & { id: number }>
  onItemClick: (id: number) => void
}

let CategoriesRow: React.FC<CategoriesRowProps> = ({
  categories,
  onItemClick,
}) => {
  return (
    <div className="Categories_horizontalScroll_row">
      {categories.map((item) => (
        <CategoryCard
          key={item.id}
          productCount={item.productCount}
          name={item.name}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CategoriesRow = React.memo(CategoriesRow)
export { CategoriesRow }
