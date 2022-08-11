import request from '@/utils/request'

// 列表**list
// 新增add**
// 编辑update**
// 删除delete**
// 详情get**Info

//用户管理列表
export function userList(data = {}) {
  return request.postJson<any>(`/system/user/list`, data)
}

//新增用户
export function addUser(data = {}) {
  console.log('新增用户API -->>', data)
  return request.postJson<any>(`/system/user/addUser`, data)
}

// 添加更新六合一账户
export function updateSixInOneUserApi(data = {}) {
  return request.postJson<any>(`/system/user/updateUserRelation`, data)
}

// 获取六合一账户详情
export function loadSixInOneUserDetailApi(data = {}) {
  return request.postJson<any>(`/system/user/detail`, data)
}

//用户详情
export function getUserInfo(data = {}) {
  return request.postJson<any>(`/system/user/detail`, data)
}

//更新用户
export function updateUser(data = {}) {
  return request.postJson<any>(`/system/user/updateUser`, data)
}

//删除用户接口
export function deleteUser(data = {}) {
  return request.postJson<any>(`/system/user/deleteUser`, data)
}

//用户重置密码
export function resetPwdUser(data = {}) {
  return request.postJson<any>(`/system/user/resetPwd`, data)
}

//修改用户状态
export function changeStatusUser(data = {}) {
  return request.postJson<any>(`/system/user/changeStatus`, data)
}

//修改用户状态确认
export function checkAccountStatus(data = {}) {
  return request.postJson<any>(`/system/user/checkAccountStatus`, data)
}

//角色列表
export function roleList(data = {}) {
  return request.postJson<any>(`/system/role/list`, data)
}

//新增角色
export function addRole(data = {}) {
  return request.postJson<any>(`/system/role/addRole`, data)
}

//修改角色
export function updateRole(data = {}) {
  return request.postJson<any>(`/system/role/updateRole`, data)
}

//用户角色校验
export function roleUserRoleCheck(data = {}) {
  return request.postJson<any>(`/system/role/userRoleCheck`, data)
}

//修改角色状态
export function changeStatusRole(data = {}) {
  return request.postJson<any>(`/system/role/changeStatus`, data)
}

//获取菜单下拉树列表回显
export function roleMenuTreeselect(data = {}) {
  return request.postJson<any>(`/system/menu/roleMenuTreeselect`, data)
}

//角色详情
export function getRoleInfo(data = {}) {
  return request.postJson<any>(`/system/role/detail`, data)
}

//角色删除
export function deleteRole(data = {}) {
  return request.postJson<any>(`/system/role/deleteRole`, data)
}

//部门列表
export function departmentList(data = {}) {
  return request.postJson<any>(`/system/dept/list`, data)
}

//新增部门
export function addDepartment(data = {}) {
  return request.postJson<any>(`/system/dept/addDept`, data)
}

//修改部门
export function updateAddDepartment(data = {}) {
  return request.postJson<any>(`/system/dept/updateDept`, data)
}

//部门详情
export function getDepartmentInfo(data = {}) {
  return request.postJson<any>(`/system/dept/detail`, data)
}

//修改部门状态
export function changeStatusDept(data = {}) {
  return request.postJson<any>(`/system/dept/changeStatus`, data)
}

//删除部门
export function deleteDepartment(data = {}) {
  return request.postJson<any>(`/system/dept/deleteDept`, data)
}

// 日志管理
export function gementlist(data = {}) {
  return request.postJson<any>(`/system/dept/deleteDept`, data)
}

// 字典一级列表接口
export function managementlistApi(data = {}) {
  return request.postJson<any>(`/system/dict/type/list`, data)
}

// 登录日志
export function ThelogList(data = {}) {
  return request.postJson<any>(`/monitor/logininfor/list`, data)
}

// 操作日志
export function TheoperationList(data = {}) {
  return request.postJson<any>(`/monitor/operlog/list`, data)
}

//安全日志
export function ThesecurityList(data = {}) {
  return request.postJson<any>(`/monitor/security/list`, data)
}

// 请求日志
export function RequestlogList(data = {}) {
  return request.postJson<any>(`/client/log`, data)
}

// 操作日志导出
export function operlogExport(data = {}) {
  return request.postJson<any>(`/monitor/operlog/export`, data)
}

// 一级字典删除
export function deleteFirstLevelDictApi(data = {}) {
  return request.postJson<any>(`/system/dict/type/delete`, data)
}

