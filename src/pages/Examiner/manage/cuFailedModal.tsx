import React, { Fragment, useEffect } from "react"
import { Form,  Modal, Row, Col, Input,  } from "antd"
import { connect } from "dva"
import "./index.less"
import {
  FORMITEM_LAYOUT
} from "@/utils/constants"

const { Item } = Form

const Manage = (props) => {
  const { isShowFailedModal, id, dispatch } = props
  const [form] = Form.useForm()
  //详情接口
  useEffect(() => {
  }, [])

  // 验证密码
  const handleOk = () => {
    form.validateFields().then(async (res) => {
      dispatch({
        type: "manage/checkPwd",
        payload: {
          ...res
        }
      }).then((res) => {  // 验证密码成功 查看考试列表
        dispatch({
          type: "manage/save",
          payload: {
            isShowFailedModal: false,
            isShowSuccessModal: true
          }
        })
      })
    })
  }
  //  取消
  const handleCancel = () => {
    dispatch({
      type: "manage/save",
      payload: {
        isShowFailedModal: false
      }
    })
  }

  return (
    <Modal
      title=''
      visible={isShowFailedModal}
      width="30%"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Fragment>
        <div className="failed_conatiner">
          <div className="i_failed">
            !
          </div>
          <div className="description">
            <p>人脸识别失败,抱歉, 没有认出您来</p>
            <p>刷脸登录只能由本人操作，您可以尝试输入账号登录密码解锁</p>
          </div>
          <div className="form_container">
            <Form
              layout='horizontal'
              form={form}
              colon={false}
              autoComplete="off"
              initialValues={{
              }}
            >
              <Row>
                <Col span={24}>
                  <Item  {...FORMITEM_LAYOUT} name="password" label="输入密码"
                         rules={[
                           { required: true, message: "请输入密码" }
                         ]}
                  >
                    <Input className="form_container_input" placeholder="请输入密码"
                           maxLength={11}/>
                  </Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Fragment>
    </Modal>
  )
}

export default connect(({ manage }) => ({
  isShowFailedModal: manage.isShowFailedModal
}))(Manage)
