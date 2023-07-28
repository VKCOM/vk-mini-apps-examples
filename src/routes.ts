import {
  RoutesConfig,
  createHashRouter,
  createModal,
  createPanel,
  createRoot,
  createView,
} from '@vkontakte/vk-mini-apps-router'

const SHOP_ROOT = 'shop'
export const INITIAL_URL = '/'

export enum ShopView {
  Payment = 'payment',
  Viewing = 'viewing',
}

export enum PaymentPanel {
  ShoppingCart = 'shoppingCart',
}

export enum ViewingPanel {
  CategoryList = 'categoryList',
  ProductInfo = 'productInfo',
  Store = 'store',
  Main = 'main',
}

export enum StorePanelModal {
  Filters = 'filters',
}

/** Настройка типизированной конфигурации маршрутов */
export const routes = RoutesConfig.create([
  createRoot(SHOP_ROOT, [
    createView(ShopView.Viewing, [
      createPanel(ViewingPanel.Main, '/', []),
      createPanel(ViewingPanel.Store, `/${ViewingPanel.Store}`, [
        createModal(
          StorePanelModal.Filters,
          `/${ViewingPanel.Store}/${StorePanelModal.Filters}`
        ),
      ]),
      createPanel(ViewingPanel.ProductInfo, `/${ViewingPanel.ProductInfo}`, []),
    ]),

    createView(ShopView.Payment, [
      createPanel(
        PaymentPanel.ShoppingCart,
        `/${PaymentPanel.ShoppingCart}`,
        []
      ),
    ]),
  ]),
])

/** Передача массива маршрутов для создания роутера */
export const router = createHashRouter(routes.getRoutes())
