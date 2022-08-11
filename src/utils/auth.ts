const TokenKey = 'token'

/**
 * @param key
 * @param value
 * @param t cookie 的最大生存时间  秒
 */
export function setCookie(key = TokenKey, value, t) {
  // const oDate = new Date();
  // oDate.setDate(oDate.getDate() + t)

  document.cookie = key + '=' + value + ';max-age=' + t
}

/**
 * 获取cookie信息
 * @param key cookie名称
 */
export function getCookie(key = TokenKey) {
  let arr = document.cookie.split('; ') //以；分割符
  for (let i = 0, len = arr.length; i < len; i++) {
    let arr2 = arr[i].split('=')
    if (arr2[0] === key) {
      return arr2[1]
    }
  }
  return ''
}
