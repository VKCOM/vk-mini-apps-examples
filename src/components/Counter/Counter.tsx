import React from 'react'
import { Icon16Add, Icon16Minus } from '@vkontakte/icons'
import { IconButton } from '@vkontakte/vkui'

import './Counter.css'

export type CounterProps = {
  defaultValue: number
  maxValue: number
  onSubtract: () => void
  onAdd: () => void
}

let Counter: React.FC<CounterProps> = ({ defaultValue, onAdd, onSubtract }) => {
  return (
    <div className="Counter">
      <IconButton
        onClick={onSubtract}
        aria-label="add"
        className="Counter_button"
      >
        <Icon16Minus />
      </IconButton>
      <div>{defaultValue}</div>
      <IconButton onClick={onAdd} aria-label="remove">
        <Icon16Add className="Counter_button" />
      </IconButton>
    </div>
  )
}

Counter = React.memo(Counter)
export { Counter }
