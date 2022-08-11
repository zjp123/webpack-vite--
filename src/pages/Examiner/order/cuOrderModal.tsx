import React, { useState, useEffect, Fragment } from "react"
import { Form, Modal, Button, Empty } from "antd"
import { connect } from "dva"
import { TableView, Images } from "@/components"
import CuEditExaminerModal from "./cuEditExaminerModal"
import replacementPic from "@/components/Replacement"
import { openNotification } from "@/components/OpenNotification"

const Confirm = Modal.confirm

const CuOrderModal = (props) => {
  const { id, dispatch, invList, currentRowData: parentData, examinerList, isShowExaminerModal, isShowAddOrEditExaminerModal, isHasDisable } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("新增")
  // 本场考官列表
  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    dispatch({
      type: "order/loadExaminerList",
      payload: {
        planId: id, status: 0
      }
    })
  }

  // 列
  const columns = [
    {
      title: "考官人脸照片",
      dataIndex: "examinerPhoto",
      width: 145,
      render: (text) => {
        return replacementPic(text, <Images width={120} height={100} src={text} alt="oh!暂无照片!"/>, {})
      }
    },
    {
      title: "考官姓名",
      width: 90,
      dataIndex: "examinerName"
    },
    {
      title: "身份证明号码",
      dataIndex: "examinerIdCard",
      width: 200
    },
    {
      title: "考场身份",
      dataIndex: "examinerDuty",
      width: 90,
      render: (text) => {
        return text === 0 ? "主考官" : "副考官"
      }
    },
    {
      title: "考官代码",
      dataIndex: "examinerCode",
      width: 120
    },
    {
      title: "操作",
      width: 100,
      fixed: "right",
      render: (text) => {
        return (
          <Fragment>
            <Button disabled={isHasDisable} type="link" onClick={() => {
              Confirm({
                title: "删除",
                content: "确认删除?",
                onOk: () => {
                  dispatch({
                    type: "order/deleteExaminer",
                    payload: {
                      ids: [text.id]
                    }
                  }).then((res) => {
                    if (res?.code === 0) {
                      openNotification({ message: "删除考官成功" }, "success", false)
                       // 更新列表
                       dispatch({
                        type: "order/loadOrderList"
                      })
                      getData()
                    }
                  })
                }
              })
            }}>删除</Button>
          </Fragment>
        )
      }
    }
  ]
  const footer = [
    <Button
      style={{ textAlign: "center", display: "block", margin: "0 auto" }} key="confirm" type="primary"
      disabled={examinerList?.length === 2 ||  isHasDisable}
      onClick={() => {
        setTitle("新增")
        dispatch({
          type: "order/save",
          payload: {
            isShowAddOrEditExaminerModal: true
          }
        })
      }}>新增考官</Button>
  ]
  return (
    <Modal
      title={`考官信息`}
      visible={isShowExaminerModal}
      width="60%"
      footer={examinerList?.length === 2 ? null : footer}
      confirmLoading={loading}
      onOk={() => {
        setLoading(false)
        form.validateFields().then(async (res) => {
          setLoading(true)
          try {
            if (id) {
              res.id = id
            }
            setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: "order/save",
          payload: {
            isShowExaminerModal: false,
            isHasDisable: false
          }
        })
      }}
    >
      {examinerList?.length !== 0 ? (<TableView
        showTitle={false}
        dataSource={examinerList}
        columns={columns as any}
        // search={searchForm()}
        rowKey="id"
        loading={loading}
        hasPagination={false}
      />) : (
        <Empty description={
          <span>暂无考官信息,至少添加一名考官</span>
        }></Empty>
      )}
      {isShowAddOrEditExaminerModal &&
      <CuEditExaminerModal
        getExaminerList ={getData} planId={id} title={title} invList={invList} currentRowData={parentData} examinerList={examinerList}/>}
    </Modal>
  )
}

export default connect(({ order }) => ({
  cuOrderModalList: order.cuOrderModalList,
  cuOrderModalForm: order.cuOrderModalForm,
  isShowExaminerModal: order.isShowExaminerModal,
  isShowAddOrEditExaminerModal: order.isShowAddOrEditExaminerModal,
  isHasDisable: order.isHasDisable,
  examinerList: order.examinerList
}))(CuOrderModal)
