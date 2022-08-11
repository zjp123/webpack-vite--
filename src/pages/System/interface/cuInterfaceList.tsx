import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Radio, Modal, TreeSelect } from 'antd'
import { connect } from 'dva';
import { FORMITEM_LAYOUT } from "@/utils/constants"
import { interfaceListInfo } from '@/api/system'

import { iPtest } from "@/utils";

const { TreeNode } = TreeSelect;

interface CuInterfaceMoalProps {
  id?: number,
  dispatch: Function,
  parentForm: object

}

const CuInterfaceMoal: React.FC<CuInterfaceMoalProps> = (props) => {
  const { id, dispatch, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  //详情接口
  useEffect(() => {
    if (id) {
      ; (async () => {
        let res: any = await interfaceListInfo({ id })
        if (res.code === 0) {
          form.setFieldsValue(res.data)
        }
      })()
    } else {
      form.resetFields()
    }
  }, [])
  const getNode = (list) => {
    list = list || [];
    return list.map((data) => {
      return (
        <TreeNode title={data.label} key={data.id} value={`${data.id}`}>
          {
            data.children && getNode(data.children)
          }
        </TreeNode>
      );
    });
  }

  return (
    <Modal
      title={(id ? '编辑' : '新增') + '接口'}
      visible={true}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            if (id) {
              res.id = id
            }
            await dispatch({
              type: 'interfaceManagement/addInterface',
              payload: {
                parentForm,
                postData: { ...res }
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
          type: 'interfaceManagement/save',
          payload: {
            isInterfaceVisible: false
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
                message: '请选择接口状态',
              },
            ]} {...FORMITEM_LAYOUT} name="status" label="接口状态">
              <Radio.Group defaultValue={0}>
                {
                  [{ value: 0, label: '正常' }, { value: 1, label: '禁用' }].map(({ value, label }) => {
                    return <Radio value={value} key={value}>{label}</Radio>
                  })
                }
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入配置名称" }]}
              {...FORMITEM_LAYOUT} name="name" label="配置名称">
              <Input placeholder="配置名称" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入接口类型" }]}
              {...FORMITEM_LAYOUT} name="type" label="接口类型">
              <Input placeholder="接口类型" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={iPtest()}
              {...FORMITEM_LAYOUT} name="authIp" label="准入ip">
              <Input placeholder="准入ip" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入端口号" }]}
              {...FORMITEM_LAYOUT} name="serviceIp" label="端口号">
              <Input placeholder="端口号" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务Service" }]}
              {...FORMITEM_LAYOUT} name="serviceUrl" label="业务服务Service">
              <Input placeholder="业务服务Service" maxLength={300} minLength={0} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务系统接口类别" }]}
              {...FORMITEM_LAYOUT} name="serviceSystemType" label="业务服务系统接口类别">
              <Input placeholder="业务服务系统接口类别" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务接口序列号" }]}
              {...FORMITEM_LAYOUT} name="serviceInterfaceSerialno" label="业务服务接口序列号">
              <Input placeholder="业务服务接口序列号" maxLength={300} minLength={0} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务场景编号" }]}
              {...FORMITEM_LAYOUT} name="serviceSceneNo" label="业务服务场景编号">
              <Input placeholder="业务服务场景编号" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务单位机构代码" }]}
              {...FORMITEM_LAYOUT} name="serviceOfficeCode" label="业务服务单位机构代码">
              <Input placeholder="业务服务单位机构代码" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务单位机构名称" }]}
              {...FORMITEM_LAYOUT} name="serviceOfficeName" label="业务服务单位机构名称">
              <Input placeholder="业务服务单位机构名称" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务用户标识" }]}
              {...FORMITEM_LAYOUT} name="serviceUserCode" label="业务服务用户标识">
              <Input placeholder="业务服务用户标识" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务用户名称" }]}
              {...FORMITEM_LAYOUT} name="serviceUserName" label="业务服务用户名称">
              <Input placeholder="业务服务用户名称" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={[{ required: true, message: "请输入业务服务终端标识" }]}
              {...FORMITEM_LAYOUT} name="serviceTerminalMark" label="业务服务终端标识">
              <Input placeholder="业务服务终端标识" maxLength={18} minLength={18} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ interfaceManagement }) => ({
  isInterfaceVisible: interfaceManagement.isInterfaceVisible
}))(CuInterfaceMoal)
