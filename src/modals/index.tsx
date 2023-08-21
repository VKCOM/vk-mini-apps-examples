import { FiltersModal } from './FiltersModal'
import { ModalRoot } from '@vkontakte/vkui'
import React from 'react'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import { OnboardingModal } from './OnboardingModal'

const Modals: React.FC = () => {
  const { modal } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()

  return (
    // ModalRoot - контейнер для модальных страниц и карточек
    // activeModal - текущая открытая модальная страница | undefind
    <ModalRoot activeModal={modal}>
      <FiltersModal onClose={() => routeNavigator.hideModal()} id="filter" />
      <OnboardingModal
        onClose={() => routeNavigator.hideModal()}
        id="onboarding"
      />
    </ModalRoot>
  )
}

export { Modals }
