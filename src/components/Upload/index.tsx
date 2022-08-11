import React, { FC, useEffect, useState } from "react"
import { Upload, message } from "antd"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import BASE_URL from "@/utils/base"
import { getCookie } from "@/utils/auth"
import { store } from "@/store"

interface Props {
  getUrl?: Function
  getUploadedRes?: Function
  multiple?: boolean
  title?: string
  electronicSignImg?: string//回显
  flag_?: boolean,
  setFlag?: Function
}

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result))
  reader.readAsDataURL(img)
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
  if (!isJpgOrPng) {
    message.error("只能上传 JPG/PNG 文件!")
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error("图片过大,请上传小于5MB以内的图片")
  }
  return isJpgOrPng && isLt5M
}


// 上传文件
const InfoCard: FC<Props> = (props) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const handleChange = info => {
    if (info.file.status === "uploading") {
      setLoading(true)
      return
    }
    if (info.file.status === "done") {
      const { code, data } = info.file.response
      if (code !== 0) {
        props?.getUrl?.(data.uri)
      } else {
        setImageUrl("")
      }
      props?.getUploadedRes?.(info.file.response)
      getBase64(info.file.originFileObj, imageUrl => {
        // setImageUrl(imageUrl)
        setLoading(false)
      })
    }
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{ marginTop: 8 }}>{props.title || "上传本地图片"} </div>
    </div>
  )

  useEffect(() => {
    const { storeData = {} } = store.getState()
    const { fileDomainUrl } = storeData
    if (props.electronicSignImg) {
      setImageUrl(fileDomainUrl + props.electronicSignImg)
    }
  }, [props.electronicSignImg])

  return <Upload
    headers={{
      Authorization: "Bearer " + getCookie("token")
    }}
    multiple={props.multiple}
    name="file"
    listType="picture-card"
    // className="avatar-uploader"
    showUploadList={false}
    action={BASE_URL.SAAS_API + "/file/upload"}
    beforeUpload={beforeUpload}
    onChange={handleChange}
    // {...props}
  >
    {imageUrl ? <img src={imageUrl} style={{ width: "90%", height: "80%" }}/> : uploadButton}
    {/*{imageUrl ? '存在' : '不存在'}*/}
  </Upload>
}

export default InfoCard


