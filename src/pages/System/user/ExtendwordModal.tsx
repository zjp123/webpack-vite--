import React, {useState, useEffect} from 'react'
import {Form, Row, Col, Modal, DatePicker} from 'antd'
import {FORMITEM_LAYOUT} from "@/utils/constants"
import {connect} from 'dva';

interface extendwordModalProps {
  userId?: number,
  userName?: string,
  isExtendwordlVisible: boolean,
  dispatch: Function,
}

const ExtendwordModal: React.FC<extendwordModalProps> = (props) => {
  const {isExtendwordlVisible, userId, dispatch, userName} = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  return (
    <Modal
      title={'延长用户有效期'}
      visible={isExtendwordlVisible}
      width={"30%"}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            if (userId) {
              res.userId = userId
            }
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'user/save',
          payload: {
            isExtendwordlVisible: false
          }
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Form.Item  {...FORMITEM_LAYOUT} name="policeOfficerMark" label="账号：">
              {userName}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: '请填写时间',
              },
            ]} {...FORMITEM_LAYOUT} name="policeOfficerMark" label="用户有效期">
              <DatePicker format="YYYY-MM-DD" allowClear placeholder="请输入"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({user, global}) => ({
  isExtendwordlVisible: user.isExtendwordlVisible,
}))(ExtendwordModal)
