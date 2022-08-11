import {SEX_NUMBER_ENUM, whether} from '@/utils/constants'

interface Cloumn {
  title: string,
  dataIndex: string,
  render?: Function,
  editable?: boolean,
  selectArray?: Array<any>
}

// 考生基本信息
export const lnformaTion: Array<Cloumn> = [
  {
    title: '考生姓名',
    dataIndex: 'name'
  },
  {
    title: '身份证号码',
    dataIndex: 'idCard'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    selectArray: SEX_NUMBER_ENUM,
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone'
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
    title: '驾校名称',
    dataIndex: 'schName'
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    // selectArray: BUSINESS
  },
  {
    title: '邮政编码',
    dataIndex: 'contactPostcode',
  },
  {
    title: '电子邮箱',
    dataIndex: 'eMail',
  },
  {
    title: '准驾车型',
    dataIndex: 'perdritype',
  },
  {
    title: '报名时间',
    dataIndex: 'registrationTime',
  },
  {
    title: '有效日期',
    dataIndex: 'effectiveDate',

  },
  {
    title: '是否本地',
    dataIndex: 'source',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
  },
  {
    title: '登记住所行政区划',
    dataIndex: 'registerResidence',
  },
  {
    title: '登记住所详细地址',
    dataIndex: 'registerAddress'
  },
  {
    title: '联系住所详细地址',
    dataIndex: 'contactAddress',

  },
  {
    title: '联系住所行政区划',
    dataIndex: 'contactResidence',

  },
];

