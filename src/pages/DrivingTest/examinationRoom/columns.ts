// 考场基本信息详情
export const EXAMINATION_ROOM_COLUMNS = [
  {
    title: '考场地址',
    dataIndex: 'contactAddress' //contactAddress stubDeviceCount
  },
  {
    title: '联系人',
    dataIndex: 'contactUser'
  },
  {
    title: '联系电话',
    dataIndex: 'contactTel'
  },
  {
    title: '可考车型',
    dataIndex: 'carTypes'
  },
  {
    title: '发证机关',
    dataIndex: 'certifyingAuthority',
    required: true
  },
  {
    title: '管理部门',
    dataIndex: 'managementDepartment'
  },
  {
    title: '验收人',
    dataIndex: 'approver'
  },
  {
    title: '经办人',

    dataIndex: 'operator'
  },
  {
    title: '创建日期',
    dataIndex: 'createdTime'
  },
  {
    title: '更新日期',
    dataIndex: 'updatedTime'
  },
  {
    title: '总队验收日期',
    dataIndex: 'acceptTime'
  },
  {
    title: '考场联网时间',
    dataIndex: 'siteTime'
  },
]
