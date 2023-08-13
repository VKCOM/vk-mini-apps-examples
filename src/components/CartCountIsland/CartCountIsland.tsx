import { FC, memo, useCallback } from 'react'
import './CartCountIsland.css'
import { Cell, Group } from '@vkontakte/vkui'
import {
  Icon28ShoppingCartOutline,
  Icon24ChevronCompactRight,
} from '@vkontakte/icons'

export type CartCountIslandProps = Record<string, never>

let CartCountIsland: FC = () => {
  const onCounterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <Group separator="hide">
      <Cell
        before={<Icon28ShoppingCartOutline />}
        after={<Icon24ChevronCompactRight />}
        subtitle={'На 3990'}
      >
        3 товара в корзине
      </Cell>
    </Group>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
CartCountIsland = memo(CartCountIsland)
export { CartCountIsland }
