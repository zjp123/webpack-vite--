import React, {useEffect, useMemo, useRef, useState} from "react"
import {connect} from "dva"
import {TableView, SearchForm, WhiteCard, InfoCard} from "@/components"
import {Button, Form, DatePicker, Select, Input, message} from "antd"
import CuInformationModal from "./checkInformationModal"
import {getPagation, goto, formatParameters} from "@/utils"
import {STATE} from "./model"
import {copy, getDict} from "@/utils/publicFunc"
import copyIcon from "@/assets/svg/copy.svg"
import {batchDownload} from "@/api/electronic";
import {DownloadButton, CheckedAllButton, CheckedButton} from "@/components/BatchDownload"
import InformationPage from "@/pages/Electronic/information/InformationPage";
import moment from "moment";

//电子档案管理
const Information = ({
                       dispatch,
                       informationList,
                       searchInformationForm,
                       keepaliveSearchForm,
                       isCuInformationModalVisible,
                       isShowInformation,
                       businessStatusList,
                       bizTypeList,
                       perdritypeList
                     }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id] = useState(0)
  useEffect(() => {
    return function cleanup() {
      dispatch({
        type: 'global/resetBatchDownload'
      })
    }
  })

  const initTime = useMemo(() => {
    return {
      beginTime: moment().add(-1, 'y').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    }
  }, [])

  const setSearchForm = () => {
    if(keepaliveSearchForm) {
      dispatch({
        type: "information/save",
        payload: {
          searchInformationForm: {...keepaliveSearchForm},
          keepaliveSearchForm: null,
        }
      })
    } else {
      dispatch({
        type: "information/save",
        payload: {
          searchInformationForm: {
            ...STATE.searchInformationForm,
            ...initTime
          }
        }
      })
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      startTime: [moment(initTime.beginTime), moment(initTime.endTime)]
    })
    setSearchForm()
    getData();
    ["bizType", "perdritype", "businessStatus", "archivesStatus"].forEach(item =>
      getDict(dispatch, item))
  }, [])
  // 改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "information/save",
      payload: {
        searchInformationForm: {...searchInformationForm, pageNum, pageSize}
      }
    })
    getData()
  }

  const isShowButton = (value: string) => {
    switch (value) {
      case "受理":
      case "复核":
      case "制证":
      case "归档":
        return true;
      default:
        return false;
    }
  }
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "information/loadInformationList"
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
            key: "fileNumOrSerialNum",
            col: 8,
            component: <Input maxLength={18} placeholder="档案编号/身份证明号码/姓名" key="fileNum"/>
          },
          {
            key: "businessStatus",
            component: (
              <Select placeholder="请选择业务状态" allowClear>
                {businessStatusList.map(({value, label}) => {
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
            key: "businessType",
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
            key: "startTime",
            col: 8,
            component: <DatePicker.RangePicker allowClear placeholder={["开始时间", "结束时间"]}/>
          },
          {
            key: "perdritype",
            component: (
              <Select placeholder="请选择准驾车型" allowClear>
                {perdritypeList.map(({value, label}) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {value}
                    </Select.Option>
                  )
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
                  type: "information/save",
                  payload: {
                    searchInformationForm: STATE.searchInformationForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <Button onClick={() => {
              form.validateFields().then((res) => {
                let fileNumOrSerialNum
                if (res.fileNumOrSerialNum) {
                  fileNumOrSerialNum = res.fileNumOrSerialNum.trim()
                } else {
                  message.error("请输入档案编号/身份证明号码/姓名")
                  return
                }
                dispatch({
                  type: "information/generateStuArchives",
                  payload: {
                    fileNumOrSerialNum
                  }
                })
              })
            }} type='primary'>同步学员档案</Button>
            <DownloadButton downloadApi={batchDownload} paramsName='idList'
                            params={{idType: "personId"}}>档案下载</DownloadButton>
          </>
        }
        handleSearch={e => {
          let data = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: "startTime",
                startTime: "beginTime",
                endTime: "endTime"
              }
            ]
          })
          dispatch({
            type: "information/save",
            payload: {
              searchInformationForm: {
                ...searchInformationForm,
                pageNum: 1, ...data,
                informationName: (e as any).informationName,
                schName: (e as any).schName,
                fileNumOrSerialNum: (e as any).fileNumOrSerialNum
              }
            }
          })
          getData()
        }}
      />
    )
  }
  const customElement = () => <>
    信息列表:共查询到 <span style={{color: "#006EFF"}}>{searchInformationForm.totalRows}</span> 条信息
  </>
  const columns = [
    {
      title: () => <CheckedAllButton list={informationList} itemName='personId'/>,
      width: 80,
      render: (text, record, index) => {
        return <>
          <CheckedButton value={record?.personId}/>
          <span>
            {(searchInformationForm.pageNum - 1) * searchInformationForm.pageSize + index + 1}
          </span>
        </>
      }
    },
    {
      title: "学员姓名",
      dataIndex: "name",
      render: text => {
        return <span>{text}<img style={{cursor: 'pointer'}} onClick={() => copy(text)} src={copyIcon} alt=""/></span>
      }
    },
    {
      title: "身份证明号码",
      dataIndex: "encryptedId",
      width: 180,
      render: (text, record) => {
        return <span>{text}<img style={{cursor: 'pointer'}} onClick={() => copy(record.idcard)} src={copyIcon} alt=""/></span>
      }
    },
    {
      title: "档案编号",
      width: 130,
      dataIndex: "fileNum"
    },
    {
      title: "当前业务类型",
      dataIndex: "businessTypeNow",
      // width: 100
    },
    {
      title: "准驾车型",
      dataIndex: "perdritypeNow",
      // width: 100
    },
    {
      title: "业务状态",
      dataIndex: "businessStatusNow",
    },
    {
      title: "下一业务状态",
      dataIndex: "nextBusinessStatus",
      render: text => <span>{text || '-'}</span>
    },
    {
      title: "档案创建时间",
      dataIndex: "createdTime",
    },
    {
      title: "操作",
      width: 220,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            {
              isShowButton(record?.nextBusinessStatus) && <Button
                type="link"
                onClick={() => {
                  window.open('http://10.56.83.126:8008/view/frm/html/index.html')
                }}
              >
                {record?.nextBusinessStatus}
              </Button>
            }
            <Button
              type='link'
              onClick={() => {
                goto.push("/electronic/information/informationPage/"
                  + (record.personId || ' ') + "/"
                  + (record.fileNum || '-'))
                dispatch({
                  type: "information/save",
                  payload: {
                    keepaliveSearchForm: searchInformationForm
                  }
                })
                // dispatch({
                //   type: 'information/save', payload: {
                //     isShowInformation: true,
                //     params: {
                //       personId: record.personId,
                //       serialNum: record.serialNum,
                //       stage: record.stage,
                //       studentId: record.studentId,
                //       fileNum: record.fileNum
                //     }
                //   }
                // })
              }}
            >
              查看详情
            </Button>
            <Button
              type="link"
              onClick={() => {
                batchDownload({idList: [record.personId], idType: "personId"})
              }}
            >
              下载
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard>
      {!isShowInformation && <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchInformationForm)
        }}
        showTitle={false}
        dataSource={informationList}
        columns={columns as any}
        customElement={customElement()}
        search={searchForm()}
        rowKey="id"
        getSelection={getSelection}
        loading={loading}
      />}
      {isCuInformationModalVisible && <CuInformationModal informationId={id}/>}
      {isShowInformation && <InformationPage/>}
    </WhiteCard>
  )
}
export default connect(({information, global}) => ({
  informationList: information.informationList,
  searchInformationForm: information.searchInformationForm,
  isCuInformationModalVisible: information.isCuInformationModalVisible,
  isShowInformation: information.isShowInformation,
  keepaliveSearchForm: information.keepaliveSearchForm,
  bizTypeList: global.bizTypeList,
  perdritypeList: global.perdritypeList,
  businessStatusList: global.businessStatusList,
  archivesStatusList: global.archivesStatusList
}))(Information)
