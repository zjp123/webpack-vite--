import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, WhiteCard } from '@/components'
import { Modifythesecurity } from '@/api/system'
import { Button, Col, Form, Row, Space, Input, Switch, message } from 'antd'
import { getPagation } from '@/utils'
import { STATE } from './model'
import SecurityModal from './securityModal'
const { Item } = Form
//安全策略
const Security = ({ dispatch, SecurityPolicyList, searchTheoperationForm, isDepartmentVisible }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  useEffect(() => {
    dispatch({
      type: 'security/save',
      payload: {
        searchTheoperationForm: { ...STATE.searchTheoperationForm }
      }
    })
    getData()
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'security/save',
      payload: {
        searchTheoperationForm: { ...searchTheoperationForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'security/loadsSecurityPolicyList'
    })
    setLoading(false)
  }

  const switchChange = (checked, id) => {
    Modifythesecurity({
      status: +checked ? '0' : '1',
      id
    }).then(res => {
      if (res.code === 0) {
        message.success(+checked ? '已启用' : '已禁用')
        getData()
      }
    })
  }
  const rightRender = () => {
    return (
      <Space>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button
          onClick={() => {
            form.resetFields()
            dispatch({
              type: 'security/save',
              payload: {
                searchTheoperationForm: STATE.searchTheoperationForm
              }
            })
            getData()
          }}
        >
          重置
        </Button>
      </Space>
    )
  }
  // 查询区域
  const searchForm = () => {
    return (
      <Row gutter={10} style={{ marginBottom: '8px' }}>
        <Form
          form={form}
          autoComplete="off"
          colon={false}
          layout="inline"
          style={{ width: '100%' }}
          onFinish={e => {
            dispatch({
              type: 'security/save',
              payload: {
                searchTheoperationForm: { ...searchTheoperationForm, ...e }
              }
            })
            getData()
          }}
        >
          <Col flex={1}>
            <Row>
              <Col>
                <Item name="configName">
                  <Input maxLength={20} placeholder="请输入参数名称" key="configName" />
                </Item>
              </Col>
            </Row>
          </Col>
          <Col style={{ textAlign: 'right' }}>{rightRender()}</Col>
        </Form>
      </Row>
    )
  }

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchTheoperationForm.pageNum - 1) * searchTheoperationForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      width: 150
    },
    {
      title: '参数键值',
      dataIndex: 'configKey',
      width: 160
    },
    {
      title: '参数值',
      width: 100,
      dataIndex: 'configValue'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150
    },
    {
      title: '启用/禁用',
      dataIndex: 'status',
      width: 150,
      render: (text: string, record: Result.ObjectType) => {
        return <Switch checked={!!!Number(text)} onChange={checked => switchChange(checked, record.id)} />
      }
    },
    {
      title: '操作',
      dataIndex: 'contactPhone',
      width: 120,
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setId(record.id)
                dispatch({
                  type: 'security/save',
                  payload: {
                    isDepartmentVisible: true
                  }
                })
              }}
            >
              修改
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard style={{ background: 'transparent' }}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchTheoperationForm)
        }}
        showTitle={false}
        dataSource={SecurityPolicyList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        getSelection={getSelection}
        loading={loading}
      />
      {isDepartmentVisible && <SecurityModal id={id} />}
    </WhiteCard>
  )
}
export default connect(({ security }) => ({
  SecurityPolicyList: security.SecurityPolicyList,
  searchTheoperationForm: security.searchTheoperationForm,
  isDepartmentVisible: security.isDepartmentVisible
}))(Security)
