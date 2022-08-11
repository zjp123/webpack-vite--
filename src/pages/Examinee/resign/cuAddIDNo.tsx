import React, { useState } from "react"
import { Form, Input, Row, Col, Modal } from "antd"
import { FORMITEM_LAYOUT, ID_REGEXP } from "@/utils/constants"
import { connect } from "dva"
import { openNotification } from "@/components/OpenNotification"

const { Item } = Form
const AddIDNo = (props) => {
  const { dispatch, isShowWriting } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 根据身份证号查询成绩单
  const handleOnOk = () => {
    form.validateFields().then(async (res) => {
      dispatch({
        type: "resign/save",
        payload: {
          isShowWriting: false
        }
      })
      hasUnsignedReport(res?.idCard)
    })
  }

  // 1. 验证是否还有未签字成绩单
  const hasUnsignedReport = (idCard) => {
    dispatch({
      type: "resign/hasUnsignedReport",
      payload: {
        idCard
      }
    }).then((res) => {
      if (res?.isHas === 0) { // 没有未签名成绩单
        openNotification({ message: "您好, 您暂时没有未签名成绩单!" }, "error", false)
        dispatch({
          type: "resign/save",
          payload: {
            isShowWriting: false,
            isShowResignContent: true, // 默认显示读身份证页面
            isShowScoreReport: false, // 默认显示读身份证页面
            isShowPlaceholderImg: false, //默认显示占位图
          }
        })
      } else { // 仍有未签名成绩单, 获取一张成绩单
        // 1. 仍有未签字成绩单 去查成绩单
        dispatch({
          type: "resign/save",
          payload: {
            isShowResignContent: false, // 关闭读身份证页
            isShowPlaceholderImg: true // 打开占位图
          }
        })
        dispatch({
          type: "resign/loadUnsignScoreReport",
          payload: {
            idCard
          }
        }).then((res) => {
          dispatch({
            type: "resign/save",
            payload: {
              scoreReport: res?.data,
              isShowPlaceholderImg: false, // 关闭占位图
              isShowScoreReport: true // 打开成绩单页
            }
          })
        })
      }
    })
  }

  return (
    <Modal
      title="请输入身份证号"
      visible={isShowWriting}
      width="30%"
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={() => {
        dispatch({
          type: "resign/save",
          payload: {
            isShowWriting: false
          }
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
        initialValues={{}}
      >
        <Row>
          <Col span={24}>
            <Item
              {...FORMITEM_LAYOUT}
              rules={[{ required: true, message: "请输入身份证号" }, { pattern: ID_REGEXP, message: "请输入合法身份证号码" }]}
              label="身份证号"
              name="idCard">
              <Input placeholder="请输入身份证号" allowClear/>
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ resign }) => ({
  isShowWriting: resign.isShowWriting
}))(AddIDNo)
