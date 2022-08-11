import React, {useEffect, useState} from "react"
import {connect} from "dva"
import {TableView, SearchForm, Images, AuthedButton} from "@/components"
import {getPagation, goto} from "@/utils"
import CuSafetYoModal from "./cuSafetYoModal"
import {SEX_NUMBER_ENUM} from "@/utils/constants"
import WhiteCard from "@/components/WhiteCard"
import {STATE} from "./model"
import {getDict} from "@/utils/publicFunc"
import {Button, Form, Input, Modal, Select} from "antd"
import replacementPic from "@/components/Replacement"
import bejtu from '@/assets/img/bejtu.png'
import {DownloadButton, CheckedAllButton, CheckedButton} from "@/components/BatchDownload"
const Confirm = Modal.confirm
const SafetyoFficerin = ({dispatch, safetyoFficerinList, searSafetyoFficerinForm, isSafeModalVisible}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  const [hospitalList, setHospitalList] = useState([])
  const [modalStatus, setModalStatus] = useState('')

  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  useEffect(() => {
    getData()
    getDict(dispatch, "dept")
  }, [])
  const handleChiefSearch = async (val) => {
    let reg = /^[\u4e00-\u9fa5]+$/g,
      flag = reg.test(val)
    if (flag) {
      getDict(dispatch, "dept", {keyword: val}).then((res => {
        setHospitalList(res)
      }))
    } else {
      setHospitalList([])
    }
  }
  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: "safetyoFficerin/loadSafetyoFficerinList"
    })
    setLoading(false)
  }
  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "safetyoFficerin/save",
      payload: {
        searSafetyoFficerinForm: {...searSafetyoFficerinForm, pageNum, pageSize}
      }
    })
    getData()
  }

  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: "safetyOfficerName",
            component: <Input maxLength={20} placeholder="请输入安全员姓名"/>
          },
          {
            key: "deptName",
            component: (
              <Select
                showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入所属单位"
                onSearch={handleChiefSearch}
                filterOption={handleFilterOption}
              >
                {hospitalList?.map(({value, label, id}) => {
                  return <Select.Option value={value} key={id}>{label}</Select.Option>
                })}
              </Select>
            )
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "safetyoFficerin/save",
                  payload: {
                    searSafetyoFficerinForm: STATE.searSafetyoFficerinForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            {/*<AuthedButton authCode="123123123">*/}
            <Button
              type="primary"
              onClick={() => {
                setId(0)
                setModalStatus('add')
                dispatch({
                  type: "safetyoFficerin/save",
                  payload: {
                    isSafeModalVisible: true
                  }
                })
              }}
            >
              + 增加安全员
            </Button>
            <DownloadButton>监考记录导出</DownloadButton>
            {/*</AuthedButton>*/}
          </>
        }
        handleSearch={e => {
          let deptId = e && e['deptName']?.value
          let safetyOfficerName = e && e['safetyOfficerName']
          dispatch({
            type: "safetyoFficerin/save",
            payload: {
              searSafetyoFficerinForm: {...searSafetyoFficerinForm, pageNum: 1, safetyOfficerName, deptId}
            }
          })
          getData()
        }}
      />
    )
  }
  const columns = [
    {
      /* safetyOfficerId 传入后端的  数组字段 */
      title: () => <CheckedAllButton list={safetyoFficerinList} itemName='safetyOfficerId'/>,
      dataIndex: "serialnum",
      width: 80,
      render: (text, record, index) => {
        return <>
          <CheckedButton value={record.safetyOfficerId}/> {/** 当前数据 id 字段 **/}
          <span>{(searSafetyoFficerinForm.pageNum - 1) * searSafetyoFficerinForm.pageSize + index + 1}</span>
        </>
      }
    },
    {
      title: "个人照片",
      dataIndex: "photo",
      width: 80,
      render: text => {
        return text ? replacementPic(text, <Images width={30}  height={40} src={text}/>, {}) :
          <img src={bejtu} style={{marginRight: 0, width: "30px", height: `40px`}} alt=""/>
      }
    },
    {
      title: "姓名",
      width: 80,
      dataIndex: "safetyOfficerName"
    },
    {
      title: "性别",
      dataIndex: "sex",
      width: 80,
      render: text => {
        const ITEM = SEX_NUMBER_ENUM.find(({value}) => value === text)
        if (!ITEM) {
          return "-"
        }
        return ITEM.sex
      }
    },
    {
      title: "身份证号",
      dataIndex: "encryptedId",
      width: 140
    },
    {
      title: "联系方式",
      dataIndex: "phonenumber",
      width: 130
    },
    {
      title: "所属单位",
      width: 180,
      dataIndex: "deptName"
    },
    {
      title: "操作",
      width: 220,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setId(record.safetyOfficerId)
                setModalStatus('edit')
                dispatch({
                  type: "safetyoFficerin/save",
                  payload: {
                    isSafeModalVisible: true
                  }
                })
              }}
            >
              编辑
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                Confirm({
                  title: "删除",
                  content: "确认要删除安全员信息吗?",
                  centered: true,
                  onOk: () => {
                    dispatch({
                      type: "safetyoFficerin/deleteSafetyo",
                      payload: {
                        safIds: [record.safetyOfficerId]
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
                goto.push("/drivingTest/safetyoFficerin/checkSafetyoPage/" + record.safetyOfficerId)
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
    <WhiteCard style={{backgroundColor: "transparent"}}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searSafetyoFficerinForm)
        }}
        showTitle={false}
        dataSource={safetyoFficerinList}
        search={searchForm()}
        columns={columns as any}
        rowKey="safetyOfficerId"
        loading={loading}
      />
      {isSafeModalVisible && <CuSafetYoModal id={id} modalStatus={modalStatus} parentForm={form}/>}
    </WhiteCard>
  )
}
export default connect(({safetyoFficerin}) => ({
  safetyoFficerinList: safetyoFficerin.safetyoFficerinList,
  searSafetyoFficerinForm: safetyoFficerin.searSafetyoFficerinForm,
  isSafeModalVisible: safetyoFficerin.isSafeModalVisible,
}))(SafetyoFficerin)
