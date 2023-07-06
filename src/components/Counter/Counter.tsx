import React, { useCallback } from 'react'
import cx from 'classnames'
import { Icon16Add, Icon16Minus } from '@vkontakte/icons'
import { IconButton } from '@vkontakte/vkui'

import './Counter.css'

export type CounterProps = {
  value: number
  maxValue: number
  onAdd: (e: React.MouseEvent) => void
  onSubtract: (e: React.MouseEvent) => void
}

let Counter: React.FC<CounterProps> = ({
  value,
  maxValue,
  onAdd,
  onSubtract,
}) => {
  const onCounterClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <div onClick={onCounterClick} className="Counter">
      <div
        className={cx('Counter_button', {
          Counter_button__disable: value === 1,
        })}
      >
        <IconButton onClick={onSubtract} aria-label="add">
          <Icon16Minus />
        </IconButton>
      </div>

      <div>{value}</div>

      <div
        className={cx('Counter_button', {
          Counter_button__disable: value === maxValue,
        })}
      >
        <IconButton onClick={onAdd} aria-label="remove">
          <Icon16Add />
        </IconButton>
      </div>
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
Counter = React.memo(Counter)
export { Counter }
