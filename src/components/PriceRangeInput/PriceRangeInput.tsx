import { FC, memo, useCallback, useRef } from 'react'
import { FormItem, FormLayoutGroup, Input, useAdaptivityWithJSMediaQueries } from '@vkontakte/vkui'

import './PriceRangeInput.css'

export type PriceRangeInputProps = {
  defaultPriceTo?: number
  defaultPriceFrom?: number
  onPriceChange: (priceFrom?: number, priceTo?: number) => void
}

let PriceRangeInput: FC<PriceRangeInputProps> = ({
  defaultPriceTo,
  defaultPriceFrom,
  onPriceChange,
}) => {
  const { isDesktop } = useAdaptivityWithJSMediaQueries()
  const $priceFromInput = useRef<HTMLInputElement>(null)
  const $priceToInput = useRef<HTMLInputElement>(null)

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
        <FormItem htmlFor="email" top="Цена, ₽">
          <Input
            getRef={$priceFromInput}
            defaultValue={defaultPriceFrom}
            placeholder="От"
            onChange={onInputChange}
          />
        </FormItem>
        <FormItem>
          <FormItem htmlFor="email">
            <Input
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

PriceRangeInput = memo(PriceRangeInput)
export { PriceRangeInput }
