import React, { Fragment, useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import { Button, Form, Input, DatePicker, } from "antd"
import { getPagation } from "@/utils"

const Investigate = ({ dispatch, searchGementForm, investigateList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // dispatch({
    //   type: 'department/save',
    //   payload: {
    //     searchGementForm: {...STATE.searchGementForm}
    //   },
    // })
    getData()
  }, [])

  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "investigate/loadInvestigateList"
    })
    setLoading(false)
  }

  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "investigate/save",
      payload: {
        searchGementForm: {...searchGementForm, pageNum, pageSize }
      }
    })
  }

  // 查询区域
  const renderSearchContent = () => {

  }
  // 审计管理列表
  const renderInvestigate = () => {
    // 查询区域
    const searchFormTop = () => {
      return (
        <SearchForm
          form={form}
          components={[
            {
              key: "roleName",
              component: <Input maxLength={20} placeholder="操作人" key="name" />
            },
            {
              key: "roleName",
              col: 8,
              component: <DatePicker.RangePicker
                allowClear
                placeholder={["操作开始时间", "操作结束时间"]}
              />
            }
          ]}
          actions={
            <>
              <Button
                onClick={() => {
                  dispatch({
                    type: "investigate/save",
                    payload: {
                      isCuRoleModalVisible: true
                    }
                  })
                }}>
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  dispatch({
                    type: "investigate/save",
                    payload: {
                      isCuRoleModalVisible: true
                    }
                  })
                }}>
                生成报表
              </Button>
            </>
          }

          handleSearch={(e) => {
            dispatch({
              type: "investigate/save",
              payload: {
                searchRoleForm: { ...searchGementForm,pageNum: 1, ...e }
              }
            })
          }}
        />
      )
    }
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
      dispatch({
        type: "investigate/save",
        payload: {
          searchGementForm: { ...searchGementForm, pageNum, pageSize }
        }
      })
    }
    const columns = [
      {
        title: "用户名",
        dataIndex: "username",
        width: 80
      }, {
        title: "操作IP",
        width: 100,
        dataIndex: "operationIp"
      }, {
        title: "操作模块",
        dataIndex: "operationModdal",
        width: 80
      }, {
        title: "操作类型",
        dataIndex: "operationType",
        width: 80
      }, {
        title: "操作时间",
        dataIndex: "operationTime",
        width: 150,
        render: (text, record, index) => {
          let num = Math.ceil(Math.random() * 10)
          return `2021-10-${num} 0${num}:5${num}:4${num}`
        }
      },
      {
        title: "是否核心功能",
        dataIndex: "isCore",
        width: 100
      },
      {
        title: "是否非常规业务",
        dataIndex: "isBusiness",
        width: 110
      },
      {
        title: "描述",
        dataIndex: "desc",
        width: 150
      },
      {
        title: "操作结果",
        dataIndex: "operationResult",
        width: 120
      },
      {
        title: "操作",
        width: 80,
        render: (text, record) => {
          return (
            <>
              <Button type='link' onClick={() => {
                dispatch({
                  type: "department/save",
                  payload: {
                    isDepartmentVisible: true
                  }
                })
              }}>检查数据</Button>
            </>
          )
        }
      }
    ]
    const searchForm = {}
    return (
      <Fragment>
        <TableView
          pageProps={{
            getPageList: setPagation,
            pagination: getPagation(searchForm)
          }}
          loading={loading}
          showTitle={false}
          dataSource={investigateList}
          columns={columns}
          search={searchFormTop()}
          rowKey="id"
          hasPagination={false}
        />
      </Fragment>
    )
  }
  return (
    <WhiteCard>
      {renderSearchContent()}
      {renderInvestigate()}
    </WhiteCard>
  )
}
export default connect(({ investigate }) => ({
  investigateList: investigate.investigateList
}))(Investigate)


