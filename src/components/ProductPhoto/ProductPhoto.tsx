import { FC, memo, useEffect, useState } from 'react'
import cx from 'classnames'

import './ProductPhoto.css'
import { ImageBackgroundAppereance } from '@/types'

export type ProductPhotoProps = {
  url: string
  appearence: ImageBackgroundAppereance
}

enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Square = 'square',
}

let ProductPhoto: FC<ProductPhotoProps> = ({ url, appearence }) => {
  const uploadClass = `ProductPhoto__${appearence}`
  const [orientation, setOrientation] = useState<undefined | Orientation>(
    undefined
  )

  /** Загружаем фото и определяем его ориентацию в пространстве для правильного растягивания по вертикали/горизонали */
  useEffect(() => {
    const image = new Image()
    console.log(url, 'lslalla')
    image.src = url
    const onImageLoad = () => {
      if (image.width > image.height) setOrientation(Orientation.Horizontal)
      else if (image.width < image.height) setOrientation(Orientation.Vertical)
      else setOrientation(Orientation.Square)
    }
    image.addEventListener('load', onImageLoad)

    return () => {
      image.removeEventListener('load', onImageLoad)
    }
  }, [url])

  return (
    <div className={cx('ProductPhoto', orientation ? uploadClass : '')}>
      {orientation && (
        <img
          src={url}
          className={cx('ProductPhoto_photo', {
            ProductPhoto_photo__vertical: orientation === Orientation.Vertical,
            ProductPhoto_photo__square: orientation === Orientation.Square,
            ProductPhoto_photo__horizontal:
              orientation === Orientation.Horizontal,
          })}
        />
      )}
    </div>
  )
}

/** React.memo - HOC, кэширующий результат выполнения функции, rerender компонента произойдет только при изменении props */
ProductPhoto = memo(ProductPhoto)
export { ProductPhoto }
