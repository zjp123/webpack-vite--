import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, SearchForm, Images } from '@/components'
import { getPagation, goto } from '@/utils'
import WhiteCard from '@/components/WhiteCard'
import { Button, Form, Input } from 'antd'
import { AMEDICAL } from '@/utils/constants'
import { STATE } from './model'
import replacementPic from '@/components/Replacement'
import './index.less'
import bejtu from '@/assets/img/bejtu.png'

const ExaminerInformation = ({ dispatch, examinerInformList, searchExaminerInformationForm }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'examinerInformation/save',
      payload: {
        searchExaminerInformationForm: { ...STATE.searchExaminerInformationForm }
      }
    })
    getData()
  }, [])

  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: 'examinerInformation/loadExaminerInformationList'
    })
    setLoading(false)
  }

  // 翻页改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'examinerInformation/save',
      payload: {
        searchExaminerInformationForm: { ...searchExaminerInformationForm, pageNum, pageSize }
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
            component: <Input maxLength={20} placeholder="请输入考官姓名" />
          },
          {
            key: 'tel',
            component: <Input maxLength={20} placeholder="请输入联系方式" />
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'examinerInformation/save',
                  payload: {
                    searchExaminerInformationForm: STATE.searchExaminerInformationForm
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
            type: 'examinerInformation/save',
            payload: {
              searchExaminerInformationForm: { ...searchExaminerInformationForm, pageNum: 1, ...e, name: (e as any).name, tel: (e as any).tel }
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
      dataIndex: 'serialnum',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchExaminerInformationForm.pageNum - 1) * searchExaminerInformationForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '个人照片',
      width: 80,
      dataIndex: 'photo',
      render: (text: any) => {
        return text ? (
          replacementPic(text, <Images width={30} height={40} src={text} />, {})
        ) : (
          <img src={bejtu} style={{ marginRight: 0, width: '30px', height: `40px` }} alt="" />
        )
      }
    },
    {
      title: '姓名',
      width: 90,
      dataIndex: 'name'
    },
    {
      title: '性别',
      dataIndex: 'age',
      width: 60
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
      width: 100
    },
    {
      title: '发证日期',
      width: 150,
      dataIndex: 'issueDate'
    },
    {
      title: '考试证有效期止',
      width: 150,
      dataIndex: 'certificateValidityPeriodEnd'
    },
    {
      title: '考试证状态',
      dataIndex: 'status',
      width: 100,
      render: text => {
        const ITEM = AMEDICAL.find(({ value }) => value === text)
        if (!ITEM) {
          return '合格'
        }
        return <span>{ITEM.used_label}</span>
      }
    },
    {
      title: '所属支队',
      dataIndex: 'belongsDetachment',
      width: 100
    },
    {
      title: '操作',
      width: 80,
      fixed: "right",
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              goto.push('/drivingTest/examinerInformation/examinerDetail/' + record.id)
            }}
          >
            查看详情
          </Button>
        )
      }
    }
  ]
  return (
    <WhiteCard>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchExaminerInformationForm)
        }}
        showTitle={false}
        dataSource={examinerInformList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ examinerInformation }) => ({
  examinerModalVisible: examinerInformation.examinerModalVisible,
  examinerInformList: examinerInformation.examinerInformList,
  searchExaminerInformationForm: examinerInformation.searchExaminerInformationForm
}))(ExaminerInformation)
