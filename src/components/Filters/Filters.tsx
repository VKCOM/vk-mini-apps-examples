import React, { useCallback, useEffect, useState } from 'react'
import { Button, FormItem, RangeSlider, Select } from '@vkontakte/vkui'
import { CategoryCardProps } from 'src/components'
import { ProductFilter } from 'src/types'

import './Filters.css'

export type FiltersProps = {
  categories: Array<CategoryCardProps & { id: number }>
  maxPrice: number
  minPrice: number
  defaultFilter: ProductFilter
}

let Filters: React.FC<FiltersProps> = ({
  categories,
  maxPrice,
  minPrice,
  defaultFilter,
}) => {
  const [isFilterChange, setIsFilterChange] = useState(false)
  const [filters, setFilters] = useState<Omit<ProductFilter, 'query'>>({
    priceTo: defaultFilter.priceTo ?? maxPrice,
    priceFrom: defaultFilter.priceFrom ?? minPrice,
    categoryId: defaultFilter.categoryId,
  })
  const [prevFilters] = useState({ ...filters })

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

  // Проверка фильтров на наличие изменений
  useEffect(() => {
    let isChange = false
    let key: keyof Omit<ProductFilter, 'query'>
    for (key in prevFilters) {
      isChange = prevFilters[key] !== filters[key]
      if (isChange) break
    }
    setIsFilterChange(isChange)
  }, [filters, prevFilters])

  return (
    <div className="Filters">
      <FormItem top="Категория">
        <Select
          onChange={onHandleSelectorChange}
          placeholder="Не выбран"
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </FormItem>

      <FormItem top="Цена">
        <RangeSlider
          onChange={onHandleSliderChange}
          min={minPrice}
          max={maxPrice}
          step={500}
          defaultValue={[
            prevFilters.priceFrom ?? minPrice,
            prevFilters.priceTo ?? maxPrice,
          ]}
        />
        <div className="Filters_prices">
          <div className="Filters_prices_boundary">{filters.priceFrom}₽</div>
          <div className="Filters_prices_boundary">{filters.priceTo}₽</div>
        </div>
      </FormItem>

      <FormItem>
        <Button disabled={!isFilterChange} stretched size="l" mode="primary">
          Показать товары
        </Button>
      </FormItem>
    </div>
  )
}

Filters = React.memo(Filters)
export { Filters }
