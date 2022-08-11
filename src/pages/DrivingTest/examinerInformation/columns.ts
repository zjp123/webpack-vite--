// 考官基本信息
import { AMEDICAL } from '@/utils/constants'

export const EXAMINER_DETAIL_COLUMNS = [
  {
    title: '姓名',
    dataIndex: 'name',
    required: true
}, {
    title: '性别 ',
    dataIndex: 'age',
    required: true
},
{
    title: '身份证号码',
    dataIndex: 'idcardNum',
},
{
    title: '联系方式',
    dataIndex: 'tel',
},
{
    title: '出生日期',
    width: 100,
    dataIndex: 'birthday',
  render: (text) => {
      return text?.split(" ")[0]
  }
},

{
    title: '准考车型',
    dataIndex: 'applicableModels',
    width: 80,
},
{
    title: '发证日期',
    dataIndex: 'issueDate',
    width: 120,
  render: (text) => {
    return text?.split(" ")[0]
  }
},
{
    title: '考试证有效期止',
    dataIndex: 'certificateValidityPeriodEnd',
    width: 120,
  render: (text) => {
    return text?.split(" ")[0]
  }
},
{
    title: '考试证状态',
    dataIndex: 'status',
    width: 150,
    render: text => {
        const ITEM = AMEDICAL.find(({ used_label }) => used_label === text)
        if (!ITEM) {
            return '合格'
        }
    }

},
{
    title: '考试员代码',
    dataIndex: 'code',
    width: 120,
},
{
    title: '档案编号',
    dataIndex: 'fileNum',
    width: 120,
},
{
    title: '传输标记',
    dataIndex: 'transmissionMark',
    width: 120,
},
{
    title: '记录标记',
    dataIndex: 'createBy',
    width: 120,
},
{
    title: '所属支队',
    dataIndex: 'belongsDetachment',
    width: 100,
},
{
    title: '管理部门',
    dataIndex: 'managementDepartment',
    width: 100,
},
{
    title: '工作单位',
    width: 100,
    dataIndex: 'workUnit',
},
{
    title: '经办人',
    dataIndex: 'manager',
    width: 150,
},
{
    title: '发证机关',
    dataIndex: 'issuingAuthority',
    width: 120,
},
{
    title: '校验位',
    dataIndex: 'checkDigit',
    width: 120,
},
{
    title: '创建时间',
    dataIndex: 'createdTime'
},
{
    title: '更新时间',
    dataIndex: 'updatedTime',
    width: 120,
},
{
    title: '备注',
    dataIndex: 'remark',
    width: 120,
},

];




