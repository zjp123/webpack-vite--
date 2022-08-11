import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import { Button, Form, Modal, Select } from "antd"
import CuRoleModal from "./timingtaskModal"
import { tedmmediately, taskstaus } from "@/api/system"
import { getPagation, goto } from "@/utils"
import { getDict } from "@/utils/publicFunc"
import { STATE } from "./model"

const Confirm = Modal.confirm
const Timingtask = ({ dispatch, timingtaskList, searchtimingtaskForm, isCuRoleModalVisible, jobGroupList, jobStatusList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, jobId] = useState<any>()
  const [hospitalList, setHospitalList] = useState([])
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  useEffect(() => {
    dispatch({
      type: "timingtask/save",
      payload: {
        searchtimingtaskForm: { ...STATE.searchtimingtaskForm }
      }
    })
    getData()
    getDict(dispatch, "jobGroup")
    getDict(dispatch, "jobStatus")
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
      type: "timingtask/loadtimingtaskList"
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
              <Select placeholder="请选择任务分组" allowClear>
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
              <Select placeholder="请选择任务状态" allowClear>
                {jobStatusList.map(({ value, label }) => {
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
                  type: "timingtask/save",
                  payload: {
                    searchtimingtaskForm: STATE.searchtimingtaskForm
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
                jobId(null)
                dispatch({
                  type: "timingtask/save",
                  payload: {
                    isCuRoleModalVisible: true
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
            type: "timingtask/save",
            payload: {
              searchtimingtaskForm: { ...searchtimingtaskForm, pageNum: 1, ...e, jobName: (e as any)?.jobName?.label }
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
    },
    {
      title: "任务分组",
      width: 100,
      dataIndex: "jobGroupName"
    },
    {
      title: "调用目标字符串",
      dataIndex: "invokeTarget",
      width: 120
    },
    {
      title: "执行表达式",
      dataIndex: "cronExpression",
      width: 120
    },
    {
      title: "创建时间",
      dataIndex: "createdTime",
      width: 80
    },
    {
      title: "任务状态",
      dataIndex: "status",
      width: 80,
      render: (text) => {
        const ITEM = jobStatusList.find(({ value }) => +value === text)
        if (!ITEM) {
          return "-"
        }
        return <span style={{ color: ITEM.color }}>{ITEM.label}</span>
      }
    },
    {
      title: "操作",
      width: 220,
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                taskstaus({
                  jobId: record?.jobId,
                  status: record?.status === 0 ? 1 : 0
                }).then(res => {
                  if (res?.code === 0) {
                    getData()
                  }
                })
              }}
            >
              {record?.status === 0 ? "暂停" : "恢复"}
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                tedmmediately({
                  jobId: record?.jobId,
                  jobGroup: record?.jobGroup
                }).then(res => {
                })
              }}
            >
              立即执行
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                jobId(record.jobId)
                dispatch({
                  type: "timingtask/save",
                  payload: {
                    isCuRoleModalVisible: true
                  }
                })
              }}
            >
              编辑
            </Button>

            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                Confirm({
                  title: "删除",
                  content: "确认删除?",
                  centered: true,
                  onOk: () => {
                    dispatch({
                      type: "timingtask/deleteTolep",
                      payload: {
                        jobId: record.jobId
                      }
                    })
                  }
                })
              }}
            >
              删除
            </Button>

            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: "thedoctor/save",
                  payload: {
                    isCuRoleModalVisible: true
                  }
                })
                goto.push("/system/timingtask/timingtaskPage/" + record.jobId)
              }}
            >
              日志
            </Button>
          </>
        )
      }
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
        dataSource={timingtaskList}
        columns={columns}
        search={searchForm()}
        rowKey="jobId"
        loading={loading}
      />
      {isCuRoleModalVisible && <CuRoleModal jobGroupList={jobGroupList} jobId={id} parentForm={form}/>}
    </WhiteCard>
  )
}
export default connect(({ timingtask, global }) => ({
  timingtaskList: timingtask.timingtaskList,
  searchtimingtaskForm: timingtask.searchtimingtaskForm,
  isCuRoleModalVisible: timingtask.isCuRoleModalVisible,
  jobStatusList: global.jobStatusList,
  jobGroupList: global.jobGroupList
}))(Timingtask)
