import { FiltersModal } from './FiltersModal'
import { ModalRoot } from '@vkontakte/vkui'
import React from 'react'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { StorePanelModal } from 'src/routes'
import { OnboardingModal } from './OnboardingModal'

const Modals: React.FC = () => {
  // Получаем активную модальную страницу
  const { modal } = useActiveVkuiLocation()
  // Получаем объект для навигации по приложению
  const routeNavigator = useRouteNavigator()

  return (
    // ModalRoot - контейнер для модальных страниц и карточек
    // activeModal - текущая открытая модальная страница | undefind
    <ModalRoot activeModal={modal}>
      <FiltersModal
        onClose={() => routeNavigator.hideModal()}
        nav={StorePanelModal.Filters}
      />
      <OnboardingModal
        onClose={() => routeNavigator.hideModal()}
        id="onboarding"
      />
    </ModalRoot>
  )
}

export { Modals }
