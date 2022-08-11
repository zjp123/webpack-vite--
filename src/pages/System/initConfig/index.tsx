import React, {useCallback, useEffect, useRef, useState} from 'react'
import {connect} from 'dva';
import {TableView, WhiteCard, SearchForm, Images} from "@/components"
import {Button, Form, Input, Modal, Space, Select, Progress} from "antd"
import {getPagation} from "@/utils"
import {STATE} from "./model";
import {getDict} from "@/utils/publicFunc"
import CuInitModal from "./cuInitModal";

const Confirm = Modal.confirm;
const InitConfig = ({
                      dispatch,
                      isCuInitModalVisible,
                      initConfigList,
                      initConfigSearchForm,
                      isHasRunningJob,
                      runningJob
                    }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const intervalId = useRef(null)

  const loadInitInfo = async () => {
    const res = await dispatch({
      type: "initConfig/loadInitInfo"
    })
    console.log("loadInitInfo", res)
    if (res) {
      // 有正在执行的任务
      // 进度100% 停止调用
      if (Number(res.jobCount) >= Number(res.targetCount)) {
        console.log("停止调用",
          Number(res.jobCount),
          Number(res.targetCount),
          Number(res.jobCount) >= Number(res.targetCount)
        )
        dispatch({
          type: "initConfig/save",
          payload: {
            isHasRunningJob: false,
          }
        })
      } else {
        // 如果之前是停止调用的状态 开启调用
        if (!isHasRunningJob) {
          console.log("开始调用")
          dispatch({
            type: "initConfig/save",
            payload: {
              isHasRunningJob: true
            }
          })
        }
      }
    } else {
      // 没有正在执行的任务
      return false
    }
  }

  const getChangePercent = (record) => {
    console.log("getChangePercent", runningJob)
    if (!!runningJob && record.id === runningJob.id) {
      return (runningJob.jobCount / runningJob.targetCount) * 100
    } else {
      if (record.targetCount === "0") {
        return 0
      } else {
        return (record.jobCount / record.targetCount) * 100
      }
    }
  }

  useEffect(() => {
    console.log("isHasRunningJob", isHasRunningJob)
    if (isHasRunningJob && !intervalId.current) {
      intervalId.current = setInterval(() => {
        loadInitInfo()
      }, 2000)
    } else {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
  }, [isHasRunningJob])

  useEffect(() => {
    getInitConfigList()
    getDict(dispatch, "exs", {})
    loadInitInfo()
    return function cleanup() {
      dispatch({
        type: "initConfig/save",
        payload: {
          initConfigList: [],
          initConfigSearchForm: {
            pageNum: 1,
            pageSize: 10,
          },
          isHasRunningJob: false,
          runningJob:null,
        }
      })
    }
  }, [])

  const getInitConfigList = async () => {
    setLoading(true)
    await dispatch({
      type: 'initConfig/loadInitConfigList'
    })
    setLoading(false)
  }

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "initConfig/save",
      payload: {
        searchUserForm: {...initConfigSearchForm, pageNum, pageSize}
      }
    })
    getInitConfigList()
  }

  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: "name",
            component: <Input maxLength={20} placeholder="请输入初始化任务" key="name"/>
          }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "initConfig/save",
                  payload: {
                    initConfigSearchForm: STATE.initConfigSearchForm
                  }
                })
                getInitConfigList()
              }}
            >重置</Button>
          </Space>
        }
        handleSearch={(e) => {
          const data: any = {
            ...e,
            examSiteId: e["examSiteId"] && e["examSiteId"].value
          }
          dispatch({
            type: "initConfig/save",
            payload: {
              initConfigSearchForm: {...initConfigSearchForm, pageNum: 1, ...data}
            }
          })
          getInitConfigList()
        }}
      >
      </SearchForm>
    )
  }

  //table表头
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(initConfigSearchForm.pageNum - 1) * initConfigSearchForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "初始化任务",
      dataIndex: "name",
      width: 100
    },
    {
      title: "自检状态",
      dataIndex: "selfTestStatus",
      width: 100,
      render: text => text
    },
    {
      title: "初始化进度",
      width: 200,
      render: (text, record) => {
        return <Progress
          percent={getChangePercent(record)}
          size="small"/>
      }
    },
    {
      title: "初始化状态",
      dataIndex: "jobStatus",
      width: 100
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      width: 120
    },
    {
      title: "操作人",
      dataIndex: "operId",
      width: 80
    },
    {
      title: "备注",
      dataIndex: "remark",
      width: 100,
      render: text => text
    },
    {
      title: "操作",
      width: 260,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button type='link' onClick={() => {
              dispatch({
                type: "initConfig/save",
                payload: {
                  id: record.id,
                  isCuInitModalVisible: true
                }
              })
            }}>
              编辑
            </Button>
            <Button type='link'
                    onClick={() => {
                      Confirm({
                        title: "执行任务",
                        content: <>确认执行任务？</>,
                        centered: true,
                        onOk: async () => {
                          await dispatch({
                            type: 'initConfig/startJob',
                            payload: {
                              id: record.id,
                            }
                          })
                        }
                      })
                    }}
            >
              执行
            </Button>
            <Button type='link'
                    onClick={async () => {
                      Confirm({
                        title: "停止",
                        content: <>确认停止？</>,
                        centered: true,
                        onOk: async () => {
                          await dispatch({
                            type: 'initConfig/stopJob',
                            payload: {
                              id: record.id,
                            }
                          })
                        }
                      })
                    }}
            >
              停止
            </Button>
            <Button type='link'
                    onClick={async () => {
                      Confirm({
                        title: "清库",
                        content: <>确认清库？</>,
                        centered: true,
                        onOk: async () => {
                          await dispatch({
                            type: 'initConfig/cleanTable',
                            payload: {
                              id: record.id,
                            }
                          })
                          getInitConfigList()
                        }
                      })
                    }}
            >
              清库
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard>
      {isCuInitModalVisible && <CuInitModal/>}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(initConfigSearchForm)
        }}
        showTitle={false}
        dataSource={initConfigList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({initConfig, global}) => ({
  initConfigList: initConfig.initConfigList,
  isCuInitModalVisible: initConfig.isCuInitModalVisible,
  initConfigSearchForm: initConfig.initConfigSearchForm,
  isHasRunningJob: initConfig.isHasRunningJob,
  runningJob: initConfig.runningJob,
}))(InitConfig)


