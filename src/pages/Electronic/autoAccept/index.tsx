import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import './style.less'
import {TableView, WhiteCard, SearchForm} from "@/components"
import {Button, Form, Input, Space, Select} from "antd"
import {getPagation} from "@/utils"
import {acceptingApi} from "@/api/electronic";
import {getDict} from "@/utils/publicFunc"
import {message} from 'antd'
// import {STATE} from "./model";
// import SignEditorModal from "@/pages/System/signMachine/editorMachineModal";

// const Confirm = Modal.confirm;

// type Update = {
//   status: string,
//   examSiteId: string,
//   id: string
// }

const AutoAcceptCom = ({dispatch, autoAcceptList, formParams, bizTypeList, perdritypeList, account, schList, clickAuto}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getDict(dispatch,"bizType") // 业务类型
    getDict(dispatch,"perdritype") // 准驾车型
    getDict(dispatch, "sch") // 驾校名称
    // 获取表格数据
    getAutoAcceptList()
    // 向全局model中发送action 获得考场请求数据exsList，然后通过connect 从全局model中
    // 拿到这个字段exsList
    // getDict(dispatch, "exs", {})
    // 组件卸载清除 state数据
    // return function cleanup() {
    //   dispatch({
    //     type: "signMachine/save",
    //     payload: {
    //       signMachineList: [],
    //       signMachineSearchForm: {
    //         pageNum: 1,
    //         pageSize: 10,
    //       },
    //     }
    //   })
    // }
  }, [])

  const getAutoAcceptList = async () => {
    setLoading(true)
    await dispatch({
      type: 'autoAccept/loadAutoList'
    })
    setLoading(false)
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  // 考场名称模糊查询
  const handleSearchSaf = async (val) => {
    getDict(dispatch, "sch", { keyword: val })
  }

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: 'autoAccept/loadAutoList',
      payload: {
        searchUserForm: {...formParams, pageNum, pageSize}
      }
    })
    getAutoAcceptList()
  }

  const acceptingFn = async () => {
    let firstAccept = sessionStorage.getItem('firstAccept')
    if (!firstAccept || firstAccept === 'false') {
      message.warn('开始执行自动受理')
      interval300Request()
    }
    const result: any = await acceptingApi({'open': 1})
    if (result.data == 1) { // 受理中状态
      // setAccepting(true)
      sessionStorage.setItem('firstAccept', 'true')
      if (firstAccept === 'true') {
        message.warn('受理中，不能重复点击')
        if (!clickAuto) {
          interval300Request() // 刷新页面后 状态消失
        }
      }
      dispatch({
        type: 'autoAccept/save',
        payload: {
          clickAuto: true
        }
      })

    }
    if (result.data == 0) { // 暂停受理
      sessionStorage.setItem('firstAccept', 'false')
      dispatch({
        type: 'autoAccept/save',
        payload: {
          clickAuto: false
        }
      })
      message.warn('本次自动受理结束, 可以开启新的自动受理')

      // setAccepting(false)
    }
    return result

  }

  const interval300Request = () => {
    return new Promise((resolve, reject) => {
      let timerId = setInterval(() => {
        acceptingApi({'open': 1}).then(async (res: any) => {
          if (res.data == 0) { // 等于0 受理暂停  停止轮询
            clearInterval(timerId)
          }
          if (res.data == 1) { // 受理中 刷新列表
            await getAutoAcceptList()
          }
          resolve(res)
        }).catch(err => {
          clearInterval(timerId)
          reject(err)
        })
      }, 1000 * 60 * 10) // 10分钟轮询一次
    })
    
  }

  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[{
          key: "serialNum",
          component: <Input maxLength={18} placeholder="流水号/身份证号码/姓名" key="fileNum"/>
        }, {
          key: 'businessType',
          component: (
            <Select placeholder="请选择业务类型" allowClear>
              {bizTypeList.map(({ value, label }) => {
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
          key: 'perdritype',
          component: (
            <Select placeholder="请选择准驾车型" allowClear>
              {perdritypeList.map(({ value, label }) => {
                return (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                )
              })}
            </Select>
          )
        },{
          // key: "examSiteId",
          // component: <Select
          //   showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入驾校名称"
          //   onSearch={handleSearchExam}
          //   filterOption={handleFilterOption}
          // >
          //   {exsList?.map(({ value, label }) => {
          //     return <Select.Option value={value} key={value}>{label}</Select.Option>
          //   })
          //   }
          // </Select>
            key: 'schId',
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入驾校名称"
              onSearch={handleSearchSaf}
              filterOption={handleFilterOption}
            >
              {schList?.map(({ value, label }) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>
        },
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "autoAccept/save",
                  payload: {
                    formParams: {pageNum: 1, pageSize: 10,type: "ALL"}
                  }
                })
                getAutoAcceptList()
              }}
            >重置</Button>
            <Button
              type='primary'
              // loading={accepting}
              onClick={() => {
                acceptingFn()
                // dispatch({
                //   type: "autoAccept/doAccept",
                //   payload: {
                //     formParams: {'open': 1}
                //   }
                // })
                // if (accepting) {
                //   return
                // }
                // setAccepting(true)
                // interval300Request().then((res: any) => {
                //   if (res.data == 0) {
                //     setAccepting(false)
                //   }
                //   console.log(res, '受理中受理中受理中....')
                // }).catch(err => {
                //   setAccepting(false)
                //   console.log(err)

                // })
                
              }}
            >
              自动受理
            </Button>
          </Space>
        }
        handleSearch={(e) => {
          const data: any = {
            ...e,
            schId: e["schId"] && e["schId"].value
          }
          dispatch({
            type: "autoAccept/save",
            payload: {
              formParams: {...formParams, pageNum: 1, ...data}
            }
          })
          getAutoAcceptList()
        }}
      >
      </SearchForm>
    )
  }
  const customElement = () => {
    {/* 信息列表:共查询到 <span style={{color: "#006EFF"}}>{0}</span> 条信息 */}
    return <div className='rowStyle'>
      <span>默认全部数据</span>
      <div className='mlr-10'>
        <span>截止今日预录入未受理：</span>
        <span className='color-number' onClick={() => {
                const params = form.getFieldsValue()
                dispatch({
                  type: "autoAccept/save",
                  payload: {
                    formParams: {...formParams, ...params, pageNum: 1, type: 'NO_ACCEPT'}
                  }
                })
                getAutoAcceptList()
        }}>{account.noAcceptCount || 0}</span>
        <span>条</span>
      </div>
      <div className='mlr-10'>
        <span>今日自动受理：</span>
        <span className='color-number' onClick={() => {
                dispatch({
                  type: "autoAccept/save",
                  payload: {
                    formParams: {...formParams, pageNum: 1, type: 'CUR_ACCEPT'}
                  }
                })
                getAutoAcceptList()
        }}>{account.curDayAcceptedCount || 0}</span>
        <span>条</span>
      </div>
      <div className='mlr-10'>
        <span>受理成功：</span>
        <span className='color-number' onClick={() => {
                dispatch({
                  type: "autoAccept/save",
                  payload: {
                    formParams: {...formParams, pageNum: 1, type: 'CUR_ACCEPT_SUCCESS'}
                  }
                })
                getAutoAcceptList()
        }}>{account.acceptedSuccessCount || 0}</span>
        <span>条</span>
      </div>
      <div className='mlr-10'>
        <span>受理失败：</span>
        <span className='color-number' onClick={() => {
                dispatch({
                  type: "autoAccept/save",
                  payload: {
                    formParams: {...formParams, pageNum: 1, type: 'CUR_ACCEPT_ERROR'}
                  }
                })
                getAutoAcceptList()
        }}>{account.acceptedFailCount || 0}</span>
        <span>条</span>
      </div>
    </div>

  }

  //table表头
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(formParams.pageNum - 1) * formParams.pageSize + index + 1}</span>
      }
    },
    {
      title: "学员姓名",
      dataIndex: "name",
      width: 80
    },
    {
      title: "身份证号码",
      dataIndex: "idCard",
      width: 200
    },
    {
      title: "流水号",
      dataIndex: "serialNum",
      width: 130
    },
    {
      title: "业务类型",
      dataIndex: "businessTypeName",
      width: 90
    },
    {
      title: "准驾车型",
      dataIndex: "perdritype",
      width: 90
    },
    {
      title: "驾培驾校名称",
      dataIndex: "schName",
      width: 200,
    },
    {
      title: "业务状态",
      dataIndex: "status",
      width: 80,
      render: (text) => {
        return text === 0 ? '未受理' : 
                text === 1 ? '成功' : 
                text === 2 ? '失败' : ''
      }
    },
    {
      title: "受理时间",
      dataIndex: "acceptedTime",
      width: 200
    },
    {
      title: "备注",
      width: 160,
      render: (text, record) => {
        return text
      }
    }
  ]

  return (
    <WhiteCard>
      {/* <SignEditorModal brand={record.brand} model={record.model}/> */}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(formParams)
        }}
        showTitle={false}
        dataSource={autoAcceptList}
        customElement={customElement()}
        columns={columns}
        search={searchForm()}
        rowKey="idCard"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({autoAccept, global}) => ({
  autoAcceptList: autoAccept.autoAcceptList,
  account: autoAccept.account,
  formParams: autoAccept.formParams,
  bizTypeList:global.bizTypeList,
  schList: global.schList,
  perdritypeList:global.perdritypeList,
  clickAuto: autoAccept.clickAuto
  // exsList: global.exsList
}))(AutoAcceptCom)


