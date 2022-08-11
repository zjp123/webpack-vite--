import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, SearchForm } from '@/components'
import { Button, Form, Input, Select } from 'antd'
import { getPagation, goto } from '@/utils'
import WhiteCard from '@/components/WhiteCard'
import { STATE } from './model'
import { ROMM_STATUS } from '@/utils/constants'
import { getDict } from '@/utils/publicFunc'
import { CheckedAllButton, CheckedButton, DownloadButton } from '@/components/BatchDownload'

const ExaminationRoom = ({ dispatch, examinationList, searExaminationRoomForm, courseList, siteStatusList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'examinationRoom/save',
      payload: {
        searExaminationRoomForm: { ...STATE.searExaminationRoomForm }
      }
    })
    getData()
    getDict(dispatch, 'course')
    getDict(dispatch, 'siteStatus')
  }, [])

  useEffect(() => {
    return function cleanup() {
      dispatch({
        type: 'global/resetBatchDownload'
      })
    }
  })

  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: 'examinationRoom/loadExaminationList'
    })
    setLoading(false)
  }
  // 翻页改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'examinationRoom/save',
      payload: {
        searExaminationRoomForm: { ...searExaminationRoomForm, pageNum, pageSize }
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
            key: 'name',
            component: <Input placeholder="请输入考场名称" />
          },
          {
            key: 'course',
            component: (
              <Select placeholder="请选择考试科目" allowClear>
                {courseList.map(({ value, label }) => {
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
            key: 'siteStatus',
            component: (
              <Select placeholder="请选择考场状态" allowClear>
                {siteStatusList.map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
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
                  type: 'examinationRoom/save',
                  payload: {
                    searExaminationRoomForm: STATE.searExaminationRoomForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            {/*<DownloadButton>导出监考记录</DownloadButton>*/}
          </>
        }
        handleSearch={e => {
          dispatch({
            type: 'examinationRoom/save',
            payload: {
              searExaminationRoomForm: { ...searExaminationRoomForm, pageNum: 1, ...e }
            }
          })
          getData()
        }}
      />
    )
  }
  const columns = [
    {
      title: '编号',
      // title: () => <CheckedAllButton list={examinationList} itemName="safetyOfficerId" />,
      dataIndex: 'serialnum',
      width: 80,
      render: (text, record, index) => {
        // return <CheckedButton value={record.id} />
        return <span>{(searExaminationRoomForm.pageNum - 1) * searExaminationRoomForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '考试科目',
      width: 80,
      dataIndex: 'course'
    },
    {
      title: '考场名称',
      dataIndex: 'name',
      width: 120
    },
    {
      title: '考场地址',
      dataIndex: 'contactAddress',
      width: 120
    },
    {
      title: '可考车型',
      dataIndex: 'carTypes',
      width: 240
    },
    {
      title: '考场状态',
      dataIndex: 'siteStatus',
      render: text => {
        const ITEM = ROMM_STATUS.find(({ value }) => value === text)
        if (!ITEM) {
          return '-'
        }
        return <span>{ITEM.label}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'stubDeviceCount',
      fixed: "right",
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              goto.push(`/drivingTest/examinationRoom/examinationPage/${record.id}`)
            }}
          >
            查看详情
          </Button>
        )
      }
    }
  ]
  return (
    <WhiteCard style={{ background: 'transparent' }}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searExaminationRoomForm)
        }}
        showTitle={false}
        dataSource={examinationList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ examinationRoom, global }) => ({
  examinationList: examinationRoom.examinationList,
  searExaminationRoomForm: examinationRoom.searExaminationRoomForm,
  courseList: global.courseList,
  siteStatusList: global.siteStatusList
}))(ExaminationRoom)
