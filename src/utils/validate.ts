/**
 * icon
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 电话
 * @param {string} phone
 * @returns {Boolean}
 */
export function isPhone(phone: string): boolean {
  return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(
    phone,
  )
}

/**
 * 身份证
 * @param {string} number
 * @returns {Boolean}
 */
export function isIdNumber(number: string): boolean {
  return /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/.test(
    number,
  )
}
/**
 * 数字
 * @param {string} figure
 * @returns {Boolean}
 */
export function isFigure(figure: number | string): boolean {
  if (typeof figure === 'number') {
    figure = figure + ''
  }
  return /^(?:[+-]?\d+(?:\.\d+)?)?$/.test(figure)
}
/**
 * 整数
 * @param {string} Integer
 * @returns {Boolean}
 */
export function isInteger(Integer: number | string): boolean {
  if (typeof Integer === 'number') {
    Integer = Integer + ''
  }
  return /^\d+$/.test(Integer)
}
/**
 * 经度
 * @param {string} longitude
 * @returns {Boolean}
 */
export function islongitude(longitude: string): boolean {
  return /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,11})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,11}|180)$/.test(
    longitude,
  )
}
/**
 * 纬度
 * @param {string} latitude
 * @returns {Boolean}
 */
export function islatitude(latitude: string): boolean {
  return /^(-|\+)?([0-8]?\d{1}\.\d{0,11}|90\.0{0,11}|[0-8]?\d{1}|90)$/.test(latitude)
}

export const patternMap = {
  isPhone:
    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|3|8|9]))\d{8}$/,
  isIdNumber:
    /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
  maxNum: /^([0-9]{0,4})+(.[0-9]{1,2})?$/, // 2位小数
  maxNopoints: /^(\d{1,4}|9999)$/, // 没有小数
  maxMyriad: /^(\d{1,4}|10000)$/,
  maxHundred: /^(\d{1,2}|100)$/,
  maxMillion: /^(\d{1,6}|1000000)$/,
  isNum: /^[0-9]*$/,
  isFigure: /^(?:[+-]?\d+(?:\.\d+)?)?$/,
  letterAndNumber: /^[A-Za-z0-9]+$/,
  password: /^[0-9a-zA-Z\x21-\x7e]{8,16}$/, // 数字、字母、特珠字符
}

// 密码强度
export function checkStrong(sValue: string): number {
  let modes = 0
  //正则表达式验证符合要求的
  if (sValue.length < 1) return modes
  if (/\d/.test(sValue)) modes++ //数字
  if (/[a-z]/.test(sValue)) modes++ //小写
  if (/[A-Z]/.test(sValue)) modes++ //大写
  if (/\W/.test(sValue)) modes++ //特殊字符
  return modes
}

// 判断浏览器函数
export function isMobile(): boolean {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    )
  ) {
    return true // 移动端
  } else {
    return false // PC端
  }
}
