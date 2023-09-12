import { FC, memo, useCallback, useRef } from 'react'
import {
  FormItem,
  FormLayoutGroup,
  Input,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'

import './PriceRangeInput.css'

export type PriceRangeInputProps = {
  defaultPriceFrom?: number
  defaultPriceTo?: number
  onPriceChange: (priceFrom?: number, priceTo?: number) => void
}

/** Компонент для выставления границ цен */
export const PriceRangeInput: FC<PriceRangeInputProps> = memo(
  ({
    defaultPriceFrom,
    defaultPriceTo,
    onPriceChange,
  }: PriceRangeInputProps) => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries()
    const $priceFromInput = useRef<HTMLInputElement>(null)
    const $priceToInput = useRef<HTMLInputElement>(null)

    /** Callback на изменение цены */
    const onInputChange = useCallback(() => {
      const priceFromInput = $priceFromInput.current
      const priceToInput = $priceToInput.current
      if (!priceFromInput || !priceToInput) return

      const priceToValue = Number(priceToInput.value)
      const priceFromValue = Number(priceFromInput.value)

      const priceTo = priceToValue ? priceToValue : undefined
      const priceFrom = priceFromValue ? priceFromValue : undefined
      onPriceChange(priceFrom, priceTo)
    }, [onPriceChange])

    return (
      <div className="PriceRangeInput">
        <FormLayoutGroup mode="horizontal" segmented={isDesktop}>
          <FormItem htmlFor="priceRangeInput" top="Цена, ₽">
            <Input
              type="number"
              getRef={$priceFromInput}
              defaultValue={defaultPriceFrom}
              placeholder="От"
              onChange={onInputChange}
            />
          </FormItem>
          <FormItem>
            <FormItem htmlFor="priceRangeInput">
              <Input
                type="number"
                getRef={$priceToInput}
                defaultValue={defaultPriceTo}
                placeholder="До"
                onChange={onInputChange}
              />
            </FormItem>
          </FormItem>
        </FormLayoutGroup>
      </div>
    )
  }
)

PriceRangeInput.displayName = 'PriceRangeInput'
