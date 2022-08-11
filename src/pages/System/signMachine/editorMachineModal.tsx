import React, { useState, useEffect } from 'react'
import {Form, Input, Row, Col, Radio, Modal, Tree, Select,} from 'antd'
import { FORMITEM_LAYOUT, } from '@/utils/constants'
import { connect } from 'dva'
import { signMachineGetClientInfoApi } from '@/api/system'
import {getDict} from "@/utils/publicFunc";
interface cuRoleModalProps {
  dispatch: Function
  exsList: any
  brand?: string
  model?: string
  id?: string
  isEditorMachineModalVisible?: boolean,
  serviceAddress?: string
  // gateControllerSchemeList?: any
}

const EditorMachineModal: React.FC<cuRoleModalProps> = props => {
  const { isEditorMachineModalVisible, dispatch, exsList, id, brand, model, serviceAddress } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", {keyword: val})
  }

  useEffect(() => {
    getDict(dispatch, "exs", {})
    getDict(dispatch, "gateControllerScheme")
  }, [])

  //详情接口
  useEffect(() => {
    if (id) {
      ; (async () => {
        let res: any = await signMachineGetClientInfoApi({ id, serviceAddress })
        // console.log(res, 'hahahhahahah')
        if (res.code === 0) {
          form.setFieldsValue({
            ...res.data,
            examSiteIds: res.data.examSites.map((item) => item.id)
          })
        }
      })()
    } else {
      form.resetFields()
    }
  }, [id])

  return (
    <Modal
      title='修改签字机信息'
      visible={isEditorMachineModalVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async res => {
          const parames = res
          delete parames.macManufacturerName
          delete parames.macCode
          setLoading(true)
          try {
            await dispatch({
              type: 'signMachine/updateClient',
              payload: {
                id,
                ...parames,
                brand,
                model
              }
            })
            await dispatch({
              type: 'signMachine/loadSignList'
            })
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'signMachine/save',
          payload: {
            isEditorMachineModalVisible: false
          }
        })
      }}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        autoComplete="off"
        initialValues={{
          status: '1',
          menuCheckStrictly: 1,
          deptCheckStrictly: 1
        }}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请选择考场'
                }
              ]}
              {...FORMITEM_LAYOUT}
              name="examSiteIds"
              label="更换考场"
            >
              <Select
                showSearch
                mode="multiple"
                allowClear defaultActiveFirstOption={false} placeholder="请选择考场名称"
                onSearch={handleSearchExam}
                filterOption={handleFilterOption}
              >
                {exsList?.map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
                }
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="gateControlScheme"
              label="控制指令"
            >
              <Select placeholder="请选择档案名称" allowClear>
                {gateControllerSchemeList?.map(({value, label}) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="serviceAddress"
              label="服务地址"
            >
              <Input placeholder='服务地址' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="macCode"
              label="设备编码"
            >
              <Input disabled={true} placeholder='设备编码' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="macManufacturerName"
              label="所属厂家"
            >
              <Input disabled={true} placeholder='所属厂家' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: "请选择设备状态"
              }
            ]} {...FORMITEM_LAYOUT} name="status" label="设备状态">
              <Radio.Group>
                <Radio value={0} key={0}>启用</Radio>
                <Radio value={1} key={1}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
        </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ signMachine, global }) => ({
  isEditorMachineModalVisible: signMachine.isEditorMachineModalVisible,
  id: signMachine.id,
  examSiteTypeList: global.examSiteList,//考场
  exsList: global.exsList,
  // gateControllerSchemeList: global.gateControllerSchemeList,//道闸方案
}))(EditorMachineModal)
