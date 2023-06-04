import React, { useCallback, useEffect } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { CategoryCard, Navbar, PageHeader } from 'src/components'
import { NavIdProps, Panel } from '@vkontakte/vkui'
import { ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  setCategories,
  setProductFilters,
} from 'src/store/app'
import { getUserId } from 'src/utils'
import * as api from 'src/api'

import './CategoryList.css'

export const CategoryList: React.FC<NavIdProps> = (props) => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()
  const { categories, filters } = useAppSelector((state) => state.app)
  const onCategoryCardClick = useCallback(
    (id: number) => {
      dispatch(setProductFilters({ ...filters, categoryId: id.toString() }))
      routeNavigator.push(`/${ViewingPanel.Store}`)
    },
    [dispatch, routeNavigator, filters]
  )

  useEffect(() => {
    api.user.get({ userId: Number(getUserId()) }).then((res) => {
      dispatch(setCategories(res.categories))
    })
  }, [dispatch])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable header={<PageHeader header="Категории" />} />
      <div className="CategoryList">
        <div className="CategoryList_grid">
          {categories.map((item) => {
            return (
              <CategoryCard
                productCount={item.productCount}
                name={item.name}
                key={item.id}
                onClick={() => onCategoryCardClick(item.id)}
              />
            )
          })}
        </div>
      </div>
    </Panel>
  )
}
