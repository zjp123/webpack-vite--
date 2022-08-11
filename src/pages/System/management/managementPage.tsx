import React, {useEffect, useState} from "react"
import {connect} from "dva"
import {TableView, WhiteCard, SearchForm} from "@/components"
import {Button, Form, Input, Modal, message, Switch} from "antd"
import CuRoleModal from "./managementModaltop"
import {Modifythesecurity, updateSecondeDictApi} from "@/api/system"
import {STATE} from "./model"
import {getPagation} from "@/utils"

const Confirm = Modal.confirm
const Management = ({match, dispatch, secondaryList, searchsecondaryListForm, isCuRoleModalVisibletop}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setDictId] = useState<any>()
  const dictType = match?.params?.id
  const [level, setLevel] = useState<any>() // 二级字典新增标识

  useEffect(() => {
    getData()
  }, [])
  // 改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "management/save",
      payload: {
        searchsecondaryListForm: {...searchsecondaryListForm, pageNum, pageSize}
      }
    })
    getData()
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "management/loadSecondaryList",
      payload: {
        dictType: dictType
      }
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
            key: "dictLabel",
            component: <Input maxLength={20} placeholder="字典值名称" key="dictLabel"/>
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
                    searchsecondaryListForm: STATE.searchsecondaryListForm
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
                setLevel(2)
                setDictId(undefined) // 二级列表id
                dispatch({
                  type: "management/save",
                  payload: {
                    isCuRoleModalVisibletop: true
                  }
                })
              }}
            >
              + 添加字典值
            </Button>
          </>
        }
        handleSearch={e => {
          dispatch({
            type: "management/save",
            payload: {
              searchsecondaryListForm: {...searchsecondaryListForm, pageNum: 1, ...e}
            }
          })
          getData()
        }}
      />
    )
  }

  //修改状态
  const switchChange = (checked, id, index) => {
    updateSecondeDictApi({
      status: +checked ? "0" : "1",
      dictType,
      dictLabel: secondaryList[index].dictLabel,
      dictValue: secondaryList[index].dictValue,
      id
    }).then(res => {
      if (res.code === 0) {
        message.success(+checked ? "已启用" : "已禁用")
        getData()
      }
    })
  }

  const columns = [
    {
      title: "序号",
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchsecondaryListForm.pageNum - 1) * searchsecondaryListForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "字典标签",
      dataIndex: "dictLabel",
      width: 100
    },
    {
      title: "字典键值",
      width: 100,
      dataIndex: "dictValue"
    },
    {
      title: "创建时间",
      dataIndex: "createdTime",
      width: 120
    },
    {
      title: "排序",
      dataIndex: "dictSort",
      width: 100
    },
    {
      title: "备注",
      dataIndex: "remark",
      width: 80
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (text: string, record: Result.ObjectType, index) => {
        return <Switch checked={!!!Number(text)} onChange={checked => switchChange(checked, record.id, index)}/>
      }
    },
    {
      title: "操作",
      width: 150,
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setDictId(record.id) // 二级列表id
                dispatch({
                  type: "management/save",
                  payload: {
                    isCuRoleModalVisibletop: true
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
                      type: "management/deleteSecondDict",
                      payload: {
                        Ids: [record.id]
                      }
                    }).then((res) => {
                      if (res?.code === 0) {
                        getData()
                      }
                    })
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
    <WhiteCard style={{background: "transparent"}}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchsecondaryListForm)
        }}
        showTitle={false}
        dataSource={secondaryList}
        columns={columns}
        search={searchForm()}
        rowKey="dictId"
        loading={loading}
      />
      {isCuRoleModalVisibletop && <CuRoleModal dictType={dictType} level={level} id={id}/>}
    </WhiteCard>
  )
}
export default connect(({management}) => ({
  secondaryList: management.secondaryList,
  searchsecondaryListForm: management.searchsecondaryListForm,
  isCuRoleModalVisibletop: management.isCuRoleModalVisibletop
}))(Management)
