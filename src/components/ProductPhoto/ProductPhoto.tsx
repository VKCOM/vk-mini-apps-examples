import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import './ProductPhoto.css'

export type ProductPhotoProps = {
  photo: string
}

enum Orientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Square = 'square',
}

let ProductPhoto: React.FC<ProductPhotoProps> = ({ photo }) => {
  const [orientation, setOrientation] = useState<undefined | Orientation>(
    undefined
  )

  useEffect(() => {
    const image = new Image()
    image.src = photo
    image.onload = () => {
      if (image.width > image.height) setOrientation(Orientation.Horizontal)
      else if (image.width < image.height) setOrientation(Orientation.Vertical)
      else setOrientation(Orientation.Square)
    }
  }, [photo])

  return (
    <div className={cx('ProductPhoto', { ProductPhoto__upload: orientation })}>
      {orientation && orientation !== Orientation.Square && (
        <img
          src={photo}
          className={cx('ProductPhoto_back', {
            ProductPhoto_back__vertical: orientation === Orientation.Vertical,
            ProductPhoto_back__horizontal:
              orientation === Orientation.Horizontal,
          })}
        />
      )}

      {orientation && (
        <img
          src={photo}
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

ProductPhoto = React.memo(ProductPhoto)
export { ProductPhoto }
