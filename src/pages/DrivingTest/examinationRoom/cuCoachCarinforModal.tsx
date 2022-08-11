import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Modal } from 'antd'
import { connect } from 'dva'
import { getInfoCardDataApi } from '@/api/drivingTest'
import { NAME_REGEXP, TEL_REGEXP } from '@/utils/constants'
import { FORMITEM_LAYOUT } from '@/utils/constants'

const Comparison = props => {
  const { isCoachModalVisible, id, dispatch } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getInfoCardData()
  }, [])

  //详情接口
  const getInfoCardData = () => {
    if (id) {
      ;(async () => {
        let res: any = await getInfoCardDataApi({ id })
        if (res.code === 0) {
          form.setFieldsValue({
            ...res.data
          })
        }
      })()
    } else {
      form.resetFields()
    }
  }

  return (
    <Modal
      title={(id ? '修改考场' : '') + '信息'}
      visible={isCoachModalVisible}
      width={560}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async res => {
          try {
            if (id) {
              res.id = id
            }
            await dispatch({
              type: 'examinationRoom/editExaminationRoom',
              payload: res
            })
            await dispatch({
              type: 'examinationRoom/getInfoCardData',
              payload: { id }
            })
            setLoading(false)
          } catch (err) {}
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'examinationRoom/save',
          payload: {
            isCoachModalVisible: false
          }
        })
      }}
    >
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Row style={{ padding: '8px 40px', justifyContent: 'space-between' }}>
          <Col span={24}>
            <Form.Item rules={[{ pattern: NAME_REGEXP, message: '请输入合法姓名' }]} {...FORMITEM_LAYOUT} name="contactUser" label="联系人姓名">
              <Input placeholder="联系人姓名" maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ pattern: TEL_REGEXP, message: '请输入合法手机号' }]} {...FORMITEM_LAYOUT} name="contactTel" label="联系电话">
              <Input placeholder="联系电话" maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...FORMITEM_LAYOUT} name="contactAddress" label="考场地址">
              <Input placeholder="考场地址" maxLength={20} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ examinationRoom }) => ({
  SouYList: examinationRoom.SouYList,
  isCoachModalVisible: examinationRoom.isCoachModalVisible
}))(Comparison)
