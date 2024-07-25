import { FC, memo, useEffect, useRef, useState } from 'react'
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router'
import { ImageBackgroundAppereance } from 'src/types'
import cx from 'classnames'

import './ProductPhoto.css'

export type ProductPhotoProps = {
  url: string
  appearence: ImageBackgroundAppereance
}

enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Square = 'square',
}

/** Компонент для отображения фотографии в галерее */
export const ProductPhoto: FC<ProductPhotoProps> = memo(
  ({ url, appearence }: ProductPhotoProps) => {
    const [orientation, setOrientation] = useState<Orientation | undefined>(
      undefined
    )
    const { panel } = useActiveVkuiLocation()
    const $photo = useRef<HTMLImageElement>(null)
    const initialPanel = useRef(panel)

    /** Загружаем фото и определяем его ориентацию в пространстве для правильного растягивания по вертикали/горизонали */
    useEffect(() => {
      if (!$photo.current) return
      const photo = $photo.current
      const onImageLoad = () => {
        if (photo.height > photo.width) setOrientation(Orientation.Vertical)
        else if (photo.height < photo.width)
          setOrientation(Orientation.Horizontal)
        else setOrientation(Orientation.Square)
      }
      photo.addEventListener('load', onImageLoad)

      if (panel !== initialPanel.current)
        photo.removeEventListener('load', onImageLoad)

      return () => {
        photo.removeEventListener('load', onImageLoad)
      }
    }, [url, panel])

    return (
      <div className={`ProductPhoto Back__${appearence}`}>
        <picture className="ProductPhoto_picture">
          <source srcSet={url + '.webp'} type="image/webp"></source>
          <img
            ref={$photo}
            src={url + '.png'}
            className={cx('ProductPhoto_photo', {
              ProductPhoto_photo__loaded: orientation,
              ProductPhoto_photo__square: orientation === Orientation.Square,
              ProductPhoto_photo__vertical:
                orientation === Orientation.Vertical,
              ProductPhoto_photo__horizontal:
                orientation === Orientation.Horizontal,
            })}
          />
        </picture>
      </div>
    )
  }
)

ProductPhoto.displayName = 'ProductPhoto'
