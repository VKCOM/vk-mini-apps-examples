import { FC, memo, useCallback, useRef } from 'react'
import {
  ActionSheet,
  Search,
  SubnavigationBar,
  SubnavigationButton,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { Icon24Filter } from '@vkontakte/icons'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  selectCategories,
  selectFilters,
  setFiltersCategory,
  setFiltersPriceRange,
  setFiltersQuery,
} from 'src/store/app.reducer'
import { CustomCell, PriceRangeInput } from 'src/components'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme'

import './Filters.css'

const TIMEOUT = 150

export const Filters: FC = memo(() => {
  const dispatch = useAppDispatch()
  const routeNavigator = useRouteNavigator()
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const categories = useAppSelector(selectCategories)
  const { priceTo, priceFrom, categoryId, query } =
    useAppSelector(selectFilters)

  const $priceFilter = useRef<SVGSVGElement>(null)
  const timerId = useRef<NodeJS.Timeout | undefined>(undefined)
  const iconColor =
    priceFrom || priceTo ? baseTheme.colorPanelHeaderIcon.active.value : ''

  /** При клике на категорию, обновляем категорию в state */
  const onCategoryClick = (id: string) => {
    dispatch(setFiltersCategory(id))
  }

  /** При клике на иконку фильтров открываем ActionSheet на desktop или открываем модальную страницу  */
  const onSearchIconClick = useCallback(() => {
    const onCloseActionSheet = () => routeNavigator.hidePopout()
    const changePriceRange = (priceFrom?: number, priceTo?: number) => {
      if (priceFrom && priceFrom < 0) return
      if (priceTo && priceTo < 0) return
      dispatch(setFiltersPriceRange({ priceTo, priceFrom }))
    }

    if (isDesktop)
      routeNavigator.showPopout(
        <ActionSheet
          toggleRef={$priceFilter.current}
          onClose={onCloseActionSheet}
        >
          <PriceRangeInput
            defaultPriceFrom={priceFrom}
            defaultPriceTo={priceTo}
            onPriceChange={changePriceRange}
          />
        </ActionSheet>
      )
    else routeNavigator.showModal('filter')
  }, [routeNavigator, isDesktop, priceFrom, priceTo, dispatch])

  /** При изменении строки ввода, обновляем фильтры в state с ипользованием Таймера */
  const onQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (timerId.current) clearTimeout(timerId.current)
      timerId.current = setTimeout(
        () => dispatch(setFiltersQuery(e.target.value)),
        TIMEOUT
      )
    },
    [dispatch]
  )

  return (
    <div className="Filters">
      <Search
        icon={
          <Icon24Filter
            fill={iconColor}
            getRootRef={$priceFilter}
            onClick={onSearchIconClick}
          />
        }
        iconAriaLabel="filter"
        defaultValue={query}
        onChange={onQueryChange}
      />
      {isDesktop && <div className="Filters_title">Каталог</div>}
      {isDesktop &&
        categories.map((category) => (
          <CustomCell
            key={category.id}
            content={category.name}
            active={categoryId === category.id.toString()}
            onClick={() => onCategoryClick(category.id.toString())}
          />
        ))}

      {!isDesktop && (
        <SubnavigationBar>
          {categories.map((category) => (
            <SubnavigationButton
              selected={categoryId === category.id.toString()}
              onClick={() => onCategoryClick(category.id.toString())}
              key={category.id}
            >
              {category.name}
            </SubnavigationButton>
          ))}
        </SubnavigationBar>
      )}
    </div>
  )
})

Filters.displayName = 'Filters'
