import { FiltersModal } from './FiltersModal'
import { ModalRoot } from '@vkontakte/vkui'
import React from 'react'
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from '@vkontakte/vk-mini-app-router'
import { StorePanelModal } from 'src/routes'
import { OnboardingModal } from './OnboardingModal'

const Modals: React.FC = () => {
  const { modal } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()
  return (
    <ModalRoot activeModal={modal} onClose={() => null}>
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
