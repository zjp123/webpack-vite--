import React, { useEffect } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'dva';
import { getRecordingInfo } from '@/api/electronic'

interface recordingProps {
  id?: number,
  isCheckRecordingModalVisible: boolean
  dispatch: Function
}

const Recording: React.FC<recordingProps> = (props) => {
  const {id, dispatch} = props
  const [form] = Form.useForm()
  //详情接口
  useEffect(() => {
    if (id) {
      ;(async () => {
        let res: any = await getRecordingInfo({id})
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
      title='机动车驾驶证业务清单'
      visible={true}
      width={800}
      onOk={() => {
      }}
      onCancel={() => {
        dispatch({
          type: 'recording/save',
          payload: {
            isCheckRecordingModalVisible: false,
          },
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
      >
        recording
      </Form>
    </Modal>
  )
}

export default connect(({recording}) => ({
  isCheckRecordingModalVisible: recording.isCheckRecordingModalVisible,
}))(Recording)
