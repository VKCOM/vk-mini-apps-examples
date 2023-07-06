import React, { useCallback } from 'react'
import {
  Header,
  IconButton,
  Link,
} from '@vkontakte/vkui'
import { Icon20ChevronRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { CategoryCardProps } from 'src/components'
import { CategoriesRow } from './CategoriesRow'
import { ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters } from 'src/store/app.reducer'
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme'

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
    [routeNavigator, filters, dispatch]
  )

  const onArrowClick = useCallback(() => {
    routeNavigator.push(`/${ViewingPanel.CategoryList}`)
  }, [routeNavigator])

  const onLinkClick = useCallback(() => {
    dispatch(setProductFilters({}))
    routeNavigator.push(`/${ViewingPanel.Store}`)
  }, [routeNavigator, dispatch])

  return (
    <div className="Categories">
      <Header
        indicator={categories.length}
        subtitle={<Link onClick={onLinkClick}>Показать все товары</Link>}
        aside={
          <IconButton aria-label="categories" onClick={onArrowClick}>
            <Icon20ChevronRightOutline
              fill={baseTheme.colorPanelHeaderIcon.active.value}
            />
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

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Categories = React.memo(Categories)
export { Categories }
