import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, WhiteCard, SearchForm } from '@/components'
import AddDepartment from './cuDepartmentModal'
import { changeStatusDept } from '@/api/system'
import { Button, Form, Input, Modal, Tag, Space, message } from 'antd'
import { STATUS_STRING } from '@/utils/constants'
import { STATE } from './model'

const Confirm = Modal.confirm
const Department = ({ dispatch, departmentList, searchDepartmentForm, isDepartmentVisible }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [deptId, setdeptId] = useState(0)

  useEffect(() => {
    dispatch({
      type: 'department/save',
      payload: {
        searchDepartmentForm: { ...STATE.searchDepartmentForm }
      }
    })
    getData()
  }, [])
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'department/loadDepartmentList'
    })
    setLoading(false)
  }
  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'deptName',
            component: <Input maxLength={20} placeholder="请输入部门名称" key="deptName" />
          }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'department/save',
                  payload: {
                    searchDepartmentForm: STATE.searchDepartmentForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setdeptId(0)
                dispatch({
                  type: 'department/save',
                  payload: {
                    isDepartmentVisible: true
                  }
                })
              }}
            >
              新增
            </Button>
          </Space>
        }
        handleSearch={e => {
          dispatch({
            type: 'department/save',
            payload: {
              searchDepartmentForm: { ...searchDepartmentForm, ...e }
            }
          })
          getData()
        }}
      />
    )
  }
  const columns = [
    {
      title: '部门名称',
      width: 130,
      dataIndex: 'deptName'
    },
    {
      title: '部门编号',
      dataIndex: 'deptNo',
      width: 80
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 80
    },
    {
      title: '受理车型',
      dataIndex: 'perdritypesName',
      width: 60
    },
    {
      title: '部门状态',
      dataIndex: 'status',
      width: 80,
      render: text => {
        const ITEM = STATUS_STRING.find(({ value }) => value === text)
        if (!ITEM) {
          return '-'
        }
        return <Tag color={ITEM.color}>{ITEM.used_label}</Tag>
      }
    },
    {
      title: '操作',
      width: 120,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                ;(async () => {
                  let res: any = await changeStatusDept({
                    deptId: record.deptId,
                    ancestors: record.ancestors,
                    status: +record.status ? '0' : '1'
                  })
                  if (res.code === 0) {
                    message.success(+record.status ? '已启用' : '已禁用')
                    getData()
                  }
                })()
              }}
            >
              {+record.status ? '启用' : '禁用'}部门
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                setdeptId(record.deptId)
                dispatch({
                  type: 'department/save',
                  payload: {
                    isDepartmentVisible: true
                  }
                })
              }}
            >
              编辑
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={e => {
                Confirm({
                  title: '删除',
                  content: '确认删除?',
                  centered: true,
                  onOk: () => {
                    dispatch({
                      type: 'department/deleteDepartment',
                      payload: {
                        deptId: text.deptId
                      }
                    })
                  }
                })
              }}
            >
              删除
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard style={{ background: 'transparent' }}>
      <TableView
        hasPagination={false}
        showTitle={false}
        dataSource={departmentList}
        columns={columns as any}
        search={searchForm()}
        rowKey="deptId"
        loading={loading}
        extraHeight={-80}
      />
      {isDepartmentVisible && <AddDepartment deptId={deptId} parentForm={form} />}
    </WhiteCard>
  )
}
export default connect(({ department }) => ({
  departmentList: department.departmentList,
  searchDepartmentForm: department.searchDepartmentForm,
  isDepartmentVisible: department.isDepartmentVisible
}))(Department)
