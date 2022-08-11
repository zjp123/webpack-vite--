import moment, { Moment } from "moment"

export * from "./router"
export * from "./isType"
export * from "./downloadFile"

export function moment2String(date: Moment, format = "YYYY-MM-DD") {
  if (date) {
    return moment(date).format(format)
  }
  return ""
}

export const deleteObjectEmptyKey = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === "" || obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
}

//分页器
export const getPagation = searchForm => {
  return {
    pageNum: searchForm.pageNum,
    pageSize: searchForm.pageSize,
    totalPages: searchForm.totalPages,
    totalRows: searchForm.totalRows
  }
}

interface itmeItme {
  formNameTime: string
  startTime: string
  endTime?: string
  format?: string
}

interface objFormatItem {
  momentTrunString?: itmeItme[]
  booleTrunNum?: string[]
  arrayTurnString?: string[]
  numTrunBoole?: string[]
}

const timeFormat = "YYYY-MM-DD"

//查询｜导出｜编辑 格式化查询参数(时间格式化为字符串、布尔转数字0｜1、数组转字符串)
export const formatParameters = (objValue, objFormat: objFormatItem) => {
  const { momentTrunString, booleTrunNum, arrayTurnString, numTrunBoole } = objFormat
  if (momentTrunString) {
    momentTrunString.forEach(item => {
      const {
        formNameTime, // form的name值
        startTime, // 接口所需字段(RangePicker的开始时间字段｜DatePicker的时间)
        endTime, // 接口所需字段(RangePicker的结束时间字段｜DatePicker不传此参数 )
        format //时间格式（非必填）默认'YYYY-MM-DD'
      } = item

      if (endTime) {
        const loginTime = objValue[formNameTime] || []
        objValue[endTime] = moment2String(loginTime[1], format || timeFormat + " 23:59:59")
        objValue[startTime] = moment2String(loginTime[0], format || timeFormat + " 00:00:00")
      } else {
        objValue[startTime] = moment2String(objValue[formNameTime], format || timeFormat)
      }
      if (formNameTime !== startTime) {
        delete objValue[formNameTime]
      }
    })
  }
  if (booleTrunNum) {
    booleTrunNum.forEach(itm => {
      if (typeof objValue[itm] === "boolean") {
        objValue[itm] = objValue[itm] ? 1 : 0
      }
    })
  }
  if (numTrunBoole) {
    numTrunBoole.forEach(itm => {
      if (typeof objValue[itm] === "number") {
        objValue[itm] = objValue[itm] ? true : false
      }
    })
  }
  if (arrayTurnString) {
    arrayTurnString.forEach(itm => {
      if (Array.isArray(objValue[itm])) {
        objValue[itm] = objValue[itm] && objValue[itm].join(",")
      }
    })
  }
  return deleteObjectEmptyKey(objValue)
}

/**
 * 树结构替换Key
 *
 * @param {Array} datalist 树结构
 * @param {string} oldKey 被替换的key
 * @param {string} newKey 替换的key
 * @param {string} children 子级对应的key
 * @return {Array}
 */
// 参数1: 接口中的菜单  getRouterList   参数2: code: 权限码  参数三 key 自定义码
export const replaceKey = (datalist = [], oldKey, newKey, children = "children") => {
  if (Array.isArray(datalist)) {
    let placeList = [...datalist]
    placeList.forEach(data => {
      if (data[children]) {
        data[children] = replaceKey(data[children], oldKey, newKey, children)
      }
      let keys = Object.keys(data)
      if (keys.includes(oldKey)) {
        data[newKey] = data[oldKey]
        delete data[oldKey]
      }
    })
    return placeList
  }
  return [
    {
      path: "/index",
      name: "首页系统",
      key: "index",
      children: [],
      code: "student:physical:successfulPage",
      hidden: false,
      icon: "index",
      type: ""
    }
  ]
}

//身份证正则
export const idCard = (boole?: boolean) => {
  let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return [
    {
      required: typeof boole === "boolean" ? boole : true,
      message: "请输入正确的15或18位身份证号,末尾大写X",
      pattern: idcardReg
    }
  ]
}

