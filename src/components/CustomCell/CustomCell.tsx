import { FC, memo } from 'react'
import cx from 'classnames'

import './CustomCell.css'

export type CustomCellProps = {
  active: boolean
  content: string
} & React.HtmlHTMLAttributes<HTMLDivElement>

let CustomCell: FC<CustomCellProps> = ({ active, content, ...props }) => {
  return (
    <div
      {...props}
      className={cx('CustomCell', { CustomCell__active: active })}
    >
      <div className="CustomCell_content">{content}</div>
    </div>
  )
}

CustomCell = memo(CustomCell)
export { CustomCell }
