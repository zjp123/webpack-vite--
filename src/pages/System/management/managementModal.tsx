import React, { useState, useEffect } from "react"
import { Form, Input, Row, Col, Modal } from "antd"
import { FORMITEM_LAYOUT } from "@/utils/constants"
import { connect } from "dva"
import { getRolep } from "@/api/system"
import './index.less'

interface cuRoleModalProps {
  dictId?: number
  isCuRoleModalVisible: boolean
  dispatch: Function
  parentForm: object
}

const CuRoleModal: React.FC<cuRoleModalProps> = (props) => {
  const { isCuRoleModalVisible, dictId, dispatch, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  //详情接口
  useEffect(() => {
    if (dictId) {
      ; (async () => {
        let res: any = await getRolep({ id: dictId })
        if (res.code === 0) {
          form.setFieldsValue({
            ...res.data
          })
        }
      })()
    } else {
      form.resetFields()
    }
  }, [])

  // 新增/更新字典ok
  const handleOnOk = () => {
    form.validateFields().then(async (res) => {
      try {
        if (dictId) {
          res.id = dictId
        }
        await dispatch({
          type: "management/addOrUpdateFirstLevelDict",
          payload: {
            parentForm,
            postData: {
              ...res
            }
          }
        })
      } catch (err) {
        setLoading(false)
      }
    })
  }
  return (
    <Modal
      title={(dictId ? "修改字典数据  " : "新增字典数据")}
      visible={isCuRoleModalVisible}
      width={800}
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={() => {
        dispatch({
          type: "management/save",
          payload: {
            isCuRoleModalVisible: false
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
            <Form.Item rules={[
              {
                required: true,
                message: "字典名称"
              }
            ]} {...FORMITEM_LAYOUT} name="dictName" label="字典名称">
              <Input placeholder="字典名称" maxLength={50} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: "字典键值"
              }
            ]} {...FORMITEM_LAYOUT} name="dictType" label="字典键值">
              <Input placeholder="字典键值" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                message: "备注"
              }
            ]} {...FORMITEM_LAYOUT} name="remark" label="备注">
              <Input placeholder="备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ management }) => ({
  isCuRoleModalVisible: management.isCuRoleModalVisible
}))(CuRoleModal)
