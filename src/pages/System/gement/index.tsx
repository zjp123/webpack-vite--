import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import { Button, Form, Input, DatePicker, Tabs, Tag } from "antd"
import { STATE } from "./model"
import { Signuptreviewvt } from "@/utils/constants"
import { getPagation, formatParameters, downloadFile } from "@/utils"
import { getUserInfoApi } from "@/api/common"

const initState = {
  theoperationList: [],
  searchTheoperationForm: {
    pageNum: 1,
    pageSize: 10
  },
  //登录日志
  thelogList: [],
  searchThelogForm: {
    pageNum: 1,
    pageSize: 10
  },
  //请求日志
  requestlogList: [],
  searchRequestlogForm: {
    pageNum: 1,
    pageSize: 10
  },
  //安全日志
  securityList: [],
  searchSecurityForm: {
    pageNum: 1,
    pageSize: 10
  }
}
const { TabPane } = Tabs
const Gement = ({
  dispatch,
  theoperationList,
  requestlogList,
  searchRequestlogForm,
  securityList,
  searchSecurityForm,
  thelogList,
  searchThelogForm,
  searchTheoperationForm
}) => {
  const [form] = Form.useForm()
  const [key, setKey] = useState("Thelog")
  const [admin, setAdmin] = useState<boolean>(false)
  const searchForm = {
    Thelog: searchThelogForm,
    Theoperation: searchTheoperationForm,
    Security: searchSecurityForm
  }
  console.log(key)
  enum Key {
    "Thelog" = "登录日志",
    "Theoperation" = "操作日志",
    "Security" = "安全日志"
  }

  enum Url {
    "Thelog" = "logininfor",
    "Theoperation" = "operlog",
    "Security" = "security"
  }

  useEffect(() => {
    dispatch({
      type: "gement/save",
      payload: initState
    })
    getData()
    //登录日志
    getPageList()
    //请求日志
    getPationset()
    // 安全日志
    getThesecurity()

    // 获取用户信息
    getUserInfoApi({}).then((res) => {
      setAdmin(res?.user?.admin)
    })
  }, [])
  const getList = () => {
    if (key === "Thelog") {
      //登录 userName
      getPageList()
    } else if (key === "Theoperation") {
      //操作 operName
      getData()
    } else if (key === "Security") {
      //安全 userName
      getThesecurity()
    } else {
      //请求
      getPationset()
    }
  }
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "gement/save",
      payload: {
        [`search${key}Form`]: { ...[`search${key}Form`], pageNum, pageSize }
      }
    })
    getList()
  }

  function callback(key) {
    form.resetFields()
    setKey(key)
  }

  // 查询区域
  const searchFormTop = () => {
    let array = [
      {
        key: key === "Theoperation" ? "operName" : "userName",
        component: <Input maxLength={20} placeholder={"操作人账号"} key={key === "Theoperation" ? "operName" : "userName"} />
      },
      {
        key: "operTime",
        col: 8,
        component: <DatePicker.RangePicker allowClear placeholder={["创建时间", "结束时间"]} />
      }
    ]
    if (key === "Requestlog") {
      array.splice(0, 1)
    }
    return (
      <SearchForm
        form={form}
        components={array}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "gement/save",
                  payload: {
                    [`search${key}Form`]: STATE[`search${key}Form`]
                  }
                })
                getList()
              }}
            >
              重置
            </Button>
            {key !== "Requestlog" && (
              <Button
                type="primary"
                onClick={() => {
                  downloadFile(
                    `/monitor/${Url[key]}/export/release`,
                    {
                      // 文件名规则:  姓名-档案名称  例：陈毅-体检证明表
                      filename: `${Key[key]}报表`,
                      extension: "xls"
                    },
                    searchForm[`${key}`]
                  )
                }}
              >
                生成报表
              </Button>
            )}
          </>
        }
        handleSearch={e => {
          let obj = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "operTime",
                startTime: "beginTime",
                endTime: "endTime"
              }
            ]
          })
          if (obj.beginTime) {
            obj.params = {
              beginTime: obj.beginTime,
              endTime: obj.endTime
            }
          }
          delete obj.beginTime
          delete obj.endTime
          dispatch({
            type: "gement/save",
            payload: {
              [`search${key}Form`]: { ...STATE[`search${key}Form`], pageNum: 1, ...obj }
            }
          })
          getList()
        }}
      />
    )
  }

  const tableViewRender = (columns, list, searchForm, notPage = undefined) => {
    return (
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchForm)
        }}
        showTitle={false}
        dataSource={list}
        columns={columns}
        search={searchFormTop()}
        rowKey="infoId"
      // hasPagination={!notPage}
      />
    )
  }

  //获取登录日志列表
  const getPageList = async () => {
    await dispatch({
      type: "gement/loadThelogList"
    })
  }
  //操作日志
  const getData = async () => {
    await dispatch({
      type: "gement/loadTheoperationList"
    })
  }
  //获取安全日志列表
  const getThesecurity = async () => {
    await dispatch({
      type: "gement/loadSecurityList"
    })
  }
  //获取请求日志列表
  const getPationset = async () => {
    await dispatch({
      type: "gement/loadRequestlogList"
    })
  }
  // 操作日志
  const informaTion = [
    {
      title: "序号",
      width: 60,
      dataIndex: "stubDeviceCount",
      render: (text, record, index) => {
        return <span>{(searchTheoperationForm.pageNum - 1) * searchTheoperationForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "账号",
      dataIndex: "operName",
      width: 100
    },
    {
      title: "操作人姓名",
      dataIndex: "oper"
    },
    {
      title: "IP",
      dataIndex: "operIp"
    },
    {
      title: "操作时间",
      dataIndex: "operTime",
      width: 150
    },
    {
      title: "系统模块",
      dataIndex: "title",
      width: 150
    },
    {
      title: "业务类型",
      width: 100,
      dataIndex: "businessType",
      render: text => {
        const ITEM = Signuptreviewvt.find(({ value }) => +value === text)
        if (!ITEM) {
          return "-"
        }
        return <span>{ITEM.label}</span>
      }
    },
    {
      title: "操作状态",
      dataIndex: "status",
      render: text => {
        return text ? "异常" : "正常"
      }
    }
  ]
  // 登录日志
  const fileList = [
    {
      title: "序号",
      width: 60,
      dataIndex: "name",
      render: (text, record, index) => {
        return <span>{(searchThelogForm.pageNum - 1) * searchThelogForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "登录账号",
      width: 80,
      dataIndex: "userName"
    },
    {
      title: "来源（IP）",
      width: 120,
      dataIndex: "ipaddr"
    },
    {
      title: "登录状态",
      width: 80,
      dataIndex: "status",
      render: (text) => text === 0 ? "成功" : "退出"
    },
    {
      title: "备注信息",
      width: 80,
      dataIndex: "msg"
    },
    {
      title: "登录时间",
      dataIndex: "loginTime",
      width: 150
    },
    {
      title: "退出登录时间",
      dataIndex: "logoutTime",
      width: 150
    },
    {
      title: "操作系统",
      dataIndex: "os"
    }
  ]
  // 请求日志
  const owe = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchRequestlogForm.pageNum - 1) * searchRequestlogForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "请求时间",
      dataIndex: "createdTime",
      width: 150
    },
    {
      title: "请求路径",
      dataIndex: "type"
    },
    {
      title: "请求方法",
      dataIndex: "error"
    },
    {
      title: "请求方法标识",
      dataIndex: "clientKey"
    },
    {
      title: "是否成功",
      dataIndex: "code"
    }
  ]
  //安全日志
  const appoiNtmentlog = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchSecurityForm.pageNum - 1) * searchSecurityForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "用户名",
      dataIndex: "userName",
      width: 80
    },
    {
      title: "操作IP",
      dataIndex: "ipaddr",
      width: 100
    },
    {
      title: "操作模块",
      width: 100,
      dataIndex: "title"
    },
    {
      title: "业务类型",
      dataIndex: "type",
      width: 80,
      render: text => {
        const ITEM = Signuptreviewvt.find(({ value }) => +value === text)
        if (!ITEM) {
          return ""
        }
        return <span>{ITEM.label}</span>
      }
    },
    {
      title: "操作时间",
      width: 150,
      dataIndex: "logTime"
    },
    {
      title: "描述",
      width: 150,
      dataIndex: "msg"
    },
    {
      title: "操作结果",
      dataIndex: "clientKey",
      render: () => {
        return <Tag color={"#87d068"}>成功</Tag>
      }
    }
  ]
  return (
    <WhiteCard>
      <div style={{ marginLeft: "27px" }}>
        <Tabs defaultActiveKey="Thelog" onChange={callback} type="card">
          <TabPane tab="登录日志" key="Thelog">
            {tableViewRender(fileList, thelogList, searchThelogForm)}
          </TabPane>
          <TabPane tab="操作日志" key="Theoperation">
            {tableViewRender(informaTion, theoperationList, searchTheoperationForm)}
          </TabPane>
          <TabPane tab="安全日志" key="Security">
            {tableViewRender(appoiNtmentlog, securityList, searchSecurityForm)}
          </TabPane>
          {admin && <TabPane tab="请求日志" key="Requestlog">
            {tableViewRender(owe, requestlogList, searchRequestlogForm)}
          </TabPane>}
        </Tabs>
      </div>
    </WhiteCard>
  )
}
export default connect(({ gement }) => ({
  gementlist: gement.gementlist,
  theoperationList: gement.theoperationList,
  searchGementForm: gement.searchGementForm,
  searchTheoperationForm: gement.searchTheoperationForm,
  thelogList: gement.thelogList,
  requestlogList: gement.requestlogList,
  securityList: gement.securityList,
  searchSecurityForm: gement.searchSecurityForm,
  searchThelogForm: gement.searchThelogForm,
  searchRequestlogForm: gement.searchRequestlogForm,
  isCuRoleModalVisible: gement.isCuRoleModalVisible
}))(Gement)
