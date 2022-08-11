import React, { Fragment, useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import {Button, DatePicker, Form, Input, Select} from "antd"
import {formatParameters, getPagation, goto} from "@/utils"
import { STATE } from "./model"
import { getDict } from "@/utils/publicFunc"

const Schedule = ({ dispatch, match, scheduleList, searchScheduleForm, examSessionList, exsList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getData()
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "schedule/save",
      payload: {
        searchScheduleForm: { ...searchScheduleForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    const date = match?.params?.id
    await dispatch({
      type: "schedule/loadScheduleList",
      payload: {
        examEnd: date,
        examStart: date
      }
    })
    setLoading(false)
    getDict(dispatch, "examSession", {})
    getDict(dispatch, "exs", {})
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", { keyword: val })
  }
  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={
          [
            {
              key: "examSiteName",
              component: <Select
                showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="考场名称"
                onSearch={handleSearchExam} filterOption={handleFilterOption}
              >
                {exsList?.map(({ value, label }) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
                }
              </Select>
            },
            {
              key: "invigilate",
              component: <Input maxLength={20} placeholder="请输入" key="invigilate"/>
            },
          ]
        }
        actions={
          <Fragment>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "schedule/save",
                  payload: {
                    searchScheduleForm: STATE.searchScheduleForm
                  }
                })
                getData()
              }}>
              重置
            </Button>
          </Fragment>
        }
        handleSearch={(e) => {
          let data = {
            ...e,
            examSiteName: ''
          }
          data.examSiteName = e["examSiteName"]?.value
          dispatch({
            type: "schedule/save",
            payload: {
              searchScheduleForm: { ...searchScheduleForm, pageNum: 1, ...data }
            }
          })
          getData()
        }}
      />
    )
  }
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchScheduleForm.pageNum - 1) * searchScheduleForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 80
    },
    {
      title: "身份证明号码",
      dataIndex: "idCardNo",
      width: 200
    },
    {
      title: "考试科目",
      width: 100,
      dataIndex: "examSubject"
    },
    {
      title: "预约日期",
      dataIndex: "appointmentDate",
      width: 160
    },
    {
      title: "考试日期",
      dataIndex: "appointmentExamDate",
      width: 160
    },
    {
      title: "考试车型",
      dataIndex: "examModel",
      width: 80
    },
    {
      title: "考场名称",
      dataIndex: "examSite",
      width: 150
    },
    {
      title: "考试场次",
      dataIndex: "examSession",
      width: 80,
      // render: (text) => examSessionList?.find((item) => item?.value == text)?.label
    },
    {
      title: "详情",
      width: 100,
      fixed: "right",
      render: (text, record) => {
        return <Button type='link' onClick={() => {
          goto.push(`/examiner/schedule/checkSchedule/checkDetail/${text.id}`)
        }}>查看详情</Button>
      }
    }
  ]
  return (
    <WhiteCard style={{ background: "transparent" }}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchScheduleForm)
        }}
        showTitle={false}
        dataSource={scheduleList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ schedule, global }) => ({
  scheduleList: schedule.scheduleList,
  searchScheduleForm: schedule.searchScheduleForm,
  examSessionList: global.examSessionList,
  exsList: global.exsList
}))(Schedule)


