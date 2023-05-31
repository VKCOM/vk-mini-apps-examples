import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { CategoryCard, Navbar, PageHeader } from 'src/components'
import { NavIdProps, Panel } from '@vkontakte/vkui'
import { CATEGORIES_TEST } from 'src/config'
import { ViewingPanel } from 'src/routes'

import './CategoryList.css'

export const CategoryList: React.FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable header={<PageHeader header="Категории" />} />
      <div className="CategoryList">
        <div className="CategoryList_grid">
          {CATEGORIES_TEST.map((item) => {
            return (
              <CategoryCard
                productCount={item.productCount}
                name={item.name}
                key={item.id}
                onClick={() => routeNavigator.push(`/${ViewingPanel.Store}`)}
              />
            )
          })}
        </div>
      </div>
    </Panel>
  )
}
