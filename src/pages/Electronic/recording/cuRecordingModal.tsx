import React, { useState, useEffect } from "react"
import { Form, Modal } from "antd"
import { connect } from "dva"
import { Images } from "@/components"
import { getComparisonInfo } from "@/api/electronic"

interface CuInforMatoneModalProps {
  id?: number
  isCuInformationModalVisible: boolean
  dispatch: Function
  imgsrcInfo: any
  isCheckRecordingModalVisible: boolean
  data:any
}

const CuRecordingModal: React.FC<CuInforMatoneModalProps> = props => {
  const { isCheckRecordingModalVisible, id, dispatch, imgsrcInfo ,data} = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  //详情接口
  useEffect(() => {
    if (id) {
      ;(async () => {
        let res: any = await getComparisonInfo({ id })
        if (res.code === 0) {
          form.setFieldsValue(res.data)
        }
      })()
    } else {
      form.resetFields()
    }
  }, [])
  return (
    <Modal
      visible={isCheckRecordingModalVisible}
      title={`${data?.name} - ${imgsrcInfo.archivesTypeName}`}
      confirmLoading={loading}
      footer={null}
      onOk={() => {
      }}
      onCancel={() => {
        dispatch({
          type: "recording/save",
          payload: {
            isCheckRecordingModalVisible: false
          }
        })
      }}
    >
      <section className="flex-center">
        <Images src={imgsrcInfo.archivesPdfPhoto} width={300}/>
        {/* <Images src={imgsrcInfo.archivesPdfPhoto} width={300} /> */}

      </section>
    </Modal>
  )
}
export default connect(({ recording }) => ({
  isCheckRecordingModalVisible: recording.isCheckRecordingModalVisible
}))(CuRecordingModal)
