import React, { useCallback, useRef } from 'react'
import { PriceRangeInput } from 'src/components'
import { Icon24Dismiss } from '@vkontakte/icons'
import {
  selectPriceTo,
  selectPriceFrom,
  setFiltersPriceRange,
} from 'src/store/app.reducer'
import {
  Button,
  Div,
  Group,
  ModalPage,
  ModalPageHeader,
  NavIdProps,
  Separator,
} from '@vkontakte/vkui'
import { useAppSelector } from 'src/store'
import { useDispatch } from 'react-redux'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

let FiltersModal: React.FC<NavIdProps & { onClose: () => void }> = (props) => {
  const defaultPriceTo = useAppSelector(selectPriceTo)
  const defaultPriceFrom = useAppSelector(selectPriceFrom)
  const routeNavigator = useRouteNavigator()
  const dispatch = useDispatch()

  const priceToRef = useRef<number | undefined>(undefined)
  const priceFromRef = useRef<number | undefined>(undefined)

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
