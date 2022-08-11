import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import {TableView,SearchForm} from '@/components'
import {Button, Form, DatePicker, Select, Input} from 'antd'
import {getPagation, goto,formatParameters} from '@/utils'
import {getDict} from "@/utils/publicFunc"
import { STATE } from './model'
// TODO: 缺少参数studentId, 步骤条
//电子档案补录
const Recording = ({ dispatch, recordingList, searchRecordingForm, bizTypeList, perdritypeList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getData()
    getDict(dispatch,"bizType")
    getDict(dispatch,"perdritype")
    return () => {
      dispatch({
        type: 'recording/save',
        payload: {
          searchRecordingForm: STATE.searchRecordingForm
        }
      })
    }
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'recording/save',
      payload: {
        searchRecordingForm: { ...searchRecordingForm, pageNum, pageSize },
      },
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'recording/loadRecordingList',
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
            key: 'informationName',
            col: 5,
            component: <Input maxLength={18} placeholder="请输入姓名/身份证号" key="informationName" />
          },
          {
            key: 'schName',
            col: 5,
            component: <Input maxLength={18} placeholder="请输入驾校名称" key="schName" />
          },
          {
            key: 'createdTime',
            col: 8,
            component: <DatePicker.RangePicker allowClear placeholder={['开始时间', '结束时间']} />
          },
          {
            key: 'perdritype',
            col: 6,
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
            col: 5,
            component: (
              <Select placeholder="请选择业务类型" allowClear>
                {bizTypeList.map(({ value, label }) => {
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
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'recording/save',
                  payload: {
                    searchRecordingForm: STATE.searchRecordingForm,
                  },
                })
                getData()
              }}
            >
              重置
            </Button>
        }
        handleSearch={e => {
          console.log(e)
          let data = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: 'createdTime',
                startTime: 'beginTime',
                endTime: 'endTime',
              }
            ]
          })
          dispatch({
            type: 'recording/save',
            payload: {
              searchRecordingForm: { ...searchRecordingForm,pageNum: 1, ...data, informationName: (e as any).informationName }
            }
          })
          getData()
        }}
      />
    )
  }
  const customElement = () => (
      <>
        信息列表:共查询到 <span style={{ color: '#006EFF' }}>{searchRecordingForm.totalRows}</span> 条信息
      </>
  )
  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record,index) => {
        return <span>{(searchRecordingForm.pageNum - 1) * searchRecordingForm.pageSize + index + 1}</span>
      },
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      width: 80,
    },
    {
      title: '身份证明号码',
      dataIndex: 'idCard',
      width: 200,
    },
    // {
    //   title: '档案编号',
    //   width: 130,
    //   dataIndex: 'fileNum',
    // },
    {
      title: '流水号',
      width: 130,
      dataIndex: 'serialNum',
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      width: 90,
    },
    {
      title: '业务状态',
      dataIndex: 'stage',
      width: 80,
    },
    {
      title: '准驾车型',
      dataIndex: 'perdritype',
      width: 90,
    },
    {
      title: '业务开始时间',
      dataIndex: 'businessBeginTime',
      width: 200,
    },

    {
      title: '驾校名称',
      dataIndex: 'schName',
      width: 200,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                goto.push('/electronic/recording/checkInRecordingPage/' + (record.serialNum || ' ') + '/' + record.stageCode+ '/' + record.studentId + '/' + (record.fileNum || ' ') + '/' + (record.personId || ' '))
              }}
            >
              查看详情
            </Button>
          </>
        )
      },
    },
  ]
  return (
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchRecordingForm),
        }}
        showTitle={false}
        dataSource={recordingList}
        columns={columns as any}
        customElement={customElement()}
        search={searchForm()}
        rowKey="id"
        getSelection={getSelection}
        loading={loading}
      />
  )
}
export default connect(({ recording,global }) => ({
  recordingList: recording.recordingList,
  searchRecordingForm: recording.searchRecordingForm,
  isCuInformationModalVisible: recording.isCuInformationModalVisible,
  bizTypeList:global.bizTypeList,
  perdritypeList:global.perdritypeList
}))(Recording)
