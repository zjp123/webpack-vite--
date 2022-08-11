import React, {useEffect, useRef, useState, useMemo} from 'react'
import {connect} from 'dva';
import {TableView, WhiteCard, SearchForm, Images} from "@/components"
import {Button, Form, Input, Modal, Space, Select, DatePicker, message} from "antd"
import {formatParameters, getPagation} from "@/utils"
import {STATE} from "./model";
import {getDict} from "@/utils/publicFunc"
import ReactToPrint from 'react-to-print'
// import {DownloadButton, CheckedAllButton, CheckedButton} from "@/components/BatchDownload"
import moment from "moment";
import {batchLoadUrlApi, deleteTranscriptApi, regenerateTranscriptApi} from "@/api/electronic";
import {openNotification} from "@/components/OpenNotification";
import {ColumnsType} from 'antd/lib/table'
import {recordPrintCountApi} from "@/api/examine";
// import NotPrint from './notPrint'
import { Table } from 'antd';
import './index.less'
import download2 from "@/assets/svg/icon-download2.svg"
import download from "@/assets/svg/icon-download.svg" 

const Confirm = Modal.confirm
const getUrl = async (list: Array<{ serialNum: string, subject: string }>) => {
  const res: any = await batchLoadUrlApi({results: list})
  return res.data
}

const getCourseType = (type) => {
  switch (type) {
    case '1':
      return "科目一"
    case '2':
      return "科目二"
    case '3':
      return "科目三"
    case '4':
      return "科目四"
    case '5':
      return "科目五"
  }
}

const businessTypeDisabled = (value: string) => {
  switch (value) {
    case "A":
      return false
    case "B":
      return false
    case "D":
      return false
    case "F":
      return false
    default:
      return true
  }
}

