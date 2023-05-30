import React from 'react'
import { CategoryCard, Navbar, PageHeader } from 'src/components'
import { Panel } from '@vkontakte/vkui'

import './CategoryList.css'

type CategoryListProps = {
  nav?: string
  id?: string
}

const testArray = [
  {
    id: 1,
    name: 'Крабы и вино',
    productCount: 12,
  },
  {
    id: 2,
    name: 'Молоко и рыба',
    productCount: 12,
  },
  {
    id: 3,
    name: 'Качаны капусты',
    productCount: 1,
  },
  {
    id: 4,
    name: 'Автомобили и мотоциклы',
    productCount: 1,
  },
]

export const CategoryList: React.FC<CategoryListProps> = (props) => {
  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable header={<PageHeader header="Категории" />} />
      <div className="CategoryList">
        <div className="CategoryList_grid">
          {testArray.map((item) => {
            return (
              <CategoryCard
                productCount={item.productCount}
                name={item.name}
                key={item.id}
              />
            )
          })}
        </div>
      </div>
    </Panel>
  )
}
