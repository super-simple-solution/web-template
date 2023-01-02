import { defineStore } from 'pinia'

interface State {
  routes: string[]
  basePath: string
}

export const useChildRouteStore = defineStore('router', {
  state: (): State => ({
    routes: [],
    basePath: '',
  }),
  getters: {
    hasRoute: (state): boolean => {
      return !!state.routes.length
    },
  },
  actions: {
    setRoutes(payload: State): void {
      this.routes = payload.routes
      this.basePath = payload.basePath
    },
  },
})
