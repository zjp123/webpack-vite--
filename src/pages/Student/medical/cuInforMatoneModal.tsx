import React, { useState, useEffect } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'dva'
import { getstudent } from '@/api/student'
import { Images } from '@/components'
import './style.less'
interface CuInforMatoneModalProps {
  id?: number
  isCuInformationModalVisible: boolean
  dispatch: Function
  imgsrcInfo: any
}
const CuInforMatoneModal: React.FC<CuInforMatoneModalProps> = props => {
  const { isCuInformationModalVisible, id, dispatch } = props
  const [form] = Form.useForm()
  const [loading] = useState(false)
  const [res, setRes] = useState({})
  //详情接口
  useEffect(() => {
    ;(async () => {
      let res: any = await getstudent({ id })
      setRes(res.data)
    })()
  }, [])
  return (
    <div className="modal_container">
      <Modal
        // title=" "
        visible={isCuInformationModalVisible}
        confirmLoading={loading}
        footer={null}
        onOk={() => {}}
        onCancel={() => {
          dispatch({
            type: 'medical/save',
            payload: {
              isCuInformationModalVisible: false
            }
          })
        }}
      >
        <div className="flex-center-column">
          <Images src={res['healthUrl']} enlarge={true} />
        </div>
      </Modal>
    </div>
  )
}
export default connect(({ medical }) => ({
  isCuInformationModalVisible: medical.isCuInformationModalVisible
}))(CuInforMatoneModal)
