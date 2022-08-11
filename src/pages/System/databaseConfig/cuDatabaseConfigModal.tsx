import React, { useState, useEffect } from 'react'
import {Form, Input, Row, Col, Radio, Modal, Tree, Select,} from 'antd'
import { FORMITEM_LAYOUT, } from '@/utils/constants'
import { connect } from 'dva'
import {loadDatabaseConfigDetailApi} from '@/api/system'
import {getDict} from "@/utils/publicFunc";
interface cuRoleModalProps {
  dispatch: Function
  id?: string
  isCuDatabaseConfigModalVisible?: boolean
  databaseDriverList?: any
  databaseNameList?: any
}

const CuDatabaseConfigModal: React.FC<cuRoleModalProps> = props => {
  const { isCuDatabaseConfigModalVisible, dispatch, databaseDriverList, id, databaseNameList } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDict(dispatch, "databaseDriver", {})
    getDict(dispatch, "databaseName")
    return () => {
      dispatch({
        type: 'databaseConfig/save',
        payload: {
          id: ''
        }
      })
    }
  }, [])

  //详情接口
  useEffect(() => {
    if (id) {
      ; (async () => {
        let res: any = await loadDatabaseConfigDetailApi({ id })
        if (res.code === 0) {
          form.setFieldsValue({
            ...res.data,
          })
        }
      })()
    } else {
      form.resetFields()
    }
  }, [id])

  return (
    <Modal
      title={`${id ? '修改' : '新增'}数据库配置`}
      visible={isCuDatabaseConfigModalVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async res => {
          setLoading(true)
          try {
            await dispatch({
              type: 'databaseConfig/saveOrUpdateDatabaseConfig',
              payload: {
                id,
                ...res
              }
            })
            await dispatch({
              type: 'databaseConfig/loadDatabaseConfigList'
            })
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: 'databaseConfig/save',
          payload: {
            isCuDatabaseConfigModalVisible: false
          }
        })
      }}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        autoComplete="off"
      >
        <Row>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="databaseName"
              label="数据库名称"
            >
              <Input placeholder='请输入数据库名称...'/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请选择数据库别名'
                }
              ]}
              {...FORMITEM_LAYOUT}
              name="name"
              label="数据库别名"
            >
              <Select placeholder="请选择数据库别名..." allowClear>
                {databaseNameList?.map(({code, name}) => {
                  return (
                    <Select.Option value={code} key={code}>
                      {name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="url"
              label="URL"
            >
              <Input placeholder='请输入URL...'/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="username"
              label="用户名"
            >
              <Input placeholder='请输入用户名...' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="password"
              label="用户密码"
            >
              <Input placeholder='请输入用户密码...' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              {...FORMITEM_LAYOUT}
              name="driverClassName"
              label="数据库驱动"
            >
              <Select placeholder="请选择数据库驱动..." allowClear>
                {databaseDriverList?.map(({code, name}) => {
                  return (
                    <Select.Option value={code} key={code}>
                      {name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: "请选择是否主库"
              }
            ]} {...FORMITEM_LAYOUT} name="isMaster" label="是否主库">
              <Radio.Group>
                <Radio value={0} key={0}>否</Radio>
                <Radio value={1} key={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: "请选择是否初始化"
              }
            ]} {...FORMITEM_LAYOUT} name="isInit" label="是否初始化">
              <Radio.Group>
                <Radio value={0} key={0}>否</Radio>
                <Radio value={1} key={1}>是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ databaseConfig, global }) => ({
  isCuDatabaseConfigModalVisible: databaseConfig.isCuDatabaseConfigModalVisible,
  id: databaseConfig.id,
  examSiteTypeList: global.examSiteList,//考场
  databaseDriverList: global.databaseDriverList,
  databaseNameList: global.databaseNameList,//道闸方案
}))(CuDatabaseConfigModal)
