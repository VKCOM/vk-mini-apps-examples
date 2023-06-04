import { Category, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetUserRequest {
  userId: number
}

interface GetUserResponse {
  categories: Category[]
  products: Product[]
}

export const get = async ({
  userId,
}: GetUserRequest): Promise<GetUserResponse> => {
  const data = await makeRequest<GetUserResponse>({
    path: 'photos?_limit=10',
    params: {
      userId: userId.toString(),
    },
    requestOptions: {
      method: 'get',
    },
  })

  //? замоканные данные(на время пока нет реалного сервера)
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Unreachable code error
    products: data.data.map((item) => ({
      id: Number(item.id),
      name: 'Maxmara TJ collection',
      productType: 'футболка',
      maxAvailable: 3,
      price: 123,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      preview: item.url,
    })),
    categories: [
      {
        id: 1,
        name: 'Крабы и вино',
        productCount: 12,
      },
      {
        id: 2,
        name: 'Молоко и рыба',
        productCount: 12,
      },
      {
        id: 3,
        name: 'Качаны капусты',
        productCount: 1,
      },
      {
        id: 4,
        name: 'Автомобили и мотоциклы',
        productCount: 1,
      },
    ],
  }

  return data
}
