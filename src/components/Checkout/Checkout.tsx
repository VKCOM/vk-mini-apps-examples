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
  onConfirmPayClick: () => void
}

let Checkout: FC<CheckoutProps> = ({ totalPrice, onConfirmPayClick }) => {
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

        {isDesktop && <Input type="text" placeholder="Промокод" />}
        {!isDesktop && (
          <FormItem top="Промокод">
            <Input type="text" placeholder="Введите промокод" />
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

Checkout = memo(Checkout)
export { Checkout }
