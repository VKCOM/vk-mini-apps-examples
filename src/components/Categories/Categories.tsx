import React, { useCallback } from 'react'
import { Header, IconButton, Link } from '@vkontakte/vkui'
import { Icon20ChevronRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-app-router'
import { CategoryCardProps } from 'src/components'
import { CategoriesRow } from './CategoriesRow'

import './Categories.css'

export type CategoriesProps = {
  categories: Array<CategoryCardProps & { id: number }>
}

let Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const routeNavigator = useRouteNavigator()

  const onItemClick = useCallback(() => {
    routeNavigator.push('/store')
  }, [routeNavigator])

  return (
    <div className="Categories">
      <Header
        indicator={12}
        subtitle={
          <Link onClick={() => routeNavigator.push('/categoryList')}>
            Показать все
          </Link>
        }
        aside={
          <IconButton
            aria-label="categories"
            onClick={() => routeNavigator.push('/categoryList')}
          >
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