// 日期正则
export const dateRules = (boole?: boolean) => {
  let dateRules = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  return [
    {
      required: typeof boole === "boolean" ? boole : true,
      message: "日期格式不正确，正确格式为：2014-01-01",
      pattern: dateRules
    }
  ]
}

//IP正则
export const iPtest = (boole?: boolean) => {
  // let idcardReg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
  let idcardReg = /^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}){1,5}$/
  return [
    {
      required: typeof boole === "boolean" ? boole : true,
      message: "请输入合法IP",
      pattern: idcardReg
    }
  ]
}

export const rulesNumber = (boole?: boolean) => [
  {
    required: typeof boole === "boolean" ? boole : true,
    message: "请输入数字",
    pattern: /^[0-9]*$/
  }
]

export const rulesThreeNumber = (boole?: boolean) => [
  {
    required: typeof boole === "boolean" ? boole : true,
    message: "请输入3位数字",
    pattern: /^[0-9]{3}$/
  }
]

export const rulesFiv = (boole?: boolean) => [
  {
    required: typeof boole === "boolean" ? boole : true,
    message: "请输入正确格式至少5位",
    pattern: /^[0-9A-Z]{5}$/
  }
]

/**
 * 返回base64
 * @param file
 */
export function getBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * 将指定位置下标置顶，其后的依次排列
 * @param index
 * @param array
 */
export function getChangeArrayPosition(index: number, array: []) {
  let arr: [] = []
  let i = 0
  for (i; i < array.length; i++) {
    arr.push(array[i + index])
    if (i + index >= array.length - 1) {
      index = 0 - (i + 1)
    }
  }
  return arr
}


//下载
export function download(url, type = "", title = "") {
  if (!url || !type) {
    console.warn("url, type 有传入错误", url, type)
    return
  }
  let fileTitle = ""
  if (title) {
    fileTitle = title
  } else {
    fileTitle = url.split("/").pop()
  }
  let xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.responseType = "blob"
  xhr.send()
  xhr.onload = function (e) {
    if (this.status === 200) {
      var blob = new Blob([this.response], {
        type: type
      })
      let aElement = document.createElement("a")
      document.body.appendChild(aElement)
      let url = window.URL.createObjectURL(blob)
      aElement.href = url
      aElement.download = fileTitle
      aElement.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(aElement)
    }
  }
}

//加密
export function toCode(str) {
  var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" //定义密钥
  var len = key.length
  var a = key.split("") //把秘钥字符串转为数组
  var s = "",
    b,
    b1,
    b2,
    b3
  for (var i = 0; i < str.length; i++) {
    b = str.charCodeAt(i)
    b1 = b % len
    b = (b - b1) / len
    b2 = b % len
    b = (b - b2) / len
    b3 = b % len
    s += a[b3] + a[b2] + a[b1] //根据这些余数值映射到密钥对应下标值得字符
  }
  return s
}

// let a = toCode('admon')
// console.log(a, '加密')
// console.log(fromCode(a), '解密')
//解密
var fromCode = function (str) {
  var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  var len = key.length
  var b,
    b1,
    b2,
    b3,
    d = 0,
    s //定义临时变量
  s = new Array(Math.floor(str.length / 3)) //计算密钥加密字符串可能包含的字符数，并定义数组
  b = s.length //获取数组的长度
  for (var i = 0; i < b; i++) {
    //遍历加密字符串
    b1 = key.indexOf(str.charAt(d)) //截取周期内第一个字符，并计算它在密钥中的下标值
    d++
    b2 = key.indexOf(str.charAt(d)) //截取周期内第二个字符，并计算它在密钥中的下标值
    d++
    b3 = key.indexOf(str.charAt(d)) //截取周期内第三个字符，并计算它在密钥中的下标值
    d++
    s[i] = b1 * len * len + b2 * len + b3 //利用上面下标值反算被加密字符的Unicode的码
  }
  b = eval("String.fromCharCode(" + s.join(",") + ")") //调用String.fromCharCode()算出对应的字符串
  return b
}
//防抖
// export function debounce(fn,delay){
//   let timer = null //借助闭包
//   return function() {
//       if(timer){
//           clearTimeout(timer)
//       }
//       timer = setTimeout(fn,delay) // 简化写法
//   }
// }


