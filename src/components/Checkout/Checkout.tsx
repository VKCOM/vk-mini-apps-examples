import { FC, memo } from 'react'
import {
  Button,
  FormItem,
  Input,
  Separator,
  useAdaptivityWithJSMediaQueries,
} from '@vkontakte/vkui'
import { PriceDisplay } from 'src/components'

import './Checkout.css'

export type CheckoutProps = {
  totalPrice: number
  promocode: string
  onConfirmPayClick: () => void
  onPromocodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/** Блок для оформления заказа */
export const Checkout: FC<CheckoutProps> = memo(
  ({
    promocode,
    totalPrice,
    onConfirmPayClick,
    onPromocodeChange,
  }: CheckoutProps) => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries()

    const subtotal = (
      <div className="Checkout_subtotal_price">
        <div className="Checkout_subtotal_price_title">Итого</div>
        <PriceDisplay
          price={totalPrice}
          className="Checkout_subtotal_price_counter"
        />
      </div>
    )

    return (
      <div className="Checkout">
        {!totalPrice && !isDesktop && <Separator />}
        <div className="Checkout_subtotal">
          {isDesktop && subtotal}

          {isDesktop && (
            <Input
              onChange={onPromocodeChange}
              value={promocode}
              type="text"
              placeholder="Промокод"
            />
          )}
          {!isDesktop && (
            <FormItem top="Промокод">
              <Input
                type="text"
                value={promocode}
                onChange={onPromocodeChange}
                placeholder="Введите промокод"
              />
            </FormItem>
          )}
        </div>
        <div className="Checkout_confirmPay">
          {!isDesktop && subtotal}

          <Button
            size="l"
            disabled={totalPrice === 0}
            onClick={onConfirmPayClick}
            stretched={isDesktop}
          >
            К оформлению
          </Button>
        </div>
      </div>
    )
  }
)

Checkout.displayName = 'Checkout'