const SignManagement = ({dispatch, signList, signSearchForm, courseList, perdritypeList, bizTypeList, exsCodeList, schoolList}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [firstInit, setFirstInit] = useState(false)
  const [visible, setVisible] = useState(false)
  const [printVisible, setPrintVisible] = useState(false)
  const [printUrl, setPrintUrl] = useState([])
  const [ids, setIds] = useState([])
  // const [checkedListLength, setCheckedListLength] = useState(0)
  const [oneOrMore, setOneOrMore] = useState('')
  const printRef = useRef<any>(null)
  const [currentInfo, setCurrentInfo] = useState<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRows, setSelectedRows] = useState([])

  const initTime = useMemo(() => {
    return {
      beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      time: [moment(initTime.beginTime), moment(initTime.endTime)]
    })
    dispatch({
      type: "sign/save",
      payload: {
        signSearchForm: {...STATE.signSearchForm, ...initTime}
      }
    })
    initSignList()
    getDictList()
    return function cleanup() {
      setVisible(false)
      setCurrentInfo({})
      dispatch({
        type: "sign/save",
        payload: {
          signList: [],
          signSearchForm: {
            pageNum: 1,
            pageSize: 10,
          },
        }
      })
    }
  }, [])

  useEffect(() => {
    if (firstInit) {
      setNotPrintFn()
    }
  }, [firstInit])

  const getDictList = () => {
    ;["course", "perdritype", "bizType", "exsCode", "school"].forEach(item => {
      getDict(dispatch, item)
    })
  }

  const initSignList = async () => {
    setLoading(true)
    await dispatch({
      type: 'sign/loadSignList'
    })
    setLoading(false)
    setFirstInit(true)
  }

  // 设置默认 勾选未打印
  const setNotPrintFn = () => {
    // console.log(signList, 'signListsignListsignList')
    const arr = []
    const rows = signList.filter((item, index) => {
        return item.pointCount === 0
    })
    rows.map((item) => {
      arr.push(item.examResultId)
    })
    setSelectedRowKeys(arr)
    setSelectedRows(rows)
  }

  const getSignList = async () => {
    setLoading(true)
    await dispatch({
      type: 'sign/loadSignList'
    })
    setLoading(false)
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exsCode", {keyword: val})
  }

  // 筛选驾校信息
  const handleFilterOptionSchool = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询驾校下拉
  const handleSearchSchool = async (val) => {
    getDict(dispatch, "school", {keyword: val})
  }

  // 翻页改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "sign/save",
      payload: {
        signSearchForm: {...signSearchForm, pageNum, pageSize}
      }
    })
    getSignList()
    setSelectedRowKeys([]) // 翻页后选择的都清掉
    setSelectedRows([])
  }

  //查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: "stuInfo",
            component: <Input maxLength={20} placeholder="请输入姓名/身份证号码/流水号" key="macCode"/>,
            col: 8
          },
          {
            key: "businessType",
            component: <Select placeholder="请选择业务类型" allowClear>
              {
                bizTypeList.map(({value, label}) => {
                  return !businessTypeDisabled(value) &&
                    <Select.Option value={value} key={value}>{label}</Select.Option>
                })
              }
            </Select>
          },
          {
            key: "perdritype",
            component: <Select placeholder="请选择准驾车型" allowClear>
              {
                perdritypeList.map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
              }
            </Select>
          },
          {
            key: "course",
            component: <Select placeholder="请选择考试科目" allowClear>
              {
                courseList.filter(item => item.name!=="科五").map(({value, label}) => {
                  return <Select.Option value={value} key={value}>{label}</Select.Option>
                })
              }
            </Select>
          },
          {
            key: "examSiteCode",
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请选择考场名称"
              onSearch={handleSearchExam}
              filterOption={handleFilterOption}
              onClear={() => {
                getDict(dispatch, "exsCode")
                dispatch({
                  type: "sign/save",
                  payload: {
                    signSearchForm: {
                      ...signSearchForm,
                      examSiteCode: "",
                    }
                  }
                })
              }}
            >
              {exsCodeList?.map(({value, label}) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>
          },
          {
            key: "time",
            component: <DatePicker.RangePicker
              allowClear placeholder={["签名开始时间", "签名结束时间"]}
            />,
            col: 8
          },
          {
            key: "schCode",
            component: <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请选择驾校名称"
              onSearch={handleSearchSchool}
              filterOption={handleFilterOptionSchool}
              onClear={() => {
                getDict(dispatch, "school")
                dispatch({
                  type: "sign/save",
                  payload: {
                    signSearchForm: {
                      ...signSearchForm,
                      schCode: "",
                    }
                  }
                })
              }}
            >
              {schoolList?.map(({value, label}) => {
                return <Select.Option value={value} key={value}>{label}</Select.Option>
              })
              }
            </Select>,
          }
        ]}
        actions={
          <Space>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: "sign/save",
                  payload: {
                    signSearchForm: STATE.signSearchForm
                  }
                })
                getSignList()
                // setNotPrintFn()
                setSelectedRowKeys([])
                setSelectedRows([])
              }}
            >重置</Button>
            <Button
              type="primary"
              disabled={!Boolean(selectedRowKeys.length)}
              // onClick={async (checkedList) => {
              onClick={async () => {
                const checkedList = []
                selectedRows.map((item) => {
                  checkedList.push({serialNum:item.serialNum, subject: item.subject, examResultId: item.examResultId})
                })
                const urls = await getUrl(checkedList)
                const ids = selectedRows.map(item => item.examResultId)
                setIds([...ids])
                if (urls && urls.length > 0) {
                  setOneOrMore('more')
                  setPrintUrl(urls)
                  // setCheckedListLength(checkedList.length)
                  setPrintVisible(true)
                } else {
                  openNotification({message: "您选中的成绩单不存在，无法打印"}, "error")
                }
              }}
            >
              {/* <img style={{ margin: 0 }} src={!Boolean(selectedRowKeys.length) ? require("@/assets/svg/icon-download2.svg") : require("@/assets/svg/icon-download.svg")} alt="" /> */}
              <img style={{ margin: 0 }} src={!Boolean(selectedRowKeys.length) ? download2 : download} alt="" />
              批量打印
            </Button>
            {/* <DownloadButton onClick={async (checkedList) => {
              const urls = await getUrl(checkedList)
              const ids = checkedList.map(item => item.examResultId)
              setIds([...ids])
              if (urls && urls.length > 0) {
                setOneOrMore('more')
                setPrintUrl(urls)
                setCheckedListLength(checkedList.length)
                setPrintVisible(true)
              } else {
                openNotification({message: "您选中的成绩单不存在，无法打印"}, "error")
              }
            }}>批量打印
            </DownloadButton> */}
          </Space>
        }
        handleSearch={(e) => {
          let data = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "time",
                startTime: "beginTime",
                endTime: "endTime"
              }
            ]
          })
          data.examSiteCode = e["examSiteCode"]?.value
          data.schCode = e["schCode"]?.value
          dispatch({
            type: "sign/save",
            payload: {
              signSearchForm: {
                ...signSearchForm,
                pageNum: 1, ...data,
                stuInfo: (e as any).stuInfo,
                businessType: (e as any).businessType,
                perdritype: (e as any).perdritype,
                course: (e as any).course,
                examSiteCode: (e as any).examSiteCode,
                beginTime: data.beginTime,
                endTime: data.endTime,
              }
            }
          })
          getSignList()
        }}
      >
      </SearchForm>
    )
  }

  const PointCount = ({text}) => {
    if (text <= 0) {
      return <span style={{padding: "2px 4px", color: "#FF4949", background: "#FBEAE6"}}>未打印</span>
    } else {
      return <span style={{padding: "2px 4px", color: "#07C160", background: "#E9F8F1"}}>已打印{text}次</span>
    }
  }

  //table表头
  const columns: ColumnsType<any> = [
    // {
    //   title: () => {
    //     return <div style={{display: 'flex'}}>
    //         <CheckedAllButton list={signList} itemName={['serialNum', 'subject', 'examResultId']}/>
    //     </div>
    //   },
    //   width: 200,
    //   render: (text, record, index) => {
    //     return <>
    //       <CheckedButton
    //         value={{serialNum: record?.serialNum, subject: record?.subject, examResultId: record?.examResultId}}
    //         matchName="examResultId"
    //       />
    //       <span>{(signSearchForm.pageNum - 1) * signSearchForm.pageSize + index + 1}</span>
    //     </>
    //   }
    // },
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(signSearchForm.pageNum - 1) * signSearchForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "打印次数",
      dataIndex: "pointCount",
      width: 120,
      render: text => <PointCount text={text}/>
    },
    {
      title: "流水号",
      dataIndex: "serialNum",
      width: 160
    },
    {
      title: "考生姓名",
      dataIndex: "name",
      width: 80
    },
    {
      title: "身份证号码",
      dataIndex: "idcard",
      width: 160
    },
    {
      title: "所属驾校",
      dataIndex: "schName",
      width: 180
    },
    {
      title: "业务类型",
      dataIndex: "businessType",
      width: 100
    },
    {
      title: "准驾车型",
      dataIndex: "perdritype",
      width: 100
    },
    {
      title: "考试科目",
      dataIndex: "subject",
      width: 100,
      render: (text) => getCourseType(text)
    },
    {
      title: "考试成绩",
      dataIndex: "score",
      width: 100
    },
    {
      title: "签名时间",
      dataIndex: "signTime",
      width: 180
    },
    {
      title: "考场",
      dataIndex: "examSiteName",
      width: 180
    },
    {
      title: "操作",
      width: 180,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space>
            <Button type="link" onClick={async () => {
              setVisible(true)
              const url = await getUrl([{serialNum: record.serialNum, subject: record.subject}])
              setCurrentInfo({...record, url: url[0]})
            }}>查看详情</Button>
            <Button
              type="link"
              onClick={async () => {
                const url = await getUrl([{serialNum: record.serialNum, subject: record.subject}])
                setOneOrMore('one')
                setPrintUrl(url)
                setIds([record.examResultId])
                setPrintVisible(true)
              }}
            >
              打印
            </Button>
            <Button
              type="link"
              onClick={() => {
                Confirm({
                  title: '您确认删除？',
                  cancelText: '取消',
                  okText: '确认',
                  onOk: async () => {
                    const result: any = await deleteTranscriptApi({
                      tranId: record.examResultId,
                      serialNum: record.serialNum
                    })
                    if (result.code === 0) {
                      message.success('删除成功')
                      getSignList()
                      return
                    }
                    message.warning('删除失败')
                  }
                })
              }}
            >
              删除
            </Button>
          </Space>
        )
      }
    },
  ]
  const PrintFooter = <div style={{position: "relative"}}>
    {oneOrMore === 'more'
      && <span style={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)"
      }}>
        {/* 选中{checkedListLength}份
        {checkedListLength - printUrl.length > 0 && "，" + (checkedListLength - printUrl.length) + "份异常无法打印"} */}
        选中{selectedRows.length}份
        {selectedRows.length - printUrl.length > 0 && "，" + (selectedRows.length - printUrl.length) + "份异常无法打印"}
    </span>}

    <ReactToPrint
      trigger={() => <Button type="primary">打印</Button>}
      content={() => printRef.current}
      onAfterPrint={async () => {
        setSelectedRowKeys([])
        setSelectedRows([])
        const res = await recordPrintCountApi({
          ids
        })
        if (res.code !== 0) {
          message.error(res.msg)
          return
        }
        await getSignList()
        setPrintUrl([])
        setIds([])
        // setCheckedListLength(0)
        setPrintVisible(false)
      }}
    />
    <Button onClick={() => setPrintVisible(false)}>取消</Button>
  </div>

  const closeInfo = () => {
    setVisible(false)
    setCurrentInfo({})
  }

  const InfoFooter = <div>
    {!currentInfo["url"] && <Button
      type="primary"
      onClick={() => {
        regenerateTranscriptApi({
          serialNum: currentInfo.serialNum,
          course: currentInfo.subject
        }).then(async (res: any) => {
          if(res.code !== 0) {
            message.error(res.msg)
            return
          }
          const url = await getUrl([{serialNum: currentInfo.serialNum, subject: currentInfo.subject}])
          setCurrentInfo({...currentInfo, url: url[0]})
        })
      }}
    >
      重新生成成绩单
    </Button>}
    <Button type="primary" onClick={closeInfo}>确定</Button>
    <Button onClick={closeInfo}>取消</Button>
  </div>

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys changed: ', selectedRows)
    setSelectedRowKeys(newSelectedRowKeys)
    setSelectedRows(selectedRows)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      {
        key: 'notprint',
        text: '选择未打印',
        onSelect: changableRowKeys => {
          let newSelectedRowKeys = [];
          let notPrintIds = []
          const rows = signList.filter((item, index) => {
              return item.pointCount === 0
          })
          rows.map((item) => {
            notPrintIds.push(item.examResultId)
          });
          // console.log(notPrintIds, 'notPrintIdsnotPrintIds')
          newSelectedRowKeys = changableRowKeys.filter((item, index) => {
            // if (index % 2 !== 0) {
            //   return false;
            // }
            // return true;
            // console.log(signList, 'iddidddd')
            return notPrintIds.includes(item)
          })
          // console.log(rows, 'rowsrows')
          setSelectedRowKeys(newSelectedRowKeys)
          setSelectedRows(rows)

        },
      }
    ],
  }

  return (
    <WhiteCard>
      {visible && <Modal
        visible={visible}
        centered closable
        onCancel={closeInfo}
        footer={InfoFooter}
      >
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <Images style={{margin: '0 auto'}} src={currentInfo?.url}/>
        </div>
      </Modal>}
      {
        printVisible &&
        <Modal
          visible={printVisible}
          closable={false}
          centered={true}
          onCancel={() => {
            setOneOrMore('')
            setPrintUrl([])
            // setCheckedListLength(0)
            setPrintVisible(false)
          }}
          footer={PrintFooter}
        >
          <div className="modal-box">
            <div ref={printRef}>
              {
                printUrl?.map((item, index) => <Images key={index} style={{margin: '0 auto'}} src={item}/>)
              }
            </div>
          </div>
        </Modal>}
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(signSearchForm)
        }}
        rowSelection={rowSelection}
        showTitle={false}
        dataSource={signList}
        columns={columns}
        search={searchForm()}
        rowKey="examResultId"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({sign, global}) => ({
  signList: sign.signList,
  signSearchForm: sign.signSearchForm,
  courseList: global.courseList,
  perdritypeList: global.perdritypeList,
  bizTypeList: global.bizTypeList,
  exsCodeList: global.exsCodeList,
  schoolList: global.schoolList
}))(SignManagement)


