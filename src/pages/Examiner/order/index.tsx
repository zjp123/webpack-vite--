import React, {Fragment, useEffect, useState} from "react"
import {connect} from "dva"
import {Button, DatePicker, Form, message, Modal, Select,} from "antd"
import {TableView, WhiteCard, ImportFile, SearchForm} from "@/components"
import CuOrderModal from "./cuOrderModal"
import CuAddArrangementModal from "./cuAddArrangementModal"
import {getPagation, formatParameters, goto} from "@/utils"
import IconRight from "@/assets/img/icon_right.png"
import IconFail from "@/assets/img/icon_fail.png"
import {STATE} from "./model"
import {getDict} from "@/utils/publicFunc"
import { COLORFUL_EXAMINATION_STATUS_ARR } from "@/utils/constants"

//考官日程安排
const Confirm = Modal.confirm

const Order = (props) => {
  const {dispatch, orderList, exsList, examSessionList, invList, isShowAddModal, searchOrderForm, isShowExaminerModal, fileDomainUrl} = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0) // 编辑的时候, 当前这条记录 id
  let [currentRowData, setCurrentRowData] = useState({})
  const [queryParams, setQueryParams] = useState({})// 编辑入参
  const [importedResult, setImportedResult] = useState({isShowImportedModal: false, isFailShowImportedModal: false}) // 导入成功失败的modal
  const [isHasDisable, setIsHasDisable] = useState(false) // 是否有禁用的考官
  // 当前要开启考试的记录 id examId
  const [startId, setStartId] = useState()

  useEffect(() => {
    getData()
    getDicts()
    dispatch({
      type: "global/getFileDomain"
    })
  }, [])
  // 改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "order/save",
      payload: {
        searchOrderForm: {...searchOrderForm, pageNum, pageSize}
      }
    })
    getData()
  }

  const getDicts = () => {
    getDict(dispatch, "examSession", {})
    getDict(dispatch, "exs", {})
    getDict(dispatch, "inv", {})
  }
  //获取考官排期列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "order/loadOrderList"
    })
    setLoading(false)
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", {keyword: val})
  }

  // 获取导入之后的结果
  const getImportedResult = (result) => {
    if (result.code == 0) {
      setImportedResult({...importedResult, isShowImportedModal: true, ...result})
    } else {
      setImportedResult({...importedResult, isFailShowImportedModal: true, ...result})
    }
  }

  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: "examSiteId",
            component:
              <Select
                showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请选择考场名称"
                onSearch={handleSearchExam} filterOption={handleFilterOption}
              >
                {exsList?.map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
                }
              </Select>
          },
          {
            key: "startTime",
            col: 8,
            component: <DatePicker.RangePicker
              allowClear placeholder={["考试开始时间", "考试结束时间"]}
            />
          },
          {
            key: "examSession",
            component: <Select placeholder="请选择场次" allowClear>
              {
                examSessionList?.map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
              }
            </Select>
          }
        ]}
        actions={
          <Fragment>
            <Button onClick={() => {
              form.resetFields()
              dispatch({
                type: "order/save",
                payload: {
                  searchOrderForm: STATE.searchOrderForm
                }
              })
              getData()
            }}>
              重置
            </Button>
            <Button
              type='primary'
              onClick={() => {
                setId(undefined)
                dispatch({
                  type: "order/save",
                  payload: {
                    isShowAddModal: true
                  }
                })
              }}
            >
              新增
            </Button>
            <ImportFile api="/exam/plan/import" text="导入考官排班"
                        typeFile="xls" getImportedResult={getImportedResult}
                        refreshData={getData}
                        btnColorType="primary"
            />
          </Fragment>
        }
        handleSearch={(e) => {
          console.log("form表单值-->>", e)
          let data = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "startTime",
                startTime: "examDateStart",
                endTime: "examDateEnd"
              }
            ]
          })
          data.examSiteId = e["examSiteId"]?.value
          dispatch({
            type: "order/save",
            payload: {
              searchOrderForm: {
                ...searchOrderForm,
                pageNum: 1,
                ...data
              }
            }
          })
          getData()
        }
        }
      />
    )
  }

  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchOrderForm.pageNum - 1) * searchOrderForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "考试状态",
      render: (record) => {
        const item = COLORFUL_EXAMINATION_STATUS_ARR.find((item) => item.examStatus === record?.examStatus)
        return <span style={{color:item?.color}}>{item?.label}</span>
      }
    },
    {
      title: "考场名称",
      dataIndex: "examSiteName"
    },
    {
      title: "考试日期",
      dataIndex: "examDate",
    },
    {
      title: "考试科目",
      dataIndex: "examSuject",
    },
    {
      title: "考试车型",
      dataIndex: "examType",
    },
    {
      title: "考试场次",
      dataIndex: "examSession",
      // render: (text) => examSessionList?.find((item) => item.value === text)?.label
    },
    {
      title: "考场代码",
      dataIndex: "examSerialNum",
    },
    {
      title: "考官",
      dataIndex: "examPlanExaminer",
      render: (text) => {
        return text === "0" ? <span style={{color: "red"}}>暂无考官</span> : <span>正常</span>
      }
    },
    {
      title: "操作",
      width: 210,
      fixed: "right",
      render: (text, record) => {
        const item = COLORFUL_EXAMINATION_STATUS_ARR.find((item) => item.examStatus === record?.examStatus)
        const isDisabled = item.label === "待考" ? false : true
        return (
          <Fragment>
            <Button
              type="link"
              disabled={!(record?.examStatus == 0)}
              onClick={() => {
                  goto.push('/examiner/order/manage/' + text?.id)
              }}>开启考试</Button>
            <span className='tiny-delimiter'>|</span>
            <Button
              type="link"
              disabled={!(record?.examStatus == 1)}
              onClick={() => {
                Confirm({
                  title: "关闭考试!",
                  content: "是否确认关闭当前记录考试?",
                  okText: "确认",
                  cancelText: "取消",
                  onOk: () => {
                    dispatch({
                      type: "manage/startOrCloseExamination",
                      payload: {
                        id: text?.id,
                        examStatus: 0  // 开启或关闭考试, 1 用来开启,  0 用来结束
                      }
                    }).then((res) => {
                      message.success(res?.msg)
                      getData()
                    })
                  }
                })

              }}>结束考试</Button>
            <span className='tiny-delimiter'>|</span>
            <Button disabled={isDisabled} type="link" onClick={() => {
              Confirm({
                title: "删除",
                content: "确认删除这条数据吗?",
                onOk: () => {
                  dispatch({
                    type: "order/deleteOrder",
                    payload: {
                      ids: [text.id]
                    }
                  })
                }
              })
            }}>删除</Button>
            <span className='tiny-delimiter'>|</span>
            <Button disabled={isDisabled} type="link" onClick={async () => {
              setId(text.id)
              setQueryParams(text)
              dispatch({
                type: "order/save",
                payload: {
                  isShowAddModal: true
                }
              })
            }}>编辑</Button>
            <span className='tiny-delimiter'>|</span>
            <Button type="link" onClick={() => {
              setId(text.id)
              setCurrentRowData(text)
              dispatch({
                type: "order/save",
                payload: {
                  isShowExaminerModal: true,
                  isShowAddOrEditExaminerModal: false,
                  isHasDisable: isDisabled
                }
              })
            }}>本场考官</Button>
          </Fragment>
        )
      }
    }
  ]

  const handleImportedOk = () => {
    setTimeout(() => {
      setImportedResult({isShowImportedModal: false, isFailShowImportedModal: false})
    }, 2000)
  }
  const handleImportedCancel = () => {
    setImportedResult({isShowImportedModal: false, isFailShowImportedModal: false})
  }

  // 导入成功或者失败 modal
  const renderImportedModal = () => {
    return (
      <Fragment>
        <style>
          {
            `
            .imported_modal .ant-modal-footer {
                    color:#404040;
                    text-align: center
                    }
         `
          }
        </style>
        <Modal
          className="imported_modal"
          style={{textAlign: "center"}}
          visible={importedResult.isShowImportedModal}
          title=""
          onOk={handleImportedOk}
          onCancel={handleImportedCancel}
          footer={[
            <Button
              type="primary"
              style={{width: "140px"}}
              onClick={handleImportedCancel}
            >
              确定
            </Button>
          ]}
        >
          <img src={IconRight}/>
          <h3>已成功上传 {importedResult?.["data"]?.length} 条数据</h3>
        </Modal>
        <Modal
          className="imported_modal"
          style={{textAlign: "center"}}
          visible={importedResult.isFailShowImportedModal}
          title=""
          onOk={handleImportedOk}
          onCancel={handleImportedCancel}
          footer={[
            <Button
              type="primary"
              style={{width: "140px"}}
              onClick={handleImportedCancel}
            >
              确定
            </Button>
          ]}
        >
          <img src={IconFail}/>
          <h3>有 {importedResult?.["data"]?.count} 条数据上传失败，点击下方链接查看</h3>
          <a
            href={fileDomainUrl.replace("https", "http") + importedResult?.["data"]?.url}>{fileDomainUrl.replace("https", "http") + importedResult?.["data"]?.url}</a>
        </Modal>
      </Fragment>
    )
  }

  return (
    <WhiteCard>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchOrderForm)
        }}
        showTitle={false}
        dataSource={orderList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
      {/* 新增考官排班/编辑 */}
      {isShowAddModal && <CuAddArrangementModal invList={invList} arrangeId={id} queryParams={queryParams} parentForm={form}/>}
      {/* 本场考官列表 */}
      {isShowExaminerModal && <CuOrderModal id={id} invList={invList} currentRowData={currentRowData}/>}

      {/* 导入成功或失败的 Modal */}
      {(importedResult?.isShowImportedModal || importedResult?.isFailShowImportedModal) && renderImportedModal()}
    </WhiteCard>
  )
}
export default connect(({order, global}) => ({
  orderList: order.orderList,
  searchOrderForm: order.searchOrderForm,
  isShowExaminerModal: order.isShowExaminerModal,
  isHasDisable: order.isHasDisable,
  isShowAddModal: order.isShowAddModal,
  exsList: global.exsList,
  examSessionList: global.examSessionList,
  invList: global.invList,
  fileDomainUrl: global.fileDomainUrl
}))(Order)


