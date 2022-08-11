import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import {
  WhiteCard,
  TableView,
  SearchForm,
  Images,
} from '@/components'
import {getPagation} from '@/utils'
import {STATE} from './model'
import {Button, Form, Input, Modal as antdModal} from 'antd'
import replacementPic from '@/components/Replacement'
import {getDict} from "@/utils/publicFunc";
import Modal from "./Modal"
import bejtu from '@/assets/img/bejtu.png'

const ElectronicSignature = ({dispatch, ESignList, searchESignListForm, visible}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'electronicSignature/save',
      payload: {
        searchESignListForm: {...STATE.searchESignListForm}
      }
    })
    getDict(dispatch, "eSginUserList")
    getData()
    return () => {
      dispatch({
        type: 'electronicSignature/save',
        payload: {
          ESignList: [],
          searchESignListForm: {...STATE.searchESignListForm},
          visible: false
        }
      })
    }
  }, [])
  //获取列表数据
  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: 'electronicSignature/loadESignList'
    })
    setLoading(false)
  }

  const getType = (value: 0 | 1) => {
    if (value === 0) {
      return '启用'
    }
    if (value === 1) {
      return '禁用'
    }
  }

  const getTypeColor = (value: 0 | 1) => {
    if (value === 0) {
      return '#00CC00'
    }
    if (value === 1) {
      return '#FF0000'
    }
  }

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: 'electronicSignature/save',
      payload: {
        searchESignListForm: {...searchESignListForm, pageNum, pageSize}
      }
    })
    getData()
  }
  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'userNameOrName',
            component: <Input maxLength={20} placeholder="请输入: 按账号/姓名查询"/>
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'electronicSignature/save',
                  payload: {
                    searchESignListForm: STATE.searchESignListForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <Button
              onClick={() => {
                dispatch({
                  type: 'electronicSignature/save',
                  payload: {
                    visible: true
                  }
                })
              }}
            >
              新增
            </Button>
          </>
        }
        handleSearch={e => {
          dispatch({
            type: 'electronicSignature/save',
            payload: {
              searchESignListForm: {
                ...searchESignListForm,
                pageNum: 1, ...e,
                userNameOrName: (e as any).userNameOrName
              }
            }
          })
          getData()
        }}
      />
    )
  }

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchESignListForm.pageNum - 1) * searchESignListForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '账号',
      width: 120,
      dataIndex: 'userName'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 80
    },
    {
      title: '所属部门',
      width: 160,
      dataIndex: 'deptName'
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      width: 60
    },
    {
      title: '电子签名/签章',
      dataIndex: 'picUrl',
      width: 100,
      render: text => {
        return text ? (
          replacementPic(text, <Images width={30} height={40} src={text}/>, {})
        ) : (
          <img src={bejtu} style={{marginRight: 0, width: '30px', height: `40px`}} alt=""/>
        )
      }
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime',
      width: 200
    },
    {
      title: '签名状态',
      dataIndex: 'signStatus',
      width: 80,
      render: text => <span style={{color: getTypeColor(text)}}>{getType(text)}</span>
    },
    {
      title: '操作',
      width: 200,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: 'electronicSignature/updateESignStatus',
                  payload: {
                    userId: record.userId,
                    signStatus: record.signStatus === 0 ? 1 : 0
                  }
                })
              }}
            >
              {getType(record.signStatus === 0 ? 1 : 0)}
            </Button>
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: 'electronicSignature/save',
                  payload: {
                    visible: true,
                    id: record.id
                  }
                })
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => {
                antdModal.confirm({
                  title: "删除",
                  content: "确认删除?",
                  centered: true,
                  onOk: () => {
                    dispatch({
                      type: 'electronicSignature/deleteESign',
                      payload: {
                        id: record.id
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
    <WhiteCard>
      {visible && <Modal/>}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchESignListForm)
        }}
        showTitle={false}
        dataSource={ESignList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({electronicSignature, global}) => ({
  ESignList: electronicSignature.ESignList,
  searchESignListForm: electronicSignature.searchESignListForm,
  visible: electronicSignature.visible,
  eSginUserListList: global.eSginUserListList
}))(ElectronicSignature)
