interface URL {
  SAAS_API: string
  NET_API: string
  ZST_API: string
  USER_API: string
  CLASS_HOURS_API: string
  KAOSHI_API: string
  WECHAT_CONFIG: {
    SCH_APPID: string
    COACH_APPID: string
  }
}
const BASE_URL: URL = {
  SAAS_API: import.meta.env.REACT_APP_TEST === "cdn"
    // 线上环境
    ? "//jk-paperless.jxedt.com"
    
    : import.meta.env.REACT_APP_TEST === 'test'
      // 测网环境
      ? "//jk-paperless.58v5.cn"//测试
      // : (process.env.NODE_ENV === "development"
      : (import.meta.env.VITE_NODE_ENV === "development"
          // 开发环境
          ? (
            "//jk-paperless.58v5.cn"//测试
            // "//jk-paperless.jxedt.com" // 线上
            // "//172.29.154.64:8081" // 演示环境
            // "//192.168.1.105:8080"//华梁济源
            // "http://10.252.72.64:8080"//华梁
            // "http://10.252.72.67:8080"//原浩
            // 'http://10.252.73.201:8080'//雨哥
          )
          // 打包环境
          : (
            // 'http://10.145.140.105:8080'//线上
            // "//172.29.70.70:8080" //线上环境调试
            // "//62.208.33.251:8080"//济源上线
            // "//62.208.33.251:8080" // 打包测试
            // "//172.29.200.100:8080" // uat
            // "//172.29.154.64:8081" // uat2
            // "//172.29.200.100/zhjk/api/" // uat3
            // "//62.208.33.251/zhjk/api/" // 济源上线
            // "//192.168.99.128/zhjk/api/" // 济源上线
            "//62.136.96.193/zhjk/api/" // 濮阳部署
            // "//172.29.200.100/zhjk/api/" // 演示环境
            // "//192.168.99.136/zhjk/api/"
            // "//172.29.201.61/zhjk/api/"
            // "//62.136.96.193/zhjk/api/"
          )
      ),
  NET_API: import.meta.env.UMI_ENV === "production" ? "//jxtapi.jxedt.com" : "//jiacloudplatformapitest.58v5.cn",
  USER_API: "//user.jxedt.com",
  ZST_API: import.meta.env.UMI_ENV === "production" ? "//zstapp.jxedt.com" : "//test.mp.zst.58v5.cn",
  CLASS_HOURS_API: import.meta.env.UMI_ENV === "production" ? "//jxedt-timing.jxedt.com" : "//jxedt-timing.58v5.cn",
  KAOSHI_API: import.meta.env.UMI_ENV === "production" ? "//kaoshiapi.jxedt.com" : "//kaoshijxedttest.58v5.cn",
  WECHAT_CONFIG: {
    SCH_APPID: import.meta.env.UMI_ENV === "production" ? "wx042daef372348d7a" : "wxcaea6ea225e8783b",
    COACH_APPID: import.meta.env.UMI_ENV === "production" ? "wxabfe85d9135afeb9" : "wxcaea6ea225e8783b"
  }
}


export default BASE_URL
