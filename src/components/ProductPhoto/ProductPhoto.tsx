import { FC, memo, useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import './ProductPhoto.css'
import { ImageBackgroundAppereance } from '@/types'
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'

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
  const [orientation, setOrientation] = useState<undefined | Orientation>(
    undefined
  )
  const { panel } = useActiveVkuiLocation()
  const initialPanel = useRef(panel)

  /** Загружаем фото и определяем его ориентацию в пространстве для правильного растягивания по вертикали/горизонали */
  useEffect(() => {
    const image = new Image()
    image.src = url
    const onImageLoad = () => {
      if (image.width > image.height) setOrientation(Orientation.Horizontal)
      else if (image.width < image.height) setOrientation(Orientation.Vertical)
      else setOrientation(Orientation.Square)
    }
    image.addEventListener('load', onImageLoad)

    if (panel !== initialPanel.current)
      image.removeEventListener('load', onImageLoad)

    return () => {
      image.removeEventListener('load', onImageLoad)
    }
  }, [url, panel])

  return (
    <div className={cx('ProductPhoto', `ProductPhoto__${appearence}`)}>
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
