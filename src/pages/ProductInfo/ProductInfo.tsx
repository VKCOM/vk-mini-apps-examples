import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { Button, Gallery, Panel, Separator } from '@vkontakte/vkui'
import { Counter, Navbar, PageHeader, ProductPhoto } from 'src/components'

import './ProductInfo.css'

type ProductInfoProps = {
  nav?: string
  id?: string
}

export const ProductInfo: React.FC<ProductInfoProps> = (props) => {
  const $ref = useRef<HTMLDivElement>(null)
  const [isScroll, setIsScroll] = useState(false)

  useEffect(() => {
    if ($ref.current)
      setIsScroll($ref.current.clientHeight < $ref.current.scrollHeight)
  }, [])

  return (
    <Panel className="Panel__fullScreen" {...props}>
      <Navbar searchDisable header={<PageHeader header="Товар" />} />
      <div ref={$ref} className="ProductInfo">
        <Gallery
          align="center"
          className="ProductInfo_gallery"
          bullets="light"
          showArrows
        >
          <ProductPhoto
            photo={
              'https://i.pinimg.com/originals/ea/c9/9e/eac99eeea3794800100e845238f44c86.jpg'
            }
          />
          <ProductPhoto
            photo={
              'https://steamuserimages-a.akamaihd.net/ugc/950724071151650207/C0CE74DE977DC265528FB162D48D3D3D84F486C6/?imw=512&amp;imh=288&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true'
            }
          />
          <ProductPhoto
            photo={
              'https://s1.1zoom.ru/big7/803/USA_Skyscrapers_New_York_444936.jpg'
            }
          />
          <ProductPhoto
            photo={
              'https://pibig.info/uploads/posts/2021-05/1622404896_21-pibig_info-p-priroda-dlya-insti-priroda-krasivo-foto-23.jpg'
            }
          />
        </Gallery>

        <div className="ProductInfo_offer">
          <div className="ProductInfo_offer_title">Футболка</div>
          <div className="ProductInfo_offer_price">1 222₽</div>
        </div>

        <Separator />

        <div className="ProductInfo_description">
          Предзаказ номер один: MGS - Metal Gear Solid. Художником арта выступил
          Влад Здор. Вы просили и ждали, когда же мы сделаем принт по MGS,
          культовой игре Хидео Кодзимы. Сказано - сделано. Если данный принт
          будет пользоваться успехом, сделаем и по Rising. Цена по предзаказу -
          1450р, после предзаказа - 1500. Предзаказ номер один: MGS - Metal Gear
          Solid. Художником арта выступил Влад Здор. Вы просили и ждали, когда
          же мы сделаем принт по MGS, культовой игре Хидео Кодзимы. Сказано -
          сделано. Если данный принт будет пользоваться успехом, сделаем и по
          Rising. Цена по предзаказу - 1450р, после предзаказа - 1500.
        </div>

        <div
          className={cx('ProductInfo_footer', {
            ProductInfo_footer__scroll: isScroll,
          })}
        >
          <Button stretched size="l" mode="secondary">
            Добавить в корзину
          </Button>
          <Counter
            maxValue={12}
            onSubtract={() => null}
            onAdd={() => null}
            defaultValue={1}
          />
        </div>
      </div>
    </Panel>
  )
}
