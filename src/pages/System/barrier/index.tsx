import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import './style.less'
import {TableView, WhiteCard, SearchForm, Images} from "@/components"
import {Button, Form, Input, Modal, Space, Select} from "antd"
import {getPagation} from "@/utils"
import {STATE} from "@/pages/System/barrier/model";
import {getDict} from "@/utils/publicFunc"
import CuBarrierModal from "@/pages/System/barrier/cuBarrierModal";

const Confirm = Modal.confirm;

type Update = {
  status: string,
  examSiteId: string,
  id: string
}

const Status = ['启用', '禁用']

const Barrier = ({dispatch, barrierList, barrierSearchForm, exsList}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getBarrierList()
    getDict(dispatch, "exs", {})
    return function cleanup() {
      dispatch({
        type: "barrier/save",
        payload: {
          barrierList: [],
          barrierSearchForm: {
            pageNum: 1,
            pageSize: 10,
          },
        }
      })
    }
  }, [])

  const getBarrierList = async () => {
    setLoading(true)
    await dispatch({
      type: 'barrier/loadBarrierList'
    })
    setLoading(false)
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", {keyword: val})
  }

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "barrier/save",
      payload: {
        barrierSearchForm: {...barrierSearchForm, pageNum, pageSize}
      }
    })
    getBarrierList()
  }

  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[{
          key: "macCode",
          component: <Input maxLength={20} placeholder="请输入设备编码" key="macCode"/>
        }, {
          key: "examSiteId",
          component: <Select
            showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请选择考场名称"
            onSearch={handleSearchExam}
            filterOption={handleFilterOption}
          >
            {exsList?.map(({value, label}) => {
              return <Select.Option value={value} key={value}>{label}</Select.Option>
            })
            }
          </Select>
        }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "barrier/save",
                  payload: {
                    barrierSearchForm: STATE.barrierSearchForm
                  }
                })
                getBarrierList()
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
            type: "barrier/save",
            payload: {
              barrierSearchForm: {...barrierSearchForm, pageNum: 1, ...data}
            }
          })
          getBarrierList()
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
        return <span>{(barrierSearchForm.pageNum - 1) * barrierSearchForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "考场名称",
      dataIndex: "examSiteName",
      width: 200
    },
    {
      title: "设备编码",
      dataIndex: "macCode",
      width: 200
    },
    {
      title: "所属厂家",
      dataIndex: "macManufacturerName",
      width: 120
    },
    {
      title: "控制指令",
      dataIndex: "gateControllerSchemeName",
      width: 120
    },
    {
      title: "最后使用时间",
      dataIndex: "lastUsageTime",
      width: 200
    },
    {
      title: "设备状态",
      dataIndex: "status",
      width: 100,
      render: text => <span style={{color: Status[text] === '启用' ? 'green' : 'red'}}>{Status[text]}</span>
    },
    {
      title: "操作",
      width: 160,
      render: (text, record) => {
        const toStatus = record.status == 1 ? 0 : 1
        return (
          <>
            <Button type='link'
                    onClick={() => {
                      Confirm({
                        title: `${Status[toStatus]}设备`,
                        content: <>确认{Status[toStatus]} <b>{record.examSiteName}</b> 设备？</>,
                        centered: true,
                        // icon: null,
                        onOk: async () => {
                          await dispatch({
                            type: "barrier/updateStatus",
                            payload: {
                              id: record.id,
                              examSiteId: record.examSiteId,
                              status: toStatus
                            }
                          })
                          dispatch({
                            type: "barrier/save",
                            payload: {
                              id: '',
                            }
                          })
                          getBarrierList()
                        }
                      })
                    }}
            >
              {Status[toStatus]}
            </Button>
            <Button type='link'
              onClick={() => {
                dispatch({
                  type: 'barrier/save',
                  payload: {
                    isCuBarrierModalVisible: true,
                    id: record.id,
                  }
                })
              }}
            >
              修改
            </Button>
            <Button type='link'
              onClick={async () => {
                Confirm({
                  title: "删除设备",
                  content: <>确认删除 <b>{record.examSiteName}</b> 设备  ？删除后该设备将不能使用。</>,
                  centered: true,
                  onOk: async () => {
                    await dispatch({
                      type: 'barrier/deleteInfo',
                      payload: {
                        id: record.id,
                      }
                    })
                    getBarrierList()
                  }
                })
              }}
            >
              删除
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard>
      <CuBarrierModal />
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(barrierSearchForm)
        }}
        showTitle={false}
        dataSource={barrierList}
        columns={columns}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({barrier, global}) => ({
  barrierList: barrier.barrierList,
  barrierSearchForm: barrier.barrierSearchForm,
  exsList: global.exsList
}))(Barrier)


