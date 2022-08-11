export const PHYSICAL_INFO_CARD_COLUMNS = [
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    render: text => {
      return text === 0 ? '男' : text === 1 ? '女' : '-'
    }
  },
  {
    title: '民族',
    dataIndex: 'ethnic'
  },
  {
    title: '出生日期',
    dataIndex: 'birthday'
  },
  {
    title: '登记住址',
    dataIndex: 'registerAddress'
  },
  {
    title: '身份证号码',
    dataIndex: 'idcard'
  },
  {
    title: '签发机关',
    dataIndex: 'idCardIssuingAuthority'
  },
  {
    title: '失效日期',
    dataIndex: 'idCardExpirationDate'
  }
]
