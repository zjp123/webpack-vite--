import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Modal } from 'antd'
import { connect } from 'dva'
import { message } from 'antd'
import { EMAIL_REGEXP, TEL_REGEXP } from '@/utils/constants'

const FORMITEM_LAYOUT = {
  labelCol: {
    span: 24,
    style: {
      marginBottom: '0px',
      padding: 0,
    },
  },
  wrapperCol: {
    span: 22,
  },
  style: { marginBottom: '4px' },
}
const Comparison = (props) => {
  const { isCoachModalVisible, dispatch, info, personId, userInfo } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  //详情接口
  useEffect(() => {
    form.setFieldsValue({
      ...props.info,
    })
  }, [])
  return (
    <Modal
      title="修改考生基本信息"
      visible={isCoachModalVisible}
      width={560}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            await dispatch({
              type: 'information/addModification',
              payload: {
                ...res,
                id: personId
              }
            })
            await dispatch({
              type: 'information/loadModification',
              payload: {personId}
            })
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'information/save',
          payload: {
            isCoachModalVisible: false,
          },
        })
      }}
    >
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Row style={{ padding: '8px 40px', justifyContent: 'space-between' }}>
          <Col span={12}>
            <Form.Item {...FORMITEM_LAYOUT} rules={[{ pattern: TEL_REGEXP, message: '请输入正确的联系电话' }]} name="contactPhone" label="联系电话">
              <Input placeholder="请输入" maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[{ pattern: EMAIL_REGEXP, message: '请输入正确的邮箱格式' }]} {...FORMITEM_LAYOUT} name="eMail" label="电子邮箱">
              <Input placeholder="请输入" maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...FORMITEM_LAYOUT} name="postCode" label="联系住所邮政编码">
              <Input placeholder="请输入" maxLength={6} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...FORMITEM_LAYOUT} name="contactResidence" label="联系住所行政区划">
              <Input placeholder="请输入" maxLength={200} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...FORMITEM_LAYOUT} name="contactAddress" label="联系住所详细地址">
              <Input placeholder="请输入" maxLength={2000} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ information }) => ({
  isCoachModalVisible: information.isCoachModalVisible,
  userInfo: information.userInfo
}))(Comparison)
