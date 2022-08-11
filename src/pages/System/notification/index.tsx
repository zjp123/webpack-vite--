import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import './style.less'
import { TableView, WhiteCard, SearchForm, Images } from '@/components'
import {Button, Form, Input, Space, Select, DatePicker} from 'antd'
import {formatParameters, getPagation} from '@/utils'
import { STATE } from './model'
import { getDict } from '@/utils/publicFunc'
import Modal from './Modal'
import { getDictApi } from '@/api/common'

const Notification = ({ dispatch, noticeList, noticeSearchForm, noticeType, noticeStatus, noticeFrequency, noticeUserLevel, visible }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const showModal = () => {
    dispatch({
      type: 'notification/save',
      payload: {
        visible: true
      }
    })
  }

  const closeModal = () => {
    dispatch({
      type: 'notification/save',
      payload: {
        visible: false
      }
    })
  }

  useEffect(() => {
    getNoticeList()
    getDictType()
    return function cleanup() {
      dispatch({
        type: 'notification/save',
        payload: {
          noticeList: [],
          noticeSearchForm: {
            pageNum: 1,
            pageSize: 10
          }
        }
      })
    }
  }, [])

  const getDictType = () => {
    ;['noticeType', 'noticeStatus', 'noticeFrequency', 'noticeUserLevel', 'notice_content_template'].forEach(item => {
      getDictApi({ type: item }).then(res => {
        dispatch({
          type: 'notification/save',
          payload: {
            [item]: res.data.list
          }
        })
      })
    })
  }

  const getNoticeList = async () => {
    setLoading(true)
    await dispatch({
      type: 'notification/loadNoticeList'
    })
    setLoading(false)
  }

  // 翻页改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'notification/save',
      payload: {
        noticeSearchForm: { ...noticeSearchForm, pageNum, pageSize }
      }
    })
    getNoticeList()
  }

  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'noticeName',
            component: <Input placeholder="请输入通知名称..." />
          },
          {
            key: 'noticeType',
            component: <Select placeholder="请选择通知类型">
              {noticeType?.map(({code, name}) => {
                return (
                  <Select.Option value={code} key={code}>
                    {name}
                  </Select.Option>
                )
              })}
            </Select>
          },
          {
            key: 'noticeStatus',
            component: <Select placeholder="请选择状态">
              {noticeStatus?.map(({code, name}) => {
                return (
                  <Select.Option value={code} key={code}>
                    {name}
                  </Select.Option>
                )
              })}
            </Select>
          },
          {
            key: 'noticeUserLevel',
            component: <Select placeholder="请选择通知用户">
              {noticeUserLevel?.map(({code, name}) => {
                return (
                  <Select.Option value={code} key={code}>
                    {name}
                  </Select.Option>
                )
              })}
            </Select>
          },
          {
            key: 'time',
            component: <DatePicker.RangePicker allowClear placeholder={["开始时间", "结束时间"]}/>
          }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'notification/save',
                  payload: {
                    noticeSearchForm: STATE.noticeSearchForm
                  }
                })
                getNoticeList()
              }}
            >
              重置
            </Button>
            <Button onClick={showModal}>新增</Button>
          </Space>
        }
        handleSearch={e => {
          const data: any = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "time",
                startTime: "beginTime",
                endTime: "endTime"
              }
            ]
          })
          dispatch({
            type: 'notification/save',
            payload: {
              noticeSearchForm: { ...noticeSearchForm, pageNum: 1, ...data }
            }
          })
          getNoticeList()
        }}
      />
    )
  }

  //table表头
  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(noticeSearchForm.pageNum - 1) * noticeSearchForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '通知名称',
      dataIndex: 'noticeName',
      width: 120
    },
    {
      title: '类型',
      dataIndex: 'noticeType',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'noticeStatus',
      width: 120
    },
    {
      title: '弹窗通知频次',
      dataIndex: 'noticeFrequency',
      width: 120
    },
    {
      title: '通知用户',
      dataIndex: 'noticeUserLevel',
      width: 100
    },
    {
      title: '通知内容模板',
      dataIndex: 'noticeContentTemplate',
      width: 100
    },
    {
      title: '上线时间',
      dataIndex: 'onlineTime',
      width: 200
    },
    {
      title: '下线时间',
      dataIndex: 'offlineTime',
      width: 200
    },
    {
      title: '操作',
      width: 160,
      fixed: "right",
      render: (text, record) => {
        const editDisable = record.noticeStatus === '待上线' || record.noticeStatus === '编辑中'
        const revokeDisable = record.noticeStatus === '已上线'
        return (
          <>
            <Button
              type="link"
              disabled={!editDisable}
              onClick={() => {
                dispatch({
                  type: 'notification/save',
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
              disabled={!revokeDisable}
              onClick={() => {
                dispatch({
                  type: 'notification/revokeNotice',
                  payload: {
                    id: record.id
                  }
                })
              }}
            >
              撤销
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard>
      {visible && <Modal closeModal={closeModal}/>}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(noticeSearchForm)
        }}
        showTitle={false}
        dataSource={noticeList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ notification, global }) => ({
  noticeList: notification.noticeList,
  noticeSearchForm: notification.noticeSearchForm,
  noticeType: notification.noticeType,
  noticeStatus: notification.noticeStatus,
  noticeFrequency: notification.noticeFrequency,
  noticeUserLevel: notification.noticeUserLevel,
  visible: notification.visible,
}))(Notification)
