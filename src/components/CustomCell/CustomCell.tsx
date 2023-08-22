import { FC, memo } from 'react'
import cx from 'classnames'

import './CustomCell.css'

export type CustomCellProps = {
  active: boolean
  content: string
} & React.HtmlHTMLAttributes<HTMLDivElement>

/** Блок категории в фильтрах */
export const CustomCell: FC<CustomCellProps> = memo(
  ({ active, content, ...props }: CustomCellProps) => {
    return (
      <div
        {...props}
        className={cx('CustomCell', { CustomCell__active: active })}
      >
        <div className="CustomCell_content">{content}</div>
      </div>
    )
  }
)

CustomCell.displayName = 'CustomCell'
