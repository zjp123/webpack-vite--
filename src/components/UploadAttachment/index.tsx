import React from 'react'
import { Upload, Button } from 'antd'
import { UploadOutlined, StarOutlined } from '@ant-design/icons'

const list = [
  {
    uid: '1',
    name: 'xxx.png',
    status: 'done',
    response: 'Server Error 500', // custom error message to show
    url: 'http://www.baidu.com/xxx.png'
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'http://www.baidu.com/yyy.png'
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    url: 'http://www.baidu.com/zzz.png'
  }
]

const UploadAttachment = () => {
  const [defaultFileList, setDefaultFileList] = React.useState<any>(list)

  const onChange = ({ file, fileList }) => {
    if (file.status !== 'uploading') {
      console.log(file, fileList)
    }
  }

  return (
    <Upload name="file" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" onChange={onChange}>
      <Button type="link">上传附件</Button>
    </Upload>
  )
}

export default UploadAttachment
