import React, { Fragment, useEffect, useState } from "react"
import { connect } from "dva"
import { SearchForm, TableView, WhiteCard, Images } from "@/components"
import { Button, Form, Input, Modal, Select } from "antd"
import { getPagation, isEmpty, moment2String } from "@/utils"
import { STATE } from "./model"
import { getDict } from "@/utils/publicFunc"
import replacementPic from "@/components/Replacement"

//考官签名管理
const Autograph = ({ dispatch, autographList, searchAutographForm, exsList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isShowSignatureImg, setIsShowSignatureImg] = useState(false)
  const [signPicUrl, setSignPicUrl] = useState<string>("") // 签字url
  autographList = autographList?.map((item, id) => ({ ...item, id }))

  useEffect(() => {
    getData()
    getDict(dispatch, "exs", {})
  }, [])
  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: "autograph/save",
      payload: {
        searchAutographForm: { ...searchAutographForm, pageNum, pageSize }
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "autograph/loadautographList"
    })
    setLoading(false)
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", { keyword: val })
  }

  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={
          [
            {
              key: "examSiteName",
              component: <Select
                showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请选择考场名称"
                onSearch={handleSearchExam}
                filterOption={handleFilterOption}
              >
                {exsList?.map(({ value, label }) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
                }
              </Select>
            },
            {
              key: "examinerName",
              component: <Input maxLength={20} allowClear placeholder="请输入考官姓名" key="examSiteId"/>
            }
          ]
        }
        actions={
          <Fragment>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "autograph/save",
                  payload: {
                    searchAutographForm: STATE.searchAutographForm
                  }
                })
                getData()
              }}>
              重置
            </Button>
          </Fragment>
        }
        handleSearch={(e) => {
          const data: any = {
            ...e,
            examSiteName: e["examSiteName"] && e["examSiteName"].label
          }
          dispatch({
            type: "autograph/save",
            payload: {
              searchAutographForm: { ...searchAutographForm, pageNum: 1, ...data }
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
        return <span>{(searchAutographForm.pageNum - 1) * searchAutographForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "考官人像照片",
      dataIndex: "sitePhotoPic",
      width: 100,
      render: (text) => {
        return replacementPic(text, <Images src={text} width={30} height={40}/>, {})
      }
    },
    {
      title: "考官电子签名",
      dataIndex: "signPic",
      width: 100,
      render: (text) => {
        return <span onClick={() => {
          if (!isEmpty(text)) {
            setIsShowSignatureImg(true)
            setSignPicUrl(text)
          }
        }}>
          {replacementPic(text, <Images src={text} width={30} height={40} enlarge={false}/>, {})}
        </span>
      }
    },
    {
      title: "考官代码",
      dataIndex: "examinerCode",
      width: 120
    },
    {
      title: "考官姓名",
      width: 100,
      dataIndex: "examinerName"
    },
    {
      title: "考场名称",
      dataIndex: "examSiteName",
      width: 150
    },
    {
      title: "考场身份",
      dataIndex: "examinerDuty",
      width: 120
    },
    {
      title: "监考日期",
      dataIndex: "examDate",
      width: 160,
      render: (item) => item === "-" ? "-":  moment2String(item, "YYYY-MM-DD")
    },
    {
      title: "考试开启方式",
      dataIndex: "startType",
      width: 120
    },
    {
      title: "考试开启时间",
      dataIndex: "examStartTime",
      width: 150
    },
    {
      title: "考试结束时间",
      dataIndex: "examEndTime",
      width: 160
    }
  ]
  return (
    <WhiteCard>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchAutographForm)
        }}
        showTitle={false}
        dataSource={autographList}
        columns={columns}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
      {isShowSignatureImg && <Modal
        closable={false}
        visible={isShowSignatureImg}
        centered
        width={240}
        destroyOnClose
        footer={null}
        onCancel={() => setIsShowSignatureImg(false)}
      >
        <div style={{ textAlign: "center", borderRadius: "12px" }}><Images src={signPicUrl} enlarge={false}/></div>
      </Modal>}
    </WhiteCard>
  )
}
export default connect(({ autograph, global }) => ({
  autographList: autograph.autographList,
  searchAutographForm: autograph.searchAutographForm,
  exsList: global.exsList
}))(Autograph)


