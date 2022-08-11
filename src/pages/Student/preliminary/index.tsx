import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, WhiteCard, SearchForm, Images } from '@/components'
import { Button, Form, Input, Select } from 'antd'
import { AcceptStatus, Signuptreview } from '@/utils/constants'
import { getPagation, goto } from '@/utils'
import { STATE } from './model'
import { getDict } from '@/utils/publicFunc'
import signatrueImg from '@/assets/img/signatrue.png'
const Preliminary = ({ dispatch, preliList, searchPreliminaryForm, bizTypeList, perdritypeList, signUpReviewResultsList, acceptStatusList, keepaliveSearchForm }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)

  const setSearchForm = () => {
    if(keepaliveSearchForm) {
      dispatch({
        type: "preliminary/save",
        payload: {
          searchPreliminaryForm: {...keepaliveSearchForm},
          keepaliveSearchForm: null,
        }
      })
    } else {
      dispatch({
        type: "preliminary/save",
        payload: {
          searchPreliminaryForm: {...STATE.searchPreliminaryForm}
        }
      })
    }
  }

  useEffect(() => {
    setSearchForm()
    getData()
    getDict(dispatch, 'bizType')
    getDict(dispatch, 'perdritype')
    getDict(dispatch, 'signUpReviewResults')
    getDict(dispatch, 'acceptStatus')
    return () => {
      dispatch({
        type: "preliminary/save",
        payload: {
          preliList: [],
          searchPreliminaryForm: {
            pageNum: 1,
            pageSize: 10,
            name:"",
            perdritype:"",
            businessType:""
          },
          isCuRoleModalVisible: false,
        }
      })
    }
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'preliminary/save',
      payload: {
        searchPreliminaryForm: { ...searchPreliminaryForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'preliminary/loadPreliList'
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
            key: 'name',
            component: <Input maxLength={20} placeholder="请输入考生姓名/身份证号" key="name" />
          },
          {
            key: 'perdritype',
            component: (
              <Select placeholder="请选择准驾车型" allowClear>
                {perdritypeList.map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          },
          {
            key: 'businessType',
            component: (
              <Select placeholder="请选择业务类型" allowClear>
                {bizTypeList.filter((item) => {
                  return item.name === '初次申领' || item.name === '增驾申请'
                }).map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          },
          {
            key: 'uploadStatus',
            component: (
              <Select placeholder="请选择报名审核结果" allowClear>
                {signUpReviewResultsList.map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          },
          {
            key: 'acceptStatus',
            component: (
              <Select placeholder="请选择受理状态" allowClear>
                {acceptStatusList.map(({ value, label }) => {
                  return (
                    <Select.Option value={label} key={value}>
                      {value}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'preliminary/save',
                  payload: {
                    searchPreliminaryForm: { ...STATE.searchPreliminaryForm }
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
          </>
        }
        handleSearch={e => {
          dispatch({
            type: 'preliminary/save',
            payload: {
              searchPreliminaryForm: { ...searchPreliminaryForm, pageNum: 1, ...e }
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
        return <span>{(searchPreliminaryForm.pageNum - 1) * searchPreliminaryForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100
    },
    {
      title: '身份号码',
      width: 180,
      dataIndex: 'idcard'
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      width: 140
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      width: 120,
      render: text => {
        const ITEM = bizTypeList.find(({ value }) => value === text)
        if (!ITEM) {
          return '-'
        }
        return <span>{ITEM.label}</span>
      }
    },
    {
      title: '准驾车型',
      dataIndex: 'perdritype',
      width: 80
    },
    {
      title: '申请人签字',
      dataIndex: 'signUrl',
      width: 100,
      render: text => {
        return text ? <Images width={40} src={text} /> : <img src={signatrueImg} alt="" style={{ width: '60px' }} />
      }
    },
    {
      title: '提交结果',
      dataIndex: 'uploadStatus',
      width: 100,
      render: text => {
        const ITEM = Signuptreview.find(({ value }) => +value === text)
        if (!ITEM) {
          return '-'
        }
        return <span>{ITEM.label}</span>
      }
    },
    {
      title: '受理状态',
      dataIndex: 'acceptStatus',
      width: 100,
      render: text => {
        const ITEM = AcceptStatus.find(({ value }) => +value === text)
        if (!ITEM) {
          return '-'
        }
        return <span>{ITEM.label}</span>
      }
    },
    {
      title: '驾校名称',
      dataIndex: 'schName',
      width: 160
    },
    {
      title: '操作',
      dataIndex: 'mobilePhone',
      width: 80,
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setId(record.id)
                goto.push(`/student/preliminary/checkPreliminaryPage/` + record.id + '/' + record.acceptStatus + '/' + (record.serialNum || '-'))
                dispatch({
                  type: 'preliminary/save',
                  // payload: {}
                  payload: {
                    keepaliveSearchForm: searchPreliminaryForm
                  }
                })
              }}
            >
              查看详情
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
          pagination: getPagation(searchPreliminaryForm)
        }}
        showTitle={false}
        dataSource={preliList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ preliminary, global }) => ({
  preliList: preliminary.preliList,
  searchPreliminaryForm: preliminary.searchPreliminaryForm,
  isCuRoleModalVisible: preliminary.isCuRoleModalVisible,
  bizTypeList: global.bizTypeList,
  perdritypeList: global.perdritypeList,
  signUpReviewResultsList: global.signUpReviewResultsList,
  acceptStatusList: global.acceptStatusList,
  keepaliveSearchForm: preliminary.keepaliveSearchForm,
}))(Preliminary)
