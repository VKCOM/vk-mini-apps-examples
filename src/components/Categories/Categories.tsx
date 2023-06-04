import React, { useCallback } from 'react'
import { Header, IconButton, Link } from '@vkontakte/vkui'
import { Icon20ChevronRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { CategoryCardProps } from 'src/components'
import { CategoriesRow } from './CategoriesRow'
import { ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters } from 'src/store/app'

import './Categories.css'

export type CategoriesProps = {
  categories: Array<CategoryCardProps & { id: number }>
}

let Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.app)

  const onItemClick = useCallback(
    (id: number) => {
      dispatch(setProductFilters({ ...filters, categoryId: id.toString() }))
      routeNavigator.push(`/${ViewingPanel.Store}`)
    },
    [dispatch, routeNavigator, filters]
  )

  const onHeaderClick = useCallback(() => {
    routeNavigator.push(`/${ViewingPanel.CategoryList}`)
  }, [routeNavigator])

  return (
    <div className="Categories">
      <Header
        indicator={12}
        subtitle={<Link onClick={onHeaderClick}>Показать все</Link>}
        aside={
          <IconButton aria-label="categories" onClick={onHeaderClick}>
            <Icon20ChevronRightOutline fill="#2688EB" />
          </IconButton>
        }
        size="large"
      >
        Категории
      </Header>

      <div className="Categories_horizontalScroll">
        <div className="Categories_horizontalScroll_wrapper">
          <CategoriesRow
            onItemClick={onItemClick}
            categories={categories.slice(0, categories.length / 2)}
          />

          <CategoriesRow
            onItemClick={onItemClick}
            categories={categories.slice(categories.length / 2)}
          />
        </div>
      </div>
    </div>
  )
}

Categories = React.memo(Categories)
export { Categories }
