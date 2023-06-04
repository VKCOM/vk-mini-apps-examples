import React from 'react'
import { Filters } from 'src/components'
import { Icon24Dismiss } from '@vkontakte/icons'
import { Group, ModalPage, ModalPageHeader, NavIdProps } from '@vkontakte/vkui'
import { useAppSelector } from 'src/store'

const FiltersModal: React.FC<NavIdProps & { onClose: () => void }> = (
  props
) => {
  const { filters, categories } = useAppSelector((state) => state.app)
  return (
    <ModalPage
      {...props}
      header={
        <ModalPageHeader
          after={<Icon24Dismiss fill="#818C99" onClick={props.onClose} />}
        >
          Фильтры
        </ModalPageHeader>
      }
    >
      <Group>
        <Filters
          defaultFilter={filters}
          minPrice={1000}
          maxPrice={10000}
          categories={categories}
        />
      </Group>
    </ModalPage>
  )
}

export { FiltersModal }
