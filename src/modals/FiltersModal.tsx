import React, { useCallback, useRef } from 'react'
import { PriceRangeInput } from 'src/components'
import { Icon24Dismiss } from '@vkontakte/icons'
import {
  selectPriceTo,
  selectPriceFrom,
  setFiltersPriceRange,
} from 'src/store/app.reducer'
import {
  Div,
  Group,
  Button,
  ModalPage,
  Separator,
  NavIdProps,
  ModalPageHeader,
} from '@vkontakte/vkui'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

/** Модальная страница для показа PriceRangeInput в мобильной версии*/
let FiltersModal: React.FC<NavIdProps & { onClose: () => void }> = (props) => {
  const defaultPriceTo = useAppSelector(selectPriceTo)
  const defaultPriceFrom = useAppSelector(selectPriceFrom)
  const routeNavigator = useRouteNavigator()
  const dispatch = useAppDispatch()

  const priceToRef = useRef<number | undefined>(defaultPriceTo)
  const priceFromRef = useRef<number | undefined>(defaultPriceFrom)

  const onPriceChange = useCallback((priceFrom?: number, priceTo?: number) => {
    priceToRef.current = priceTo
    priceFromRef.current = priceFrom
  }, [])

  const onButtonClick = useCallback(() => {
    const priceTo = priceToRef.current
    const priceFrom = priceFromRef.current
    dispatch(setFiltersPriceRange({ priceTo, priceFrom }))
    setTimeout(() => routeNavigator.hideModal(), 300)
  }, [routeNavigator, dispatch])

  return (
    <ModalPage
      {...props}
      dynamicContentHeight
      header={
        <ModalPageHeader
          after={<Icon24Dismiss fill="#818C99" onClick={props.onClose} />}
        >
          Фильтр
        </ModalPageHeader>
      }
    >
      <Separator />
      <Group>
        <PriceRangeInput
          onPriceChange={onPriceChange}
          defaultPriceTo={defaultPriceTo}
          defaultPriceFrom={defaultPriceFrom}
        />
        <Div>
          <Button onClick={onButtonClick} size="l" stretched>
            Готово
          </Button>
        </Div>
      </Group>
    </ModalPage>
  )
}

FiltersModal = React.memo(FiltersModal)
export { FiltersModal }
