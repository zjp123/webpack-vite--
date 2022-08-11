import React, { useState, useEffect } from "react"
import { Form, Input, Row, Col, Modal } from "antd"
import { connect } from "dva"
import { TEL_REGEXP } from "@/utils/constants"
import { getdrvingIofo } from "@/api/drivingTest"
import {FORMITEM_LAYOUT} from "@/utils/constants"

const Comparison = (props) => {
  const { isCoachModalVisible, id, dispatch, drivInfo } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  //详情接口
  const getInfo = async () => {
    await dispatch({
      type: 'coachCarinformation/loadDrivInfo',
      payload: {
        id
      }
    })
    console.log("drivInfo", drivInfo)
    form.setFieldsValue({
      ...drivInfo
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      ...drivInfo
    })
  }, [])

  return (
    <Modal
      title='修改驾校信息'
      visible={isCoachModalVisible}
      width={560}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            if (id) {
              res.id = id
            }
            await dispatch({
              type: "coachCarinformation/addDrivingSchool",
              payload: res
            })
            await getInfo()
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: "coachCarinformation/save",
          payload: {
            isCoachModalVisible: false
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
        <Row style={{ padding: "8px 40px", justifyContent: "space-between" }}>
          <Col span={24}>
            <Form.Item  {...FORMITEM_LAYOUT}  name="contactUser" label="联系人姓名">
              <Input placeholder="联系人姓名" maxLength={20}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[{ message: "请输入合法手机号" }, { pattern: TEL_REGEXP, message: "请输入合法电话号码,固话格式 xxx-xxx" }]}
              {...FORMITEM_LAYOUT} name="contactTel" label="联系电话">
              <Input placeholder="联系电话" maxLength={15}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item {...FORMITEM_LAYOUT} name="contactAddress" label="驾校地址">
              <Input placeholder="驾校地址" maxLength={100}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ coachCarinformation }) => ({
  SouYList: coachCarinformation.SouYList,
  isCoachModalVisible: coachCarinformation.isCoachModalVisible,
  drivInfo: coachCarinformation.drivInfo,
}))(Comparison)
