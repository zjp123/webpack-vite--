interface StoreState {
  userInfo: {
    userName: string
    permission: string[]
    token: string
    globalRoutes: any[]
  }
  collapsed: boolean
  curTab: string[]
  reloadPath: string
  fileDomainUrl: string
  userType: number
  hospitalId: number
  permissions: string[]
}

export const initState: StoreState = {
  userInfo: {
    userName: '',
    permission: [],
    token: '',
    globalRoutes: []
  }, // 用户信息
  collapsed: false, // 菜单收纳状态
  curTab: [], // 当前tab页面
  reloadPath: 'null', // 需要刷新的tab路径
  fileDomainUrl: '', // 文件域名
  userType: 0,
  hospitalId: 0,
  permissions: []
}

export default initState
