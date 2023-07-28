import { FC, memo, useCallback } from 'react'
import { Header, IconButton } from '@vkontakte/vkui'
import { Icon20ChevronRightOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { CategoryCardProps } from 'src/components'
import { CategoriesRow } from './CategoriesRow'
import { ViewingPanel } from 'src/routes'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setProductFilters, appInitialState } from 'src/store/app.reducer'
/** Импортируем цветовую тему из vk-ui токенов */
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme'

import './Categories.css'

export type CategoriesProps = {
  categories: Array<CategoryCardProps & { id: number }>
}

let Categories: FC<CategoriesProps> = ({ categories }) => {
  // Получаем функцию для отправки данных в store
  const dispatch = useAppDispatch()
  // Получаем объект для навигации по приложению
  const routeNavigator = useRouteNavigator()
  // Подписываемся на изменения в состоянии
  const { filters } = useAppSelector((state) => state.app)

  const onItemClick = useCallback(
    (id: number) => {
      // Обновляем фильтры при переходе на конкретную категорию
      dispatch(setProductFilters({ ...filters, categoryId: id.toString() }))
      // Затем переходим на страницу каталога с сохранением в историю переходов
      routeNavigator.push(`/${ViewingPanel.Store}`)
    },
    [routeNavigator, filters, dispatch]
  )

  const onArrowClick = useCallback(() => {
    // Обнуляем фильтры
    dispatch(setProductFilters(appInitialState.filters))
    // Совершаем переход в каталог с сохранением в историю переходов
    routeNavigator.push(`/${ViewingPanel.Store}`)
  }, [routeNavigator, dispatch])

  return (
    <div className="Categories">
      <Header
        indicator={categories.length}
        aside={
          <IconButton aria-label="categories" onClick={onArrowClick}>
            <Icon20ChevronRightOutline
              // Используем значение vk-ui переменной для задания цвета иконке
              // При смене темы в ВК иконка автоматически поменяет свой цвет
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
Categories = memo(Categories)
export { Categories }
