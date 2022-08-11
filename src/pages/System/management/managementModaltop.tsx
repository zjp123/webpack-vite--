import React, {useState, useEffect} from "react"
import {Form, Input, Row, Col, Modal, Select} from "antd"
import {FORMITEM_LAYOUT} from "@/utils/constants"
import {connect} from "dva"
import {getdictionaryInfo} from "@/api/system"
import './index.less'

interface cuRoleModalProps {
  id?: number
  level?: any
  dictType?: any
  isCuRoleModalVisibletop: boolean
  dispatch: Function
}

const CuRoleModal: React.FC<cuRoleModalProps> = (props) => {
  const {isCuRoleModalVisibletop, id, dispatch, dictType} = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  //详情接口
  useEffect(() => {
    if (id) {
      ;(async () => {
        let res: any = await getdictionaryInfo({id})
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

  return (
    <Modal
      title={(id ? "修改字典数据" : "新增字典数据")}
      visible={isCuRoleModalVisibletop}
      destroyOnClose
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            await dispatch({
              type: "management/addOrUpdateSecondLevelDict",
              payload: {id, ...res}
            }).then(async (res) => {
              if (res?.code === 0) {
                await dispatch({
                  type: "management/loadSecondaryList",
                  payload: {
                    dictType: dictType
                  }
                })
              }
            })
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: "management/save",
          payload: {
            isCuRoleModalVisibletop: false
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
              {required: true, message: "字典类型"}
            ]} {...FORMITEM_LAYOUT} name="dictType" initialValue={dictType} label="字典类型">
              <Input disabled placeholder="字典类型"/>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item rules={[
              {required: true, message: "字典标签"}
            ]} {...FORMITEM_LAYOUT} name="dictLabel" label="字典标签">
              <Input placeholder="字典标签" maxLength={20}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {required: true, message: "字典键值"}
            ]} {...FORMITEM_LAYOUT} name="dictValue" label="字典键值">
              <Input placeholder="字典键值" maxLength={100}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item  {...FORMITEM_LAYOUT} name="isDefault" label="是否默认">
              <Select
                allowClear defaultValue="N" placeholder="是否默认">
                {[{value: "Y", label: "是", id: "0"}, {value: "N", label: "否", id: "1"},]?.map(({value, label, id}) => {
                  return <Select.Option value={value} key={id}>{label}</Select.Option>
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {required: true, message: "排序"}
            ]} {...FORMITEM_LAYOUT} name="dictSort" label="排序">
              <Input placeholder="排序" maxLength={20}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                message: "备注"
              }
            ]} {...FORMITEM_LAYOUT} name="remark" label="备注">
              <Input placeholder="备注"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({management}) => ({
  isCuRoleModalVisibletop: management.isCuRoleModalVisibletop
}))(CuRoleModal)
