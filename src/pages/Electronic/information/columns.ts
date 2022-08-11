import {whether} from '@/utils/constants'

interface Cloumn {
  title: string,
  dataIndex?: string,
  render?: Function,
  editable?: boolean,
  selectArray?: Array<any>
}

// 考生基本信息
export const informaTion: Array<Cloumn> = [
  {
    title: '考生姓名',
    dataIndex: 'name'
  },
  {
    title: '身份证号码',
    dataIndex: 'idcard'
  },
  {
    title: '性别',
    dataIndex: 'sex',
  },
  {
    title: '出生日期',
    dataIndex: 'birthday',
    render: text => text && text.split(" ")[0]
  },
  {
    title: '国籍',
    dataIndex: 'nationality',
  },
  {
    title: '邮政编码',
    dataIndex: 'contactPostcode',
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone'
  },
  {
    title: '移动电话',
    dataIndex: 'mobilePhone'
  },
  {
    title: '登记住所行政区划',
    dataIndex: 'registerResidence',
  },
  {
    title: '业务类型',
    dataIndex: 'businessTypeName',
  },
  {
    title: '驾驶人来源',
    dataIndex: 'source',
  },
  {
    title: '登记住所详细地址',
    dataIndex: 'registerAddress'
  },
  {
    title: '准驾车型',
    dataIndex: 'perdritype',
  },
  {
    title: '所属驾校',
    dataIndex: 'schName',
  },
  {
    title: '联系住所行政区划',
    dataIndex: 'contactResidence',

  },
  {
    title: '报名时间',
    dataIndex: 'registrationTime',
  },
  {
    title: '有效日期',
    dataIndex: 'expirationDate',
  },
  {
    title: '联系住所详细地址',
    dataIndex: 'contactAddress',

  },
  {
    title: '电子邮箱',
    dataIndex: 'eMail',
  },
  {
    title: '居住证编号',
    dataIndex: 'residencePermit',
  },
  {
    title: '-',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
  },
];

