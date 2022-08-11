import requestAPI from "@/utils/request" //带cookie

interface MapResult {
  address: string
  city: string
  district: string
  lat: string
  lng: string
  prov: string
  radius: string
}

/**
 * 图片上传
 * @param str
 */
export function imagesUpload(str: string): Promise<string> {
  let url = "//upload.58cdn.com.cn/json?rand=" + Math.random()
  let resultUrl = "https://pic3.58cdn.com.cn/nowater/jxt/"
  // if (process.env.UMI_ENV === 'development' || process.env.UMI_ENV === 'fev') {
  //     url = '//upload.58cdn.com.cn/json?rand=' + Math.random()
  //     resultUrl = '//pic3.58cdn.com.cn/nowater/jxt/'
  // }
  const data = JSON.stringify({
    "Pic-Data": str.replace(/data.*;base64,/, ""),
    "Pic-Size": "0",
    "Pic-Encoding": "base64",
    "Pic-Path": "/nowater/jxt/"
  })
  return new Promise((resolve, reject) => {
    let httpRequest = new XMLHttpRequest()
    httpRequest.open("POST", url, true)
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    httpRequest.send(data)
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        let res = httpRequest.responseText
        resolve(resultUrl + res)
      }
    }
  })
}


//获取菜单下拉树列表
export function menuList(data = {}) {
  return requestAPI.postJson<any>(`/system/menu/treeselect`, data)
}

/**
 * 获取用户信息
 */
export function getUserInfo(data: Result.ObjectType) {
  return requestAPI.postForm("/api/account/userinfo", data, "NET_API")
}

/**
 * 获取驾校配置
 */
export function getSchConf(data: Result.ObjectType) {
  return requestAPI.postForm("/api/school/config/sids", data, "NET_API")
}

/**
 * 获取用户权限
 */
export function getUserAuth(data: Result.ObjectType) {
  return requestAPI.get("/api/function/my/tree", data, "NET_API")
}

/**
 * 获取用户当前位置，会根据IP进行缓存，缓存时长7天
 */
export function getCurrentLocation() {
  return requestAPI.postJson<MapResult>("/school/schoolinfo/geofromip")
}

// 登出
export function loginOutApi() {
  return requestAPI.postJson<MapResult>("/loginOut")
}

// 人像采集识别
export function checkFace(data) {
  return requestAPI.postForm<string>("/stu/ylr/checkFace", data)
}

// 路由
export function getRouter(data) {
  return requestAPI.postJson<string>("/getRouter", data)
}

/**
 * 获取天气信息
 */
export function getWeatherInfo(province, city) {
  let url = "https://wis.qq.com/weather/common"
  return new Promise((resolve, reject) => {
    requestAPI.Jsonp({
      url: url,
      data: {
        source: "pc",
        weather_type: "observe|air|forecast_24h",
        province,
        city
      },
      success: function(data) {
        // 获取天气数据成功后，对数据进行操作
        resolve(data)
      }
    })
  })
}

/**
 * 获取用户打印次数
 */
export function getPrintCount(data) {
  return requestAPI.postJson("/print/count", data)
}

// 人像采集识别
export function login(data) {
  return requestAPI.postJson("/login", data)
}

//获取部门下拉树列表
export function treeSelectList(data = {}) {
  return requestAPI.postJson<any>(`/system/dept/treeselect`, data)
}


//获取查询所有权限信息
export function userDetailList(data = {}) {
  return requestAPI.postJson<any>(`/system/user/detail`, data)
}


// 下载文件
export function downloadExcel(data = {}) {
  return requestAPI.postJson<any>("/exam/plan/download", data)
}

//导入接口
export function uploadCarItem<T>(api, data) {
  return requestAPI.postForm<T>(api, data)
}

//上传base64
export function uploadImgBase64(data = {}) {
  return requestAPI.postJson<any>(`/file/upload/imgBase64`, data)
}

// 上传身份证 base64 获取身份证信息
export function uploadID4GetInfo(data = {}) {
  return requestAPI.postJson<any>(`/file/upload/imgBase6411`, data)
}

//人脸识别
export function signCompared(data = {}) {
  return requestAPI.postJson<any>(`/examiner/sign/compared`, data)
}

//图片域名
export function getFileDomainApi(data = {}) {
  return requestAPI.postJson<any>(`/file/domain`, data)
}


//右上角修改密码
export function changePwd(data = {}) {
  return requestAPI.postJson<any>(`/system/user/changePwd`, data)
}

//用户列表重置密码123456
export function resetPwd(data = {}) {
  return requestAPI.postJson<any>(`/system/user/resetPwd`, data)
}

// 延长用户有效期
export function prolongUserLifeApi(data = {}) {
  return requestAPI.postJson<any>(`system/user/extendUserValidity`, data)
}

// 解封账号
export function deblockingAccountApi(data = { userName: "" }) {
  return requestAPI.get<any>(`/unblock/${data?.userName}`)
}

//首次登录修改密码
export function firstLoginChangePwd(data = {}) {
  return requestAPI.postJson<any>(`/system/user/firstLoginChangePwd`, data)
}

// 获取医生详情信息
export function getDoctorDetailApi(data = {}) {
  return requestAPI.postJson<any>(`/hosp/doctor/detail`, data)
}

// 保存医生签名信息
export function saveDoctorInfoApi(data = {}) {
  return requestAPI.postJson<any>(`/hosp/doctor/updateDoctor`, data)
}

// 上传签字图片获取url
export function uploadBase64Api(data = {}) {
  return requestAPI.postJson<any>(`/file/upload/imgBase64/`, data)
}

// 完善信息
export function doctorCompleteApi(data = {}) {
  return requestAPI.postJson<any>(`/hosp/doctor/completeInformation`, data)
}

// 获取用户信息
export function getUserInfoApi(data = {}) {
  return requestAPI.postJson<any>(`/getInfo`, data)
}

// 获取驾校
export function getDrivingSchoolApi(data = {}) {
  return requestAPI.postJson<any>(`/api/combobox/sch`, data)
}

// 获取考官下拉
export function getExaminerApi(data = {}) {
  return requestAPI.postJson<any>(`/api/combobox/inv`, data)
}

// 获取考场下拉
export function getExaminationSiteApi(data = {}) {
  return requestAPI.postJson<any>(`/api/combobox/exs`, data)
}

// 获取字典下拉
export function getDictApi(data = {}) {
  return requestAPI.postJson<any>(`/api/combobox`, data)
}

// 获取驱动列表
export function getPluginsApi(data = {}) {
  return requestAPI.postJson(`/file/pluginsList`, data)
}

// 驱动下载
export function downloadPluginsApi(data = {}, filename) {
  return requestAPI.downloadZip(`/file/downloadPlugins/release`, data, filename)
}

// 角色选择框下拉
export function optionSelectApi(data = {}) {
  return requestAPI.postJson(`/system/role/optionSelect`, data)
}