// 一级字典新增 原来 addeleteRolep
export function addFirstLevelDictApi(data = {}) {
  return request.postJson<any>(`/system/dict/type`, data)
}

// 一级字典编辑 原来 updateeleteRolep
export function updateFirstLevelDictApi(data = {}) {
  return request.postJson<any>(`/system/dict/type/update`, data)
}

// 字典管理详情
export function getRolep(data = {}) {
  return request.postJson<any>(`/system/dict/type/info`, data)
}

//字典二级列表
export function secondaryList(data = {}) {
  return request.postJson<any>(`/system/dict/data/list`, data)
}

//字典二级删除
export function deleteSecondDictApi(data = {}) {
  return request.postJson<any>(`/system/dict/data/delete`, data)
}

//菜单管理列表
export function resourceList(data = {}) {
  return request.postJson<any>(`/system/menu/list`, data)
}

//新增菜单
export function addResource(data = {}) {
  return request.postJson<any>(`/system/menu/addMenu`, data)
}

//菜单详情
export function getResourceInfo(data = {}) {
  return request.postJson<any>(`/system/menu/detail`, data)
}

//更新菜单
export function updateResource(data = {}) {
  return request.postJson<any>(`/system/menu/updateMenu`, data)
}

//删除菜单接口
export function deleteResource(data = {}) {
  return request.postJson<any>(`/system/menu/deleteMenu`, data)
}

//定时任务列表
export function timingtaskList(data = {}) {
  return request.postJson<any>(`/monitor/job/list`, data)
}

//定时任务新增
export function addtimingtask(data = {}) {
  return request.postJson<any>(`/monitor/job/addJob`, data)
}

//定时任务详情
export function gettimingInfo(data = {}) {
  return request.postJson<any>(`/monitor/job/detail`, data)
}

//定时任务编辑
export function updatiming(data = {}) {
  return request.postJson<any>(`/monitor/job/updateJob`, data)
}

//定时任务删除
export function deleteTolep(data = {}) {
  return request.postJson<any>(`/monitor/job/deleteJob`, data)
}

// 定时任务日志列表
export function ScheduledList(data = {}) {
  return request.postJson<any>(`/monitor/jobLog/list`, data)
}

//定时任务立即执行
export function tedmmediately(data = {}) {
  return request.postJson<any>(`/monitor/job/executeNow`, data)
}

// 系统安全策略配置
export function SecurityPolicyList(data = {}) {
  return request.postJson<any>(`/system/config/list`, data)
}

//系统安全策略修改
export function policysmodified(data = {}) {
  return request.postJson<any>(`/system/config/updateConfig`, data)
}

//系统安全策详情
export function getpolicysmodifiedInfo(data = {}) {
  return request.postJson<any>(`/system/config/detail`, data)
}

//系统安全策略--修改策略状态
export function Modifythesecurity(data = {}) {
  return request.postJson<any>(`/system/config/changeConfigStatus`, data)
}

// 审计管理
export function loadInvestigateListApi(data = {}) {
  return request.postJson<any>(`/client/log`, data)
}

// 字典管理二级详情接口
export function getdictionaryInfo(data = {}) {
  return request.postJson<any>(`/system/dict/data/info`, data)
}

//字典管理二级新增
export function addSecondDictionaryApi(data = {}) {
  return request.postJson<any>(`/system/dict/data`, data)
}

// 二级字典修改 原 Updictionary
export function updateSecondeDictApi(data = {}) {
  return request.postJson<any>(`/system/dict/data/update`, data)
}

//接口管理列表
export function interfaceList(data = {}) {
  return request.postJson<any>(`/interface/config/list`, data)
}

//接口管理详情
export function interfaceListInfo(data = {}) {
  return request.postJson<any>(`/interface/config/info`, data)
}

//接口管理新增
export function addInterfaceList(data = {}) {
  return request.postJson<any>(`/interface/config/add`, data)
}

//接口管理更新
export function upInterfaceList(data = {}) {
  return request.postJson<any>(`/interface/config/update`, data)
}

//接口管理删除
export function delInterfaceList(data = {}) {
  return request.postJson<any>(`/interface/config/delete`, data)
}

//暂停定时任务
export function taskstaus(data = {}) {
  return request.postJson<any>(`/monitor/job/changeStatus`, data)
}

// 道闸管理-获取设备列表信息
export function barrierList(data = {}) {
  return request.postJson<any>(`/client/manage/list`, data)
}

