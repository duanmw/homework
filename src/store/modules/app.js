// import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      // opened: !+Cookies.get('sidebarStatus'),
      opened: !+localStorage.getItem('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    fixedHeader: localStorage.getItem('fixedHeader') ? (!+localStorage.getItem('fixedHeader')) : false// !+'0'为true, !+'1'为false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        // Cookies.set('sidebarStatus', 1)
        localStorage.setItem('sidebarStatus', 1)
      } else {
        // Cookies.set('sidebarStatus', 0)
        localStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      // Cookies.set('sidebarStatus', 1)
      localStorage.setItem('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    TOGGLE_FIXEDHEAD: state => {
      state.fixedHeader = !state.fixedHeader
      if (state.fixedHeader) {
        localStorage.setItem('fixedHeader', 0)// 从localStorage读取值时 !+'0'为true
      } else {
        localStorage.setItem('fixedHeader', 1)// !+'1'为false
      }
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleFixedHeader({ commit }) {
      commit('TOGGLE_FIXEDHEAD')
    }
  }
}

export default app
