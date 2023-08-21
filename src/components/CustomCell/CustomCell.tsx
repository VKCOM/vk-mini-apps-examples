import { FC, memo } from 'react'
import cx from 'classnames'
import { Tappable } from '@vkontakte/vkui'

import './CustomCell.css'

export type CustomCellProps = {
  active: boolean
  content: string
} & React.HtmlHTMLAttributes<HTMLDivElement>

/** Блок категории в фильтрах */
let CustomCell: FC<CustomCellProps> = ({ active, content, ...props }) => {
  return (
    <Tappable>
      <div
        {...props}
        className={cx('CustomCell', { CustomCell__active: active })}
      >
        <div className="CustomCell_content">{content}</div>
      </div>
    </Tappable>
  )
}

CustomCell = memo(CustomCell)
export { CustomCell }
