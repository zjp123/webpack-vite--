import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Radio, Modal, TreeSelect, InputNumber } from 'antd'
import { FORMITEM_LAYOUT, STATUS_STRING } from '@/utils/constants'
import { connect } from 'dva'
import { getDepartmentInfo } from '@/api/system'
import { rulesNumber } from '@/utils'
import { getDict } from '@/utils/publicFunc'
const { TreeNode } = TreeSelect
interface DepartmentProps {
  deptId?: number
  isDepartmentVisible: boolean
  dispatch: Function
  treeSelectList: []
  parentForm: object
  office_perdritypesList: []
}
const Department: React.FC<DepartmentProps> = props => {
  const { isDepartmentVisible, deptId, dispatch, treeSelectList, parentForm, office_perdritypesList } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(undefined)

  //详情接口
  useEffect(() => {
    getDict(dispatch, 'office_perdritypes')
    if (deptId) {
      ;(async () => {
        let res: any = await getDepartmentInfo({ deptId })
        if (res.code === 0) {
          form.setFieldsValue({
            ...res.data
          })
        }
      })()
    } else {
      dispatch({
        type: 'global/treeSelectList'
      })
      form.resetFields()
    }
  }, [])
  // 生成子节点
  const getNode = list => {
    list = list || []
    return list.map(data => {
      return (
        <TreeNode title={data.label} key={data.id} value={`${data.id}`}>
          {data.children && getNode(data.children)}
        </TreeNode>
      )
    })
  }
  const onChange = value => {
    setValue(value)
    form.setFieldsValue({
      parentId: value
    })
  }
  return (
    <Modal
      title={(deptId ? '编辑' : '新增') + '部门'}
      visible={isDepartmentVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async res => {
          setLoading(true)
          try {
            if (deptId) {
              res.deptId = deptId
            }
            await dispatch({
              type: 'department/addDepartment',
              payload: {
                parentForm,
                res
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
          type: 'department/save',
          payload: {
            isDepartmentVisible: false
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
          status: '0'
        }}
      >
        <Row>
          {deptId ? null : (
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: '请填写父部门'
                  }
                ]}
                {...FORMITEM_LAYOUT}
                name="parentId"
                label="父部门"
              >
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  value={value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  onChange={onChange}
                >
                  {getNode(treeSelectList)}
                </TreeSelect>
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请填写部门名称'
                }
              ]}
              {...FORMITEM_LAYOUT}
              name="deptName"
              label="部门名称"
            >
              <Input placeholder="部门名称" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item rules={rulesNumber()} {...FORMITEM_LAYOUT} name="deptNo" label="部门编号">
              <Input placeholder="部门编号" maxLength={6} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请填写显示顺序'
                }
              ]}
              {...FORMITEM_LAYOUT}
              name="orderNum"
              label="显示顺序"
            >
              <InputNumber placeholder="显示顺序" maxLength={4} min={0} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: '请选择受理车型'
                }
              ]}
              {...FORMITEM_LAYOUT}
              name="perdritypes"
              label="受理车型"
            >
              <Radio.Group>
                {office_perdritypesList.map((item: any) => {
                  return (
                    <Radio value={item.value} key={item.value}>
                      {item.label}
                    </Radio>
                  )
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ department, global }) => ({
  isDepartmentVisible: department.isDepartmentVisible,
  treeSelectList: global.treeSelectList,
  office_perdritypesList: global.office_perdritypesList
}))(Department)
