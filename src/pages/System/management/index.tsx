import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import { Button, Form, Input, Modal, DatePicker } from "antd"
import CuRoleModal from "./managementModal"
import { STATE } from "./model"
import { getPagation, goto, formatParameters } from "@/utils"

const Confirm = Modal.confirm
const Management = ({ dispatch, managementlist, searchManagementForm, isCuRoleModalVisible }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setDictId] = useState<any>()

  useEffect(() => {
    getData()
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "management/save",
      payload: {
        searchManagementForm: { ...searchManagementForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取一级列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "management/loadManagementList"
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
            key: "dictName",
            component: <Input maxLength={20} placeholder="请输入字典值名称" key="dictName"/>
          },
          {
            key: "startTime",
            col: 8,
            component: <DatePicker.RangePicker allowClear placeholder={["创建时间", "结束时间"]}/>
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "management/save",
                  payload: {
                    searchManagementForm: STATE.searchManagementForm
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
                setDictId(undefined)
                dispatch({
                  type: "management/save",
                  payload: {
                    isCuRoleModalVisible: true
                  }
                })
              }}
            >
              添加字典值
            </Button>
          </>
        }
        handleSearch={e => {
          let data = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "startTime",
                startTime: "beginTime",
                endTime: "endTime"
              }
            ]
          })
          dispatch({
            type: "management/save",
            payload: {
              searchManagementForm: { ...searchManagementForm, pageNum: 1, ...data, dictName: (e as any).dictName }
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
        return <span>{(searchManagementForm.pageNum - 1) * searchManagementForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "字典名称",
      dataIndex: "dictName",
      width: 90
    },
    {
      title: "字典值",
      width: 90,
      dataIndex: "dictType"
    },
    {
      title: "创建人账号",
      dataIndex: "createdByName",
      width: 100
    },
    {
      title: "创建时间",
      dataIndex: "createdTime",
      width: 120
    },
    {
      title: "备注",
      dataIndex: "remark",
      width: 80
    },
    {
      title: "操作",
      width: 150,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setDictId(parseInt(record?.id))
                dispatch({
                  type: "management/save",
                  payload: {
                    isCuRoleModalVisible: true
                  }
                })
              }}
            >
              修改
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
                      type: "management/deleteFirstLevelDict",
                      payload: {
                        Ids: [record.dictId]
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
                // dictId(text.dictId)
                setDictId(text?.dictId)
                console.log(record)
                dispatch({
                  type: "management/save"
                })
                // goto.push('/system/management/managementpage/' + record.id)
                goto.push(`/system/management/managementpage/${record?.dictType}/${record?.dictName}`)
              }}
            >
              查看详情
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
          pagination: getPagation(searchManagementForm)
        }}
        showTitle={false}
        dataSource={managementlist}
        columns={columns as any}
        search={searchForm()}
        rowKey="dictId"
        loading={loading}
      />
      {isCuRoleModalVisible && <CuRoleModal dictId={id} parentForm={form}/>}
    </WhiteCard>
  )
}
export default connect(({ management }) => ({
  managementlist: management.managementlist,
  searchManagementForm: management.searchManagementForm,
  isCuRoleModalVisible: management.isCuRoleModalVisible
}))(Management)
