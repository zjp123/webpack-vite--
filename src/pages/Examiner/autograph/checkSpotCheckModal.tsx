import React, { useEffect } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'dva';
import { getSpotCheckInfo } from '@/api/electronic'

interface spotCheckProps {
  id?: number,
  isCheckSpotCheckModalVisible: boolean,
  dispatch: Function
}

const SpotCheck: React.FC<spotCheckProps> = (props) => {
  const {id, dispatch} = props
  const [form] = Form.useForm()
  //详情接口
  useEffect(() => {
    if (id) {
      ;(async () => {
        let res: any = await getSpotCheckInfo({id})
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
          type: 'spotCheck/save',
          payload: {
            isCheckSpotCheckModalVisible: false,
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
        spotCheck
      </Form>
    </Modal>
  )
}

export default connect(({spotCheck}) => ({
  isCheckSpotCheckModalVisible: spotCheck.isCheckSpotCheckModalVisible,
}))(SpotCheck)
