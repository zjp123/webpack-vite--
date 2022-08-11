import React, {useEffect, useState} from "react"
import {connect} from "dva"
import {TableView, WhiteCard, SearchForm} from "@/components"
import {Button, Form, Input} from "antd"
import {STATE} from "./model"
import {getPagation} from "@/utils"
import {getDict} from "@/utils/publicFunc"
import {CheckedAllButton, CheckedButton, DownloadButton} from "@/components/BatchDownload";
import './style.less'
import {downloadChecktheList} from "@/api/management";

const CheCkthe = ({
                    dispatch,
                    searchChecktheForm,
                    searchStuChecktheForm,
                    checktheList,
                    stuChecktheList,
                    courseList,
                    total,
                    stuTotal
                  }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [stuLoading, setStuLoading] = useState(false)
  const [showSchool, setShowSchool] = useState({})
  useEffect(() => {
    dispatch({
      type: "cheCkthe/save",
      payload: {
        searchChecktheForm: {...STATE.searchChecktheForm}
      }
    })
    getData()
    getDict(dispatch, "course")
    getDict(dispatch, "sch")

  }, [])
  // 改变欠费驾校pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "cheCkthe/save",
      payload: {
        searchChecktheForm: {...searchChecktheForm, pageNum, pageSize}
      }
    })
    getData()
  }
  // 改变欠费学员pagation
  const setStuPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "cheCkthe/save",
      payload: {
        searchStuChecktheForm: {...searchStuChecktheForm, pageNum, pageSize}
      }
    })
    getStuData({schId: (showSchool as any)?.id})
  }
  //获取欠费驾校列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "cheCkthe/loadChecktheList"
    })
    setLoading(false)
  }
  //获取欠费学员列表数据
  const getStuData = async (payload) => {
    setStuLoading(true)
    await dispatch({
      type: "cheCkthe/loadStuChecktheList",
      payload
    })
    setStuLoading(false)
  }
  // 驾校查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: "schName",
            component: <Input maxLength={20} placeholder="请输入驾校名称" key="schName"/>
          },
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "cheCkthe/save",
                  payload: {
                    searchChecktheForm: STATE.searchChecktheForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <DownloadButton downloadApi={downloadChecktheList} paramsName='schIds' xlsOrZip>导出名单</DownloadButton>
          </>
        }
        handleSearch={e => {
          dispatch({
            type: "cheCkthe/save",
            payload: {
              searchChecktheForm: {...searchChecktheForm, pageNum: 1, ...e}
            }
          })
          getData()
        }}
      />
    )
  }
  // 学员查询区域
  const stuSearchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: "keyword",
            col: 6,
            component: <Input maxLength={20} placeholder="请输入姓名/身份证号码/流水号" key="keyword"/>
          },
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "cheCkthe/save",
                  payload: {
                    searchStuChecktheForm: STATE.searchStuChecktheForm
                  }
                })
                getStuData({schId: (showSchool as any)?.id})
              }}
            >
              重置
            </Button>
            <Button type='primary' onClick={() => setShowSchool({})}>返回驾校列表</Button>
          </>
        }
        handleSearch={e => {
          console.log(e)
          dispatch({
            type: "cheCkthe/save",
            payload: {
              searchStuChecktheForm: {...searchStuChecktheForm, pageNum: 1, ...e}
            }
          })
          getStuData({schId: (showSchool as any)?.id})
        }}
      />
    )
  }

  // 驾校Title
  const SchTitle = () => {
    return (
      <div className='sch-title'>
        <div>
          欠费驾校数量：
          <div> {total?.schNum || 0} 家</div>
        </div>
        <div>
          欠费学员数量：
          <div> {total?.stuNum || 0} 人</div>
        </div>
        <div>
          欠费总金额：
          <div> {total?.amount || 0} 元</div>
        </div>
      </div>
    )
  }
  const customElement = () => (
    <div style={{width: '100%'}}>
      <span style={{marginRight: '20px'}}>
        <span> {(showSchool as any)?.name} </span>
      </span>
      <span style={{marginRight: '20px'}}>
        共有
        <span style={{color: "#FF4949"}}> {stuTotal?.stuNum || 0} </span>条学员欠费
      </span>
      <span style={{marginRight: '20px'}}>
        欠费总金额：
        <span style={{color: "#FF4949"}}> {stuTotal?.amount || 0} </span>元
      </span>
    </div>
  )

  const columns = [
    {
      title: () => <CheckedAllButton list={checktheList} itemName='schId'/>,
      width: 80,
      render: (text, record, index) => {
        return <>
          <CheckedButton value={record?.schId}/>
          <span style={{marginLeft: '10px'}}>
            {(searchChecktheForm.pageNum - 1) * searchChecktheForm.pageSize + index + 1}
          </span>
        </>
      }
    },
    {
      title: "欠费驾校",
      dataIndex: "schName",
      width: 120
    },
    {
      title: "欠费学员数量",
      dataIndex: "stuNum",
      width: 120
    },
    {
      title: "欠费总金额",
      dataIndex: "amount",
      width: 120
    },
    {
      title: "操作",
      fixed: "right",
      render: (text, record, index) => {
        return <>
          <a onClick={async () => {
            console.log(record.schId)
            setShowSchool({id: record.schId, name: record.schName})
            await getStuData({schId: record.schId})
          }}>欠费学员</a>
          <a onClick={() => downloadChecktheList({schIds: [record.schId]}, '')} style={{marginLeft: '20px'}}>导出欠费名单</a>
        </>
      }
    }
  ]

  const stuColumns = [
    {
      title: "序号",
      width: 80,
      render: (text, record, index) => {
        return <span>
            {(searchStuChecktheForm.pageNum - 1) * searchStuChecktheForm.pageSize + index + 1}
          </span>
      }
    },
    {
      title: "学员姓名",
      dataIndex: "name",
    },
    {
      title: "身份证明号码",
      width: 180,
      dataIndex: "idCard",
    },
    {
      title: "流水号",
      width: 140,
      dataIndex: "serialNum",
    },
    {
      title: "科目一",
      dataIndex: "k1Amount",
    },
    {
      title: "科目一补考",
      dataIndex: "k1MakeUpAmount",
    },
    {
      title: "科目二",
      dataIndex: "k2Amount",
    },
    {
      title: "科目二补考",
      dataIndex: "k2MakeUpAmount",
    },
    {
      title: "科目三道路",
      dataIndex: "k3Amount",
    },
    {
      title: "科目三道路补考",
      width: 140,
      dataIndex: "k3MakeUpAmount",
    },
    {
      title: "科目三理论",
      dataIndex: "k4Amount",
    },
    {
      title: "科目三理论补考",
      width: 140,
      dataIndex: "k4MakeUpAmount",
    },
    {
      title: "欠费总金额",
      dataIndex: "totalAmount",
    },
  ]
  return (
    !(showSchool as any).id ? <>
      <SchTitle/>
      <WhiteCard style={{background: "transparent"}}>
        <TableView
          pageProps={{
            getPageList: setPagation,
            pagination: getPagation(searchChecktheForm)
          }}
          showTitle={false}
          dataSource={checktheList}
          columns={columns as any}
          search={searchForm()}
          rowKey="cheCkthe"
          loading={loading}
        />
      </WhiteCard></> : <WhiteCard style={{background: "transparent"}}>
      <TableView
        pageProps={{
          getPageList: setStuPagation,
          pagination: getPagation(searchStuChecktheForm)
        }}
        customElement={customElement()}
        showTitle={false}
        dataSource={stuChecktheList}
        columns={stuColumns as any}
        search={stuSearchForm()}
        rowKey="cheCkthe"
        loading={stuLoading}
      />
    </WhiteCard>
  )
}
export default connect(({cheCkthe, global}) => ({
  checktheList: cheCkthe.checktheList,
  stuChecktheList: cheCkthe.stuChecktheList,
  searchChecktheForm: cheCkthe.searchChecktheForm,
  searchStuChecktheForm: cheCkthe.searchStuChecktheForm,
  total: cheCkthe.total,
  stuTotal: cheCkthe.stuTotal,
  courseList: global.courseList
}))(CheCkthe)
