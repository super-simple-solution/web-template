import { defineStore } from 'pinia'
import { getToken, removeToken, toLogin } from '@/utils/auth'
import { getUserInfo, logout } from '@/api/user'

interface State {
  token: string | undefined
  permissions: string[]
  permissionModules: string[]
  userInfo: any
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: getToken(),
    permissions: [],
    permissionModules: [],
    userInfo: {},
  }),
  getters: {
    getToken: (state: { token: any }): string | undefined => {
      return state.token || getToken()
    },
  },
  actions: {
    getUserInfo() {
      return getUserInfo({}).then((res: any) => {
        if (res) {
          const { user_roles, user_id, user_name, name } = res
          const userinfo = {
            user_roles,
            user_id,
            user_name,
            name,
          }
          this.userInfo = userinfo
        }
      })
    },
    setToken(token: string) {
      this.token = token
    },
    resetToken() {
      this.token = ''
      removeToken()
    },
    logout() {
      logout({}).then(() => {
        this.resetToken()
        toLogin()
      })
    },
  },
})
