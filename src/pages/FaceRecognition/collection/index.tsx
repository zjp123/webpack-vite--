import React, {useEffect, useState} from "react"
import {Button, Form, Select, Input} from "antd"
import {connect} from "dva"
import {TableView, WhiteCard, SearchForm} from "@/components"
import {STATE} from "./model"
import CheckCollectionModal from "./checkCollectionModal"
import {getPagation, isEmpty} from "@/utils"
import {getDict} from "@/utils/publicFunc"

const Collection = ({dispatch, collectionList, searchCollectionForm, isCheckCollectionModalVisible, courseList, bizTypeList}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentColumn, setCurrentColumn] = useState<any>()

  useEffect(() => {
    getData()
    getDict(dispatch, "course")
    getDict(dispatch, "bizType")
  }, [])

  // 改变pagation
  const setPagation = (pageInfo: Result.pageInfo) => {
    dispatch({
      type: "collection/save",
      payload: {
        searchCollectionForm: {...searchCollectionForm, pageNum: pageInfo.pageNum, pageSize: pageInfo.pageSize}
      }
    })
    getData()
  }

  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "collection/loadCollectionList"
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
            key: "keyword",
            component: <Input maxLength={20} placeholder="请输入姓名/身份证号" key="keyword"/>
          },
          {
            key: "schName",
            component: <Input maxLength={20} placeholder="请输入驾校名称" key="schName"/>
          },
          {
            key: "bizType",
            component: (
              <Select placeholder="请选择业务类型" allowClear>
                {bizTypeList.map(({value, label}) => {
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
            key: "course",
            component: (
              <Select placeholder="请选择考试科目" allowClear>
                {courseList.map(({value, label}) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          }
        ]}
        actions={
          <Button
            onClick={() => {
              form.resetFields()
              dispatch({
                type: "collection/save",
                payload: {
                  searchCollectionForm: STATE.searchCollectionForm
                }
              })
              getData()
            }}
          >
            重置
          </Button>
        }
        handleSearch={e => {
          dispatch({
            type: "collection/save",
            payload: {
              searchCollectionForm: {...searchCollectionForm, pageNum: 1, ...e}
            }
          })
          getData()
        }}
      />
    )
  }

  // 点击查看图片详情
  const handleViewImg = (record) => {
    // setName(record.name)
    // setType(18) //考生身份证件照
    setCurrentColumn({...record, type: record?.type})
    dispatch({
      type: "collection/save",
      payload: {
        isCheckCollectionModalVisible: true
      }
    })
  }

  const columns = [
    {
      title: "序号",
      width: 60,
      fixed: "left",
      render: (text, record, index) => {
        return <span>{(searchCollectionForm.pageNum - 1) * searchCollectionForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "流水号",
      dataIndex: "serialnum",
      width: 90
    },
    {
      title: "姓名",
      width: 100,
      dataIndex: "name"
    },
    {
      title: "身份证号码",
      dataIndex: "idCard",
      width: 200
    },
    {
      title: "驾校名称",
      dataIndex: "schShortName",
      width: 170
    },

    {
      title: "业务类型",
      dataIndex: "bizType",
      width: 100
    },
    {
      title: "准驾车型",
      dataIndex: "carType",
      width: 100
    },
    // {
    //   title: "考场",
    //   dataIndex: "examSiteName",
    //   width: 100
    // },
    {
      title: "考试科目",
      dataIndex: "course",
      width: 100
    },
    {
      title: "证件照片",
      width: 100,
      render: (record) => {
        let url = record?.pic?.license
        return (
          <Button
            type="link"
            disabled={isEmpty(url)}
            onClick={() => handleViewImg({...record, type: 18, imgList: record?.pic?.license})}
          >
            {url ? <span>查看</span> : <span>暂无</span>}
          </Button>
        )
      }
    },
    // {
    //   title: "体检照片",
    //   width: 120,
    //   render: (record) => {
    //     let url = record?.pic?.health
    //     return (
    //       <Button
    //         type="link"
    //         disabled={isEmpty(url)}
    //         onClick={() => handleViewImg({...record, type: 12, imgList: record?.pic?.health})}
    //       >
    //         {url ? <span>查看</span> : <span>暂无</span>}
    //       </Button>
    //     )
    //   }
    // },
    {
      title: "入场照片",
      width: 120,
      render: (record) => {
        let url = record?.pic?.before
        return (
          <Button
            type="link"
            disabled={isEmpty(url)}
            onClick={() => handleViewImg({...record, type: 15, imgList: record?.pic?.before})}
          >
            {url ? <span>查看</span> : <span>暂无</span>}
          </Button>
        )
      }
    },
    {
      title: "考中照片 ",
      width: 120,
      render: (record) => {
        let url = record?.pic?.middle
        return (
          <Button
            type="link"
            disabled={isEmpty(url)}
            onClick={() => handleViewImg({...record, type: 16, imgList: record?.pic?.middle})}
          >
            {url ? <span>查看</span> : <span>暂无</span>}
          </Button>
        )
      }
    },
    {
      title: "签字确认照片",
      width: 120,
      render: (record) => {
        let url = record?.pic?.sign
        return (
          <Button
            type="link"
            disabled={isEmpty(url)}
            onClick={() => handleViewImg({...record, type: 17, imgList: record?.pic?.sign})}
          >
            {url ? <span>查看</span> : <span>暂无</span>}
          </Button>
        )
      }
    },
    {
      title: "查看所有照片",
      width: 120,
      fixed: "right",
      render: (record) => {
        let url = record?.pic
        return (
          <Button
            type="link"
            disabled={isEmpty(url)}
            onClick={() => handleViewImg({...record, type: 10, imgList: record?.pic})}
          >
            {url ? <span>查看</span> : <span>暂无</span>}
          </Button>
        )
      },
    }
  ]


  return (
    <WhiteCard style={{background: "transparent"}}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchCollectionForm)
        }}
        showTitle={false}
        dataSource={collectionList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
      {isCheckCollectionModalVisible && <CheckCollectionModal currentColumn={currentColumn}/>}
    </WhiteCard>
  )
}
export default connect(({collection, global}) => ({
  collectionList: collection.collectionList,
  searchCollectionForm: collection.searchCollectionForm,
  isCheckCollectionModalVisible: collection.isCheckCollectionModalVisible,
  courseList: global.courseList,
  bizTypeList: global.bizTypeList
}))(Collection)
