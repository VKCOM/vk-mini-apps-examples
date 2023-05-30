import React from 'react'
import { Filters } from 'src/components'
import { Icon24Dismiss } from '@vkontakte/icons'
import { Group, ModalPage, ModalPageHeader, NavIdProps } from '@vkontakte/vkui'

const FiltersModal: React.FC<NavIdProps & { onClose: () => void }> = (
  props
) => {
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
          defaultFilter={{}}
          minPrice={1000}
          maxPrice={10000}
          categories={[]}
        />
      </Group>
    </ModalPage>
  )
}

export { FiltersModal }
