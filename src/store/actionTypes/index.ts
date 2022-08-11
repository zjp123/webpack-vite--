/**
 * redux的 type常量
 * @param {name} string action 要 diapatch 的类型
 * @param {field} string action 要操作的字段名
 */
export default {
  SET_USERINFO: {
    name: 'SET_USERINFO',
    field: 'userInfo'
  },
  SET_COLLAPSED: {
    name: 'SET_COLLAPSED',
    field: 'collapsed'
  },
  SET_CURTAB: {
    name: 'SET_CURTAB',
    field: 'curTab'
  },
  SET_RELOADPATH: {
    name: 'SET_RELOADPATH',
    field: 'reloadPath'
  },
  SET_FILE_DOMAIN_URL: {
    name: 'SET_FILE_DOMAIN_URL',
    field: 'fileDomainUrl'
  },
  SET_USER_TYPE: {
    name: 'SET_USER_TYPE',
    field: 'userType'
  },
  SET_HOSPITALID_TYPE: {
    name: 'SET_HOSPITALID_TYPE',
    field: 'hospitalId'
  },
  SET_WATERMARK: {
    name: 'SET_WATERMARK',
    field: 'watermark'
  },
  SET_PERMISSIONS: {
    name: 'SET_PERMISSIONS',
    field: 'permissions'
  }
}
