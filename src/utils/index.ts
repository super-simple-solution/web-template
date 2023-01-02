export function parseScssVariable(str: string): object {
  const reg = /(\w+):\s*([^;]+);/g
  const matchRes = [...str.matchAll(reg)]
  const res: any = {}
  matchRes.forEach((item) => {
    res[item[1]] = item[2]
  })
  return res
}

export function toPascal(str: string) {
  return str.replace(/^(\w)/, (_, p1) => p1.toUpperCase())
}

export function pickParams(obj: { [x: string]: any }) {
  const res: { [key: string]: string } = {}
  for (const key in obj) {
    if (obj[key] || obj[key] === 0) {
      res[key] = obj[key]
    }
  }
  return res
}

export function loadFile(url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href
}

export function noNeedLogin(path = ''): boolean {
  // 免登录白名单
  const noLoginWhiteList: [string] = ['']
  const pathRes = (path || location.hash).replace('#/', '').replace(/^\//, '').replace(/\?.*/, '')
  return noLoginWhiteList.includes(pathRes)
}
