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
      <IconButton
        onClick={onSubtract}
        aria-label="add"
        className={cx('Counter_button', {
          Counter_button__disable: value === 1,
        })}
      >
        <Icon16Minus />
      </IconButton>
      <div>{value}</div>
      <IconButton
        className={cx('Counter_button', {
          Counter_button__disable: value === maxValue,
        })}
        onClick={onAdd}
        aria-label="remove"
      >
        <Icon16Add />
      </IconButton>
    </div>
  )
}

Counter = React.memo(Counter)
export { Counter }