// 多张图片加载
const loadImgs = (imgs) => {
  if (!(imgs instanceof Array)) imgs = [imgs]
  const promiseList = imgs && imgs.map(img => {
    return new Promise((resolve, reject) => {
      let _img
      if (typeof img === 'string') {
        _img = new Image()
        _img.setAttribute('crossOrigin', 'anonymous')
        _img.src = img
      } else {
        _img = img
      }
      _img.onload = () => {
        resolve(_img)
      }
      _img.onerror = () => {
        reject(`loadImg--图片加载错误：${img}`)
      }
    })
  })
  return Promise.all(promiseList)
}

export const generateImgWaterMark = (img, waterImg, config, callback) => {
  const { waterMarkX, waterMarkY, waterMarkW, waterMarkH, suffix } = config
  loadImgs([img, waterImg])
    .then(([_img, _waterImg]) => {
      const canvas = document.createElement('canvas')
      canvas.width = _img['width']
      canvas.height = _img['height']
      const ctx = canvas.getContext('2d')
      ctx.drawImage((_img as CanvasImageSource), 0, 0, _img['width'], _img['height'])

      const whAspect = _waterImg['width'] / _waterImg['height']
      _waterImg['width'] = parseInt((_img['width'] * 0.63).toFixed(5))
      _waterImg['height'] = parseInt((_waterImg['width'] / whAspect).toFixed(5))
      ctx.drawImage(
        (_waterImg as CanvasImageSource),
        waterMarkX || ((_img['width'] - _waterImg['width']) / 2),
        waterMarkY || (_img['height'] - _waterImg['height'] - 30),
        waterMarkW || _waterImg['width'],
        waterMarkH || _waterImg['height']
      )
      const base64Img = canvas.toDataURL(`image/${suffix || 'png'}`)
      callback && callback(base64Img)
    })
    .catch((err) => {
      throw err
    })

}

export const generatePageWaterMark = (wrapperId, config) => {
  const {
    text,
    textColor,
    textOpacity,
    textFontSize,
    textFontFamily,
    waterMarkBgImgWidth,
    waterMarkBgImgHeight,
    textSpacing,
    textRotate,
    isFixed,
    suffix,
  } = config

  // 绘制生成水印背景图
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = waterMarkBgImgWidth || 220
  canvas.height = waterMarkBgImgHeight || 220
  const textArr = text.split('\n')
  textArr.forEach((item, i) => {
    ctx.beginPath()
    ctx.save()
    ctx.font = `normal normal normal ${textFontSize || '12px'}  ${textFontFamily || '微软雅黑'} `
    ctx.fillStyle = textColor || '#ccc'
    ctx.textAlign = 'center';
    ctx.globalAlpha = textOpacity
    const rectCenterPoint = {
      x: canvas.width / 2,
      y: canvas.height / 2
    }
    ctx.translate(rectCenterPoint.x, rectCenterPoint.y);
    ctx.rotate((textRotate || -30) * Math.PI / 180);
    ctx.translate(-rectCenterPoint.x, -rectCenterPoint.y);
    ctx.fillText(item, canvas.width / 2, ((canvas.height - textArr.length * textSpacing) / 2) + ((textSpacing || 20) * (i + 1)))
    ctx.restore()
  })
  const base64Url = canvas.toDataURL(`image/${suffix || 'png'}`)

  // 创建水印容器
  const waterMarkDiv = document.createElement('div')
  waterMarkDiv.style.cssText = `
      position: ${isFixed ? 'fixed' : 'absolute'};
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
      pointer-events: none;
      background-repeat: repeat;
      background-image: url(${base64Url});
  `
  if (wrapperId === 'body') {
    document.body.appendChild(waterMarkDiv)
  } else {
    document.getElementById(wrapperId).appendChild(waterMarkDiv)
  }
}

/**
 * echarts无法使用em，通过计算得出文字缩放后的大小
 * @param res 1920尺寸下的大小
 * @returns {number}
 */
 export const isBigScreen = () => {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return false
  if (clientWidth >= 1920) return true
}