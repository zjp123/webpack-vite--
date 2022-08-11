import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, SearchForm } from "@/components"
import { getPagation } from "@/utils"
import WhiteCard from "@/components/WhiteCard"
import { Button, Form, Input, Modal, Select } from "antd"
import { STATE } from "./model"
import "./index.less"
import CheckInterfacePage from "./checkInterfacePage"
import CuInterfaceMoal from "@/pages/System/interface/cuInterfaceList"
import axios from "axios"

const Confirm = Modal.confirm
const { Option } = Select
const Interface = ({ dispatch, interfaceList, searchInterfaceForm, isInterfaceVisible, isInterfacePageVisible }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  useEffect(() => {
    getData()
    // request.get("/api/leaderCockpit")
    axios.get("/api/leaderCockpit").then((res) => {
    })
  }, [])

  // 翻页改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "interfaceManagement/save",
      payload: {
        searchInterfaceForm: {...searchInterfaceForm, pageNum, pageSize }
      }
    })
    getData()
  }
  // 获取列表数据
  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: "interfaceManagement/loadInterfaceFormList"
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
            key: "name",
            component: <Input maxLength={20} placeholder="请输入接口名称"/>
          },
          {
            key: "authIp",
            component: <Input maxLength={20} placeholder="请输入准入IP地址"/>
          },
          {
            key: "status",
            component: (
              <Select placeholder="请选择接口状态">
                <Option value={0}>正常</Option>
                <Option value={1}>禁用</Option>
                <Option value={2}>删除</Option>
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
                  type: "interfaceManagement/save",
                  payload: {
                    searchInterfaceForm: STATE.searchInterfaceForm
                  }
                })
                getData()
              }}>
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setId(0)
                dispatch({
                  type: "interfaceManagement/save",
                  payload: {
                    isInterfaceVisible: true
                  }
                })
              }}
            >
              新增接口
            </Button>
          </>
        }
        handleSearch={(e) => {
          console.log(e)
          dispatch({
            type: "interfaceManagement/save",
            payload: {
              searchInterfaceForm: { ...searchInterfaceForm, pageNum: 1, ...e }
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
      dataIndex: "serialnum",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchInterfaceForm.pageNum - 1) * searchInterfaceForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "接口名称",
      width: 120,
      dataIndex: "name"
    }, {
      title: "接口类型",
      width: 120,
      dataIndex: "type"
    },
    {
      title: "准入IP",
      dataIndex: "authIp",
      width: 140
    }, {
      title: "端口号",
      dataIndex: "serviceIp",
      width: 160
    },
    {
      title: "业务服务接口类别",
      width: 180,
      dataIndex: "serviceSystemType"
    },
    {
      title: "服务机构名称",
      width: 190,
      dataIndex: "serviceOfficeName"
    },
    {
      title: "服务用户名称",
      dataIndex: "serviceUserName",
      width: 120
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180
    },
    {
      title: "接口状态",
      dataIndex: "createTime",
      width: 80,
      render: (text, { status }) => {
        return <div
          style={{
            backgroundColor: status === 0 ? "#35B83F" : status === 1 ? "#FF4949" : "#6B798E",
            borderRadius: "10px",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {status === 0 ? "正常" : status === 1 ? "禁用" : "删除"}
        </div>
      }
    },
    {
      title: "操作",
      width: 200,
      dataIndex: "idcardNum",
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setId(record.id)
                dispatch({
                  type: "interfaceManagement/save",
                  payload: {
                    isInterfaceVisible: true
                  }
                })
              }}
            >
              修改
            </Button>
            <span className="tiny-delimiter">|</span>
            {
              record.status !== 2 && (
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      Confirm({
                        title: "删除",
                        content: "确认要删除接口信息吗?",
                        centered: true,
                        onOk: () => {
                          dispatch({
                            type: "interfaceManagement/deleteInterface",
                            payload: {
                              ids: [record.id]
                            }
                          })
                        }
                      })
                    }}
                  >
                    删除
                  </Button>
                  <span className="tiny-delimiter">|</span>
                </>
              )
            }
            <Button
              type="link"
              onClick={() => {
                setId(record.id)
                dispatch({
                  type: "interfaceManagement/save",
                  payload: {
                    isInterfacePageVisible: true
                  }
                })
              }}
            >
              详情
            </Button>
          </>
        )
      }
    }
  ]
  return (
    <WhiteCard>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchInterfaceForm)
        }}
        showTitle={false}
        dataSource={interfaceList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
      {isInterfacePageVisible && <CheckInterfacePage id={id}/>}
      {isInterfaceVisible && <CuInterfaceMoal id={id} parentForm={form}/>}
    </WhiteCard>
  )
}
export default connect(({ interfaceManagement }) => ({
  interfaceList: interfaceManagement.interfaceList,
  searchInterfaceForm: interfaceManagement.searchInterfaceForm,
  isInterfaceVisible: interfaceManagement.isInterfaceVisible,
  isInterfacePageVisible: interfaceManagement.isInterfacePageVisible,
  statusShow: interfaceManagement.statusShow
}))(Interface)


