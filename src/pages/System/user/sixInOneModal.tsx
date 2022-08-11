import React, {useState, useEffect} from 'react'
import {Form, Row, Col, Modal, Input} from 'antd'
import {FORMITEM_LAYOUT} from "@/utils/constants"
import {connect} from 'dva';

const SixInOneModal = (props) => {
  const {isSixInOneVisible, userId, dispatch, sixInOneUserDetail, associationStatus, clearUserId} = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    userId && dispatch({
      type: 'user/loadSixInOneUserDetail',
      payload: {
        userId
      }
    })
  }, [userId])

  useEffect(() => {
    if(JSON.stringify(sixInOneUserDetail) !== '{}') {
      form.setFieldsValue({
        ...sixInOneUserDetail
      })
    }
  }, [sixInOneUserDetail])

  useEffect(() => {
    switch (associationStatus) {
      case 0:
        setStatus('解除账号关联')
        break;
      case 1:
        setStatus('账号关联')
        break;
      default:
        break;
    }
  }, [associationStatus])

  const cleanup = () => {
    dispatch({
      type: 'user/save',
      payload: {
        isSixInOneVisible: false,
        sixInOneUserDetail: {},
        associationStatus: undefined
      }
    })
    clearUserId()
  }

  return (
    <Modal
      title={status}
      visible={isSixInOneVisible}
      width={"30%"}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            dispatch({
              type: 'user/updateSixInOneUser',
              payload: {
                ...res,
                userId,
                associationStatus: associationStatus === 1 ? 0 : 1
              }
            })
            cleanup()
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })

      }}
      onCancel={cleanup}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: '请填写账号',
              },
            ]} {...FORMITEM_LAYOUT} name="sixInOneUsername" label="关联账号：">
              <Input disabled={status === '解除账号关联'} placeholder="请输入关联账号..."/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: '请填写密码',
              },
            ]} {...FORMITEM_LAYOUT} name="sixInOnePassword" label="关联密码：">
              <Input disabled={status === '解除账号关联'} placeholder="请输入关联密码..."/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({user}) => ({
  isSixInOneVisible: user.isSixInOneVisible,
  sixInOneUserDetail: user.sixInOneUserDetail,
  associationStatus: user.associationStatus
}))(SixInOneModal)
