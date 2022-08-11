import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import {TableView, WhiteCard, SearchForm} from '@/components'
import {Button, Form, Input, Modal, Switch, message, Space, Tag} from 'antd'
import CuRoleModal from './cuRoleModal'
import {changeStatusRole, roleUserRoleCheck} from '@/api/system'
import {getPagation} from '@/utils'
import {STATUS_STRING} from '@/utils/constants'
import {STATE} from './model'

const Confirm = Modal.confirm
const Role = ({dispatch, roleList, searchRoleForm, isCuRoleModalVisible}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  useEffect(() => {
    dispatch({
      type: 'role/save',
      payload: {
        searchRoleForm: {...STATE.searchRoleForm},
      },
    })
    getData()
  }, [])
  // 改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: 'role/save',
      payload: {
        searchRoleForm: {...searchRoleForm, pageNum, pageSize}
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'role/loadRoleList'
    })
    setLoading(false)
  }

  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[{
          key: 'roleName',
          component: <Input maxLength={20} placeholder="请输入角色名称" key="roleName"/>
        }]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'role/save',
                  payload: {
                    searchRoleForm: STATE.searchRoleForm
                  }
                })
                getData()
              }}
            >重置</Button>
            <Button
              type='primary'
              onClick={() => {
                setId(0)
                dispatch({
                  type: 'role/save',
                  payload: {
                    isCuRoleModalVisible: true
                  }
                })
              }}>
              新增
            </Button>
          </Space>
        }
        handleSearch={(e) => {
          dispatch({
            type: 'role/save',
            payload: {
              searchRoleForm: {...searchRoleForm, pageNum: 1, ...e}
            }
          })
          getData()
        }}
      />
    )
  }

  //修改状态
  const switchChange = (status, roleId) => {
    changeStatusRole({
      status: status ? '0' : '1',
      roleId
    }).then((res) => {
      if (res.code === 0) {
        message.success(status ? '已启用' : '已禁用')
        getData()
      }
    })
  }

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchRoleForm.pageNum - 1) * searchRoleForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '角色ID',
      dataIndex: 'roleId',
      width: 120,
    }, {
      title: '角色名称',
      width: 100,
      dataIndex: 'roleName',
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 120,
    }, {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (text) => {
        const ITEM = STATUS_STRING.find(({value}) => value === text);
        if (!ITEM) {
          return '-';
        }
        return <Tag color={ITEM.color}>{ITEM.used_label}</Tag>;
      }
    },
    {
      title: '操作',
      width: 120,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button type='link' onClick={() => {
              ;(async () => {
                if (+record.status) {
                  //调接口
                  switchChange(+record.status, record.roleId)
                } else {
                  let res: any = await roleUserRoleCheck({roleId: record.roleId})
                  if (res.code === 0) {
                    if (res.data.roleCheckMark === 1) {
                      //弹窗确认提示
                      Confirm({
                        title: (+record.status ? '启用' : '禁用') + '角色',
                        content: <p>确认{(+record.status ? '启用' : '禁用')}<span
                          style={{fontSize: '16px', fontWeight: 600, margin: '0 5px'}}>{record.roleName}</span>角色?</p>,
                        centered: true,
                        onOk: () => {
                          switchChange(+record.status, record.roleId)
                        }
                      });

                    } else if (res.data.roleCheckMark === 0) {
                      //调接口
                      switchChange(+record.status, record.roleId)
                    }
                  }
                }
              })()
            }}>{+record.status ? '启用' : '禁用'}角色</Button>
            <span className='tiny-delimiter'>|</span>
            <Button type='link' onClick={() => {
              setId(text.roleId)
              dispatch({
                type: 'role/save',
                payload: {
                  isCuRoleModalVisible: true
                }
              })
            }}>编辑</Button>
            <span className='tiny-delimiter'>|</span>
            <Button type='link' onClick={() => {
              Confirm({
                title: '删除',
                content: '确认删除?',
                centered: true,
                onOk: () => {
                  dispatch({
                    type: 'role/deleteRole',
                    payload: {
                      roleIds: [text.roleId]
                    }
                  })
                }
              });
            }}>删除</Button>
          </>
        );
      }
    }
  ]
  return (
    <WhiteCard style={{background: 'transparent'}}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchRoleForm),
        }}
        showTitle={false}
        dataSource={roleList}
        columns={columns as any}
        search={searchForm()}
        rowKey="roleId"
        loading={loading}
      />
      {isCuRoleModalVisible && <CuRoleModal roleId={id} parentForm={form}/>}
    </WhiteCard>
  )
}
export default connect(({role}) => ({
  roleList: role.roleList,
  searchRoleForm: role.searchRoleForm,
  isCuRoleModalVisible: role.isCuRoleModalVisible
}))(Role)


