export const tabs = ['Basic', 'Check', 'Compare', 'Pattern'] as const

type Tab = typeof tabs[number] | string & {}

class HubState {
  tab: Tab = $state(tabs[0])

  setTab(tab: Tab) {
    this.tab = tab
  }
}

export const hubState = new HubState()