// 道闸管理-更新设备状态
export function barrierUpdateClient(data = {}) {
  return request.postJson<any>(`/client/manage/updateClient`, data)
}

// 道闸管理-删除设备信息
export function barrierDeleteClient(data = {}) {
  return request.postJson<any>(`/client/manage/deleteClient`, data)
}

// 道闸管理-获取设备详情
export function barrierGetClientInfo(data = {}) {
  return request.postJson<any>(`/client/manage/getClientInfo`, data)
}

// 档案配置-配置列表
export function archiveConfigList(data = {}) {
  return request.postJson<any>(`/archive/config/list`, data)
}

// 档案配置-创建配置
export function createArchiveConfig(data = {}) {
  return request.postJson<any>(`/archive/config/create`, data)
}

// 档案配置-下拉
export function comboboxTypes(data = {}) {
  return request.postJson<any>(`/api/combobox/types`, data)
}

// 档案配置-更新配置
export function updateArchiveConfigList(data = {}) {
  return request.postJson<any>(`/archive/config/update`, data)
}

// 档案配置-删除配置
export function deleteArchiveConfig(data = {}) {
  return request.postJson<any>(`/archive/config/delete`, data)
}

// 消息通知列表
export function loadNoticeListApi(data = {}) {
  return request.postJson<any>(`/system/notice/list`, data)
}

// 新增或更新消息通知
export function saveOrUpdateNoticeApi(data = {}) {
  return request.postJson<any>(`/system/notice/saveOrUpdateNotice`, data)
}

// 消息通知详情
export function loadNoticeDetailApi(data = {}) {
  return request.postJson<any>(`/system/notice/detail`, data)
}

// 撤销通知
export function revokeNoticeApi(data = {}) {
  return request.postJson<any>(`/system/notice/revokeNotice`, data)
}

// 数据库配置-获取列表信息
export function databaseConfigListApi(data = {}) {
  return request.postJson<any>(`/system/tenant/list`, data)
}

// 数据库配置-新增数据库连接信息
export function saveDatabaseConfigApi(data = {}) {
  return request.postJson<any>(`/system/tenant/save`, data)
}

// 数据库配置-更新数据库连接信息
export function updateDatabaseConfigApi(data = {}) {
  return request.postJson<any>(`/system/tenant/update`, data)
}

// 数据库配置-删除数据库连接信息
export function deleteDatabaseConfigApi(data = {}) {
  return request.postJson<any>(`/system/tenant/delete`, data)
}

// 数据库配置-获取数据库链接信息详情
export function loadDatabaseConfigDetailApi(data = {}) {
  return request.postJson<any>(`/system/tenant/detail`, data)
}

// 签字机管理列表
export function signMachineListApi(data = {}) {
  return request.postJson<any>(`/client/manage/list`, data)
}

// 签字机管理-启用与禁用
export function signUpdateStatusApi(data = {}) {
  return request.postJson<any>(`/client/manage/updateClientStatus`, data)
}

// 签字机管理-获取设备详情
export function signMachineGetClientInfoApi(data = {}) {
  return request.postJson<any>(`/client/manage/getClientInfo`, data)
}

// 签字机管理-更新设备信息
export function signUpdateClientApi(data = {}) {
  return request.postJson<any>(`/client/manage/updateClient`, data)
}

// 签字机管理-删除
export function signDeleteApi(data = {}) {
  return request.postJson<any>(`/client/manage/deleteClient`, data)
}

// 系统初始化-任务列表
export function initConfigListApi(data = {}) {
  return request.postJson<any>(`/system/init/job/list`, data)
}

// 系统初始化-任务配置列表
export function editInitConfigListApi(data = {}) {
  return request.postJson<any>(`/system/init/config/list`, data)
}

// 系统初始化-更新任务配置
export function updateInitConfigListApi(data = {}) {
  return request.postJson<any>(`/system/init/config/update`, data)
}

// 系统初始化-任务清库接口
export function cleanTableApi(data = {}) {
  return request.postJson<any>(`/system/init/job/clean/table`, data)
}

// 系统初始化-开始任务
export function startJobApi(data = {}) {
  return request.postJson<any>(`/system/init/job/start`, data)
}

// 系统初始化-停止任务
export function stopJobApi(data = {}) {
  return request.postJson<any>(`/system/init/job/stop`, data)
}

// 系统初始化-获取实时任务状态
export function loadInitInfoApi(data = {}) {
  return request.postJson<any>(`/system/init/config/initInfo`, data)
}
