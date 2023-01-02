import request from '@/utils/request'

const path = {
  logout: 'sys/logout',
  userInfo: 'sys/userinfo',
}

export function getUserInfo(...paramsRest: any[]): Promise<any> {
  return request.post(path.userInfo, ...paramsRest)
}

export function logout(...paramsRest: any[]): Promise<any> {
  return request.post(path.logout, ...paramsRest)
}
