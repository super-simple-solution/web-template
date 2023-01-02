import Cookies from 'js-cookie'
const TokenKey = 'bus_admin_token'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// TODO
export function toLogin() {
  // location.href = location.href
  // location.href =  'xxxx'
}

//  TODO
export function toHome() {
  // location.href =
}
