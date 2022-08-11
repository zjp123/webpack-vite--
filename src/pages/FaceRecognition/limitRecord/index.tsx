import React, { useEffect, useState } from "react"
import { Button, Form, DatePicker, Select, Modal } from "antd"
import { connect } from "dva"
import { TableView, WhiteCard, SearchForm } from "@/components"
import { STATE } from "./model"
import { getDict } from "@/utils/publicFunc"
import { getPagation, formatParameters } from "@/utils"

const Confirm = Modal.confirm
const LimitRecord = ({ dispatch, limitRecordList, searchLimitRecordForm, limitReasonList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getData()
    getDict(dispatch, "limitReason")
  }, [])
  // 改变pagation
  const setPagation = (pageInfo: Result.pageInfo) => {
    dispatch({
      type: "limitRecord/save",
      payload: {
        searchLimitRecordForm: { ...searchLimitRecordForm, pageNum: pageInfo.pageNum, pageSize: pageInfo.pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "limitRecord/loadLimitRecordList"
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
            key: "reason",
            component: (
              <Select placeholder="请选择限制原因" allowClear>
                {limitReasonList.map(({ value, label }) => {
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
            key: "startTime",
            col: 8,
            component: <DatePicker.RangePicker allowClear placeholder={["开始时间", "结束时间"]}/>
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "limitRecord/save",
                  payload: {
                    searchLimitRecordForm: STATE.searchLimitRecordForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
          </>
        }
        handleSearch={e => {
          let obj = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "startTime",
                startTime: "startTime",
                endTime: "endTime"
              }
            ]
          })
          dispatch({
            type: "limitRecord/save",
            payload: {
              searchLimitRecordForm: { ...searchLimitRecordForm, pageNum: 1, ...obj }
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
      width: 80,
      render: (text, record, index) => {
        return <span>{(searchLimitRecordForm.pageNum - 1) * searchLimitRecordForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "命中时间",
      dataIndex: "hitTime",
      width: 200
    },
    {
      title: "命中考场",
      width: 80,
      dataIndex: "examSite"
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 80
    },
    {
      title: "身份证号码",
      dataIndex: "idCard",
      width: 150
    },
    {
      title: "限制原因",
      dataIndex: "reason",
      width: 80
    },
    {
      title: "犯罪事实",
      dataIndex: "crimeFact",
      width: 80
    },
    {
      title: "逃跑日期",
      dataIndex: "fleeTime",
      width: 190
    },
    {
      title: "状态",
      dataIndex: "dealStatus",
      width: 200,
      render: obj => {
        return <span style={{ color: obj.color }}> {obj.text}</span>
      }
    },
    {
      title: "处置人",
      dataIndex: "operator",
      width: 80
    },
    {
      title: "操作",
      dataIndex: "cost",
      width: 80,
      fixed: "right",
      render: (text, record) => {
        let isgreen = record.dealStatus.color === "#62BC00"
        return (
          <Button
            type="link"
            style={{ color: isgreen ? "#ccc" : "" }}
            onClick={() => {
              if (!isgreen) {
                Confirm({
                  title: "限制信息处置",
                  content: `关于姓名:${record.name}身份证号:${record.idCard}的于:${record.fleeTime}检查到的:${record.crimeFact}信息处置操作`,
                  okText: "继续预警",
                  cancelText: "不再预警",
                  onOk: () => {
                    console.log("dealStatusCode", 123)
                    dispatch({
                      type: "limitRecord/change",
                      payload: {
                        id: record.id,
                        dealStatus: record.dealStatusCode === 0 ? 1 : 2

                        // dealStatus:1
                      }
                    })
                    getData()
                  },
                  onCancel: () => {
                    dispatch({
                      type: "limitRecord/change",
                      payload: {
                        id: record.id,
                        dealStatus: 2
                      }
                    })
                    getData()
                  }
                })
              }
            }}
          >
            处置
          </Button>
        )
      }
    }
  ]
  return (
    <WhiteCard style={{ background: "transparent" }}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchLimitRecordForm)
        }}
        showTitle={false}
        dataSource={limitRecordList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ limitRecord, global }) => ({
  limitRecordList: limitRecord.limitRecordList,
  searchLimitRecordForm: limitRecord.searchLimitRecordForm,
  limitReasonList: global.limitReasonList
}))(LimitRecord)
