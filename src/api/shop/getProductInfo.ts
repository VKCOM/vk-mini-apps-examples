import { Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetProductInfoRequest {
  productId: number
}
interface GetProductInfoResponse {
  data: Product
}

/** Данные для страницы "ProductInfo" */
export const getProductInfo = async ({
  productId,
}: GetProductInfoRequest): Promise<GetProductInfoResponse> => {
  const data = await makeRequest<GetProductInfoResponse>({
    path: 'photos',
    params: {
      id: productId.toString(),
    },
    requestOptions: {
      method: 'get',
    },
  })
  return {
    data: {
      id: Number(productId),
      name: 'Maxmara TJ collection',
      productType: 'футболка',
      maxAvailable: 3,
      price: 2990,
      description: `Предзаказ номер один: MGS - Metal Gear Solid. Художником арта выступил
      Влад Здор. Вы просили и ждали, когда же мы сделаем принт по MGS,
      культовой игре Хидео Кодзимы. Сказано - сделано. Если данный принт
      будет пользоваться успехом, сделаем и по Rising. Цена по предзаказу -
      1450р, после предзаказа - 1500. Предзаказ номер один: MGS - Metal Gear
      Solid. Художником арта выступил Влад Здор. Вы просили и ждали, когда
      же мы сделаем принт по MGS, культовой игре Хидео Кодзимы. Сказано -
      сделано. Если данный принт будет пользоваться успехом, сделаем и по
      Rising. Цена по предзаказу - 1450р, после предзаказа - 1500.`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      photos: [data.data[0].url, data.data[0].thumbnailUrl],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      preview: data.data[0].url,
      categoryId: [12],
    },
  }
}
