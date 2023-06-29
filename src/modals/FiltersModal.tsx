import React from 'react'
import { Filters } from 'src/components'
import { Icon24Dismiss } from '@vkontakte/icons'
import {
  Group,
  ModalPage,
  ModalPageHeader,
  NavIdProps,
  Separator,
} from '@vkontakte/vkui'
import { useAppSelector } from 'src/store'

let FiltersModal: React.FC<NavIdProps & { onClose: () => void }> = (props) => {
  const filters = useAppSelector((state) => state.app.filters)
  const categories = useAppSelector((state) => state.app.categories)
  const minPrice = useAppSelector((state) => state.app.shopInfo.minPrice)
  const maxPrice = useAppSelector((state) => state.app.shopInfo.maxPrice)

  return (
    <ModalPage
      {...props}
      dynamicContentHeight
      header={
        <ModalPageHeader
          after={<Icon24Dismiss fill="#818C99" onClick={props.onClose} />}
        >
          Фильтры
        </ModalPageHeader>
      }
    >
      <Separator />
      <Group>
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          defaultFilter={filters}
          categories={categories}
        />
      </Group>
    </ModalPage>
  )
}

FiltersModal = React.memo(FiltersModal)
export { FiltersModal }
