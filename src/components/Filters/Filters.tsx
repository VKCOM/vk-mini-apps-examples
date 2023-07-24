import { FC, memo, useCallback, useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  FormItem,
  RangeSlider,
  Select,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { setProductFilters } from 'src/store/app.reducer'
import { CategoryCardProps } from 'src/components'
import { useAppDispatch } from 'src/store'
import { ProductFilter } from 'src/types'

import './Filters.css'

export type FiltersProps = {
  categories: Array<CategoryCardProps & { id: number }>
  maxPrice: number
  minPrice: number
  defaultFilter: ProductFilter
}

let Filters: FC<FiltersProps> = ({
  categories,
  maxPrice,
  minPrice,
  defaultFilter,
}) => {
  // Получаем функцию для отправки данных в store
  const dispatch = useAppDispatch()
  // Узнаем десктопный ли размер экрана
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  // Объект для навигации в приложении
  const routeNavigator = useRouteNavigator()

  /** Удаляем поле query из фильтров, так как оно меняется в src/components/Navbar.tsx */
  const [filters, setFilters] = useState<Omit<ProductFilter, 'query'>>({
    priceTo: defaultFilter.priceTo ?? maxPrice,
    priceFrom: defaultFilter.priceFrom ?? minPrice,
    categoryId: defaultFilter.categoryId,
  })
  const [prevFilters, setPrevFilters] = useState({ ...filters })
  const [isFilterChange, setIsFilterChange] = useState(false)

  const onHandleSliderChange = useCallback(
    (e: [number, number]) => {
      setFilters({
        ...filters,
        priceFrom: e[0],
        priceTo: e[1],
      })
    },
    [filters]
  )

  const onHandleSelectorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === '' ? undefined : e.target.value
      setFilters({
        ...filters,
        categoryId: value,
      })
    },
    [filters]
  )

  const onShowProductButtonClick = useCallback(() => {
    setPrevFilters({ ...filters })
    const newFilters = Object.assign({ ...defaultFilter }, { ...filters })
    dispatch(setProductFilters(newFilters))
    if (!isDesktop) setTimeout(() => routeNavigator.back(), 350)
  }, [filters, isDesktop, routeNavigator, defaultFilter, dispatch])

  /** Сравнение новых фильтров с предыдущими */
  useEffect(() => {
    let isChange = false
    let key: keyof Omit<ProductFilter, 'query'>
    for (key in prevFilters) {
      isChange = prevFilters[key] !== filters[key]
      if (isChange) break
    }
    setIsFilterChange(isChange)
  }, [filters, prevFilters])

  /** Переопределение цены с initialValue на ненулевые значения, после ответа сервера*/
  useEffect(() => {
    if (maxPrice && !filters.priceTo)
      setFilters({ ...filters, priceFrom: minPrice, priceTo: maxPrice })
  }, [minPrice, maxPrice, filters])

  return (
    <div className="Filters">
      <FormItem top="Категория">
        <Select
          onChange={onHandleSelectorChange}
          value={filters.categoryId}
          placeholder="Не выбран"
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </FormItem>

      <FormItem top="Цена">
        {maxPrice && (
          <RangeSlider
            onChange={onHandleSliderChange}
            min={minPrice}
            max={maxPrice}
            step={250}
            value={[filters.priceFrom ?? minPrice, filters.priceTo ?? maxPrice]}
          />
        )}
        <div className="Filters_prices">
          <div className="Filters_prices_boundary">{filters.priceFrom}₽</div>
          <div className="Filters_prices_boundary">{filters.priceTo}₽</div>
        </div>
      </FormItem>

      <FormItem>
        <Button
          stretched
          size="l"
          mode="primary"
          disabled={!isFilterChange}
          onClick={onShowProductButtonClick}
        >
          Показать товары
        </Button>
      </FormItem>
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Filters = memo(Filters)
export { Filters }
