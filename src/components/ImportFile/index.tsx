import React, {Fragment, } from "react"
import {Dropdown, Menu, message} from 'antd'
import {downloadExcel, uploadCarItem, getFileDomainApi} from '@/api/common'
import {DownOutlined} from '@ant-design/icons/lib'
import './style.less'


interface Props {
  downloadApi?: string
  typeFile?: string
  api: string //导入的api （必传）
  text: string //下载模版名（用于拼接）必传
  btnColorType?: any //按钮颜色
  refreshData?: Function,
  getImportedResult?: Function
}

const ImportFile: React.FC<Props> = ({api, text, btnColorType, refreshData, downloadApi, getImportedResult}) => {
  const menu = (
    <Menu
      onClick={async () => {
        let domain = 'http:' + (await getFileDomainApi()).data.fileDomain.split(':')[1]
        let url = (await downloadExcel()).data.url
        window.open(domain + url)
      }}>
      <Menu.Item key="1">
        下载模板
      </Menu.Item>
    </Menu>
  )

  const uploadFile = async (file) => {
    let formData = new FormData()
    formData.append('file', file.target.files[0])
    let res: any = await uploadCarItem(api, formData)
    if (res.code === 0) {
      message.success('导入成功')
      refreshData?.() // 如果导入成功, 刷新列表
      getImportedResult?.(res)
    } else {
      // 导入失败
      getImportedResult?.(res)
    }
  }
  return (
    <Fragment>
      <Dropdown.Button type={btnColorType} overlay={menu} icon={<DownOutlined/>}>
        {text}
        <input className='carConsume'
          // accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
               type="file" name='file'
               onChange={(file) => uploadFile(file)}
        />
      </Dropdown.Button>
    </Fragment>
  )
}

ImportFile.defaultProps = {
  api: undefined,
  text: '',
  btnColorType: 'default',
  typeFile: 'xlsx'
}

export default ImportFile
