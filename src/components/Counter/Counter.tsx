import { FC, memo, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { Icon16Add, Icon16Minus } from '@vkontakte/icons'
import { IconButton } from '@vkontakte/vkui'
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme'

import './Counter.css'

export type CounterProps = {
  defaultValue: number
  minValue?: number
  maxValue?: number
  onChange: (value: number) => void
}

/** Счетчик количества выбранных товаров */
export const Counter: FC<CounterProps> = memo(
  ({ defaultValue, maxValue, minValue, onChange }: CounterProps) => {
    const [value, setValue] = useState(defaultValue)
    const iconColor = baseTheme.colorIconAccent.normal.value

    const onCounterClick = (e: React.MouseEvent) => e.stopPropagation()
    const onSubstract = useCallback(() => {
      setValue((value) => value - 1)
    }, [])

    const onAdd = useCallback(() => {
      setValue(value => value + 1)
    }, [])

    /** При изменении значения счетчика вызываем callback на изменение */
    useEffect(() => {
      onChange(value)
    }, [value, onChange])

    return (
      <div onClick={onCounterClick} className="Counter">
        <div
          className={cx('Counter_button', {
            Counter_button__disable: value === minValue,
          })}
        >
          <IconButton onClick={onSubstract} aria-label="add">
            <Icon16Minus fill={iconColor}/>
          </IconButton>
        </div>

        <div>{value}</div>

        <div
          className={cx('Counter_button', {
            Counter_button__disable: value === maxValue,
          })}
        >
          <IconButton onClick={onAdd} aria-label="remove">
            <Icon16Add fill={iconColor} />
          </IconButton>
        </div>
      </div>
    )
  }
)

Counter.displayName = 'Counter'
