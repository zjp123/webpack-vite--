import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import { Button, Form, Select, DatePicker } from "antd"
import { STATE } from "./model"
import { getPagation } from "@/utils"
import { Taskstatus } from "@/utils/constants"
import { getDict } from "@/utils/publicFunc"

const Timingtask = ({ match, dispatch, ScheduledList, searchtimingtaskForm, jobGroupList, jobLogStatusList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [hospitalList, setHospitalList] = useState([])

  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  useEffect(() => {
    getData()
    getDict(dispatch, "jobGroup")
    getDict(dispatch, "jobStatus")
    getDict(dispatch, "jobLogStatus")
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "timingtask/save",
      payload: {
        searchtimingtaskForm: { ...searchtimingtaskForm, pageNum, pageSize }
      }
    })
    getData()
  }
  const handleChiefSearch = async (val) => {
    let reg = /^[\u4e00-\u9fa5]+$/g,
      flag = reg.test(val)
    if (flag) {
      getDict(dispatch, "timedTask", { keyword: val }).then((res => {
        setHospitalList(res)
      }))
    } else {
      setHospitalList([])
    }
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "timingtask/loadScheduledList",
      payload: {
        jobId: match?.params?.jobId
      }
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
            key: "jobName",
            component: (
              <Select
                showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入关键字后选择任务名称"
                onSearch={handleChiefSearch}
                filterOption={handleFilterOption}
              >
                {hospitalList?.map(({ value, label, id }) => {
                  return <Select.Option value={value} key={id}>{label}</Select.Option>
                })}
              </Select>
            )
          },
          {
            key: "jobGroup",
            component: (
              <Select placeholder="请选择" allowClear>
                {jobGroupList.map(({ value, label }) => {
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
            key: "status",
            component: (
              <Select placeholder="请选择" allowClear>
                {jobLogStatusList.map(({ value, label }) => {
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
            key: "createdTime",
            col: 8,
            component: <DatePicker.RangePicker allowClear placeholder={["创建时间", "结束时间"]}/>
          }
        ]}
        actions={
          <Button
            onClick={() => {
              form.resetFields()
              dispatch({
                type: "timingtask/save",
                payload: {
                  searchtimingtaskForm: STATE.searchtimingtaskForm
                }
              })
              getData()

            }}>
            重置
          </Button>
        }
        handleSearch={(e) => {
          dispatch({
            type: "timingtask/save",
            payload: {
              searchtimingtaskForm: { ...searchtimingtaskForm, pageNum: 1, ...e }
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
        return <span>{(searchtimingtaskForm.pageNum - 1) * searchtimingtaskForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "任务名称",
      dataIndex: "jobName",
      width: 100

    }, {
      title: "任务分组",
      width: 100,
      dataIndex: "jobGroup"
    }, {
      title: "调用目标字符串",
      dataIndex: "invokeTarget",
      width: 120
    }, {
      title: "日志信息",
      dataIndex: "jobMessage",
      width: 120
    },
    {
      title: "执行状态",
      dataIndex: "status",
      width: 80,
      render: (text) => {
        const ITEM = Taskstatus.find(({ value }) => +value === text)
        if (!ITEM) {
          return "-"
        }
        return <span style={{ color: ITEM.color }}>{ITEM.label}</span>
      }
    },
    {
      title: "执行时间",
      dataIndex: "createdTime",
      width: 80
    }

  ]
  return (
    <WhiteCard style={{ background: "transparent" }}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchtimingtaskForm)
        }}
        showTitle={false}
        dataSource={ScheduledList}
        columns={columns}
        search={searchForm()}
        rowKey="jobId"
        loading={loading}
      />

    </WhiteCard>
  )
}
export default connect(({ timingtask, global }) => ({
  ScheduledList: timingtask.ScheduledList,
  searchtimingtaskForm: timingtask.searchtimingtaskForm,
  isCuRoleModalVisible: timingtask.isCuRoleModalVisible,
  jobStatusList: global.jobStatusList,
  jobGroupList: global.jobGroupList,
  jobLogStatusList: global.jobLogStatusList
}))(Timingtask)


