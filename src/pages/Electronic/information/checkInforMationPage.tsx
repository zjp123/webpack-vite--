import React, {useEffect, useState} from "react"
import {Button, Col, Form, Row, Tabs, Card, Divider, message} from "antd"
import {connect} from "dva"
import {getInformationInfo, upDateformation, electronicList} from "@/api/electronic"
import {TableView, WhiteCard, InfoCard, Steps, Images} from "@/components"
import {goto, deleteObjectEmptyKey, getPagation, downloadFile, downloadFileJpg} from "@/utils"
import {STATUS_TYPE} from "@/utils/constants"
import CuInforMatoneModal from "./cuInforMatoneModal"
import IndoemrionModal from "./indoemrionModal"
import {getDict, getDynamicProtocolDomain} from "@/utils/publicFunc"
import "./index.less"
import { useHistory, useLocation } from 'react-router-dom'

const Comparison = (props) => {
  const {
    dispatch,
    match,
    isCuInformationModalVisible,
    isCoachModalVisible,
    searchLackFormationForm,
    searchAppoiNtmentForm,
    searchCompAredForm,
    searchBusinessLogForm,
    compAredList,
    fileDomainUrl,
  } = props
  const {appoiNtmentList, lackFormationList, businessLogList, userInfo, currentStep, stageList} = props
  const [form] = Form.useForm()
  const [btnTit, setBtnTit] = useState("编辑基本信息")
  const [disable, setDisableg] = useState(true)
  const [imgsrcInfo, setImgsrcInfo] = useState({})
  const [tabsKey, setTabsKey] = useState("CompAred")
  const {TabPane} = Tabs
  const [loading, setLoading] = useState(true)
  const {id: serialNum, stage, studentId, fileNum, personId} = match.params
  const [fileList, setFileList] = useState([])
  const history = useHistory()

  useEffect(() => {
    getInfo()
    getSteps()
    dispatch({
      type: "global/getFileDomain"
    })
    getDict(dispatch, "bizType", {})
    return function cleanup() {
      dispatch({
        type: 'recording/save',
        payload: {
          userInfo: {},
          currentStep: []
        }
      })
    }
  }, [])
  const getInfo = async () => {
    //获取详情
    await dispatch({
      type: 'information/loadStudentInfo',
      payload: {studentId}
    })

    electronicList({
      studentId
    }).then((res) => {
      setFileList(res.data)
    })
  }
  const getSteps = () => {
    dispatch({
      type: 'global/loadStageList',
      payload: {
        studentId,
        stage
      }
    })
  }
  const callback = async key => {
    await setTabsKey(key)
    setLoading(true)
    await getData(key)
    setLoading(false)
  }

  const getData = key => {
    let payload: any
    if (key === "AppoiNtment" || key === "BusinessLog") {
      payload = {
        serialNum,
      }
    } else {
      payload = {
        studentId
      }
    }
    dispatch({
      type: `information/load${key}List`,
      payload
    })
  }
  // 改变pagation
  const setPagation = ({pageNum, pageSize}: Result.pageInfo) => {
    dispatch({
      type: "information/save",
      payload: {
        [`search${tabsKey}Form`]: {pageNum, pageSize}
      }
    })
    getData(tabsKey)

  }
  const tableViewRender = (columns, list, searchForm, notPage = undefined) => {

    return (
      <TableView
        showTitle={false}
        dataSource={list}
        columns={columns}
        rowKey="id"
        hasPagination={false}
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchForm)
        }}
      />
    )
  }
  // 档案清单
  const list = [
    {
      title: "选择"
    },
    {
      title: '序号'
    },
    {
      title: '档案名称'
    },
    {
      title: '生成时间'
    },
    {
      title: '档案异常'
    },
    {
      title: '操作'
    }
  ]
  // 欠费信息
  const owe = [
    {
      title: "序号",
      render: (text, record, index) => {
        return <span>{(searchCompAredForm.pageNum - 1) * searchCompAredForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "考试科目",
      dataIndex: "course"
    },
    {
      title: "考试时间",
      dataIndex: "checkTime"
    },
    {
      title: "欠费次数",
      dataIndex: "arrearsNum"
    },
    {
      title: "欠费金额",
      dataIndex: "amount"
    }
  ]
  // 预约信息
  const booking = [
    {
      title: "序号",
      dataIndex: "name",
      render: (text, record, index) => {
        return <span>{(searchCompAredForm.pageNum - 1) * searchCompAredForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "考试科目",
      dataIndex: "examSubject"
    },
    {
      title: "预约时间",
      dataIndex: "appointmentDate"
    },
    {
      title: "预约考场",
      dataIndex: "examSite"
    },
    {
      title: "考试时间",
      dataIndex: "appointmentExamDate"
    }
  ]
  //人像对比信息
  const likeThan = [
    {
      title: "序号",
      dataIndex: "name",
      with: "30",
      render: (text, record, index) => {
        return <span>{(searchCompAredForm.pageNum - 1) * searchCompAredForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "流水号",
      dataIndex: "serialNum"
    },
    {
      title: "考场",
      dataIndex: "examSite"
    },
    {
      title: "科目",
      dataIndex: "course"
    },
    {
      title: "自动对比",
      dataIndex: "autoResult",
      render: text => {
        const ITEM = STATUS_TYPE.find(({value}) => value === text)
        if (!ITEM) {
          return "通过"
        }
        return <span style={{color: ITEM.color}}>{ITEM.compareResult}</span>
      }
    },
    {
      title: "人工对比",
      dataIndex: "manualResult",
      render: text => {
        const ITEM = STATUS_TYPE.find(({value}) => value === text)
        if (!ITEM) {
          return "通过"
        }
        return <span style={{color: ITEM.color}}>{ITEM.compareResult}</span>
      }
    },
    {
      title: "操作",
      dataIndex: "bizType",
      render: (text, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              dispatch({
                type: "information/save",
                payload: {
                  isCuInformationModalVisible: true
                }
              })
            }}
          >
            查看
          </Button>
        )
      }
    }
  ]
  // 业务日志
  const businessLog = [
    {
      title: "序号",
      with: "30",
      render: (text, record, index) => {
        return <span>{(searchBusinessLogForm.pageNum - 1) * searchBusinessLogForm.pageSize + index + 1}</span>
      }
    },
    {
      title: "业务岗位",
      dataIndex: "businessPost"
    },
    {
      title: "经办人",
      dataIndex: "manager"
    },
    {
      title: "业务办理部门",
      dataIndex: "businessHandlingDept"
    },
    {
      title: "处理时间",
      dataIndex: "processingDate",
    },
    {
      title: "备注",
      dataIndex: "remark",
    }
  ]
  const informaTion = [
    {
      title: '考生姓名',
      dataIndex: 'name'
    },
    {
      title: '身份证号码',
      dataIndex: 'idcard'
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      render: text => text && text.split(" ")[0]
    },
    {
      title: '国籍',
      dataIndex: 'nationality',
    },
    {
      title: '邮政编码',
      dataIndex: 'contactPostcode',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone'
    },
    {
      title: '移动电话',
      dataIndex: 'mobilePhone'
    },
    {
      title: '登记住所行政区划',
      dataIndex: 'registerResidence',
    },
    {
      title: '业务类型',
      dataIndex: 'businessTypeName',
    },
    {
      title: '驾驶人来源',
      dataIndex: 'source',
    },
    {
      title: '登记住所详细地址',
      dataIndex: 'registerAddress'
    },
    {
      title: '准驾车型',
      dataIndex: 'perdritype',
    },
    {
      title: '所属驾校',
      dataIndex: 'schName',
    },
    {
      title: '联系住所行政区划',
      dataIndex: 'contactResidence',

    },
    {
      title: '报名时间',
      dataIndex: 'registrationTime',
    },
    {
      title: '有效日期',
      dataIndex: 'expirationDate',
    },
    {
      title: '联系住所详细地址',
      dataIndex: 'contactAddress',

    },
    {
      title: '电子邮箱',
      dataIndex: 'eMail',
    },
    {
      title: '居住证编号',
      dataIndex: 'residencePermit',
    },
    {
      title: '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
    },
  ];

  // const flag = props.location.search && props.location.search.split('=')[1] < 2 ? false : true
  return (
    // <Card>
    <WhiteCard>
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Row style={{display: "flex", justifyContent: "space-between"}} align="middle">
          <Col span={24} style={{display: "flex", margin: "10px 0", padding: "0 12px", justifyContent: "space-between"}}>
            <h3>
              <span>档案编号:{fileNum} </span>
              <span style={{marginLeft: "20px"}}>流水号:{serialNum} </span>
              <span style={{color: "red", marginLeft: "20px"}}>总欠费额: {0} 元</span>
            </h3>
            <div>
              <Button size="small" onClick={() =>{
                history.goBack()
              }} type='primary'>返回</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="info-detail" style={{display: "flex", flexWrap: "wrap", width: "100%", padding: "0 12px"}}>
            <div className="p-cuts" />
            <InfoCard style={{width: "100%"}} column={3} columns={informaTion} data={userInfo} />
          </Col>
        </Row>
      </Form>
      <div className="divider" />
      <div style={{margin: "40px 0 0 0"}}>
        <Steps current={currentStep} data={stageList}/>
      </div>
      <div className="divider" style={{marginTop: "24px"}} />
      <h3 style={{margin: "20px 0 0 20px"}}>电子档案</h3>
      <div className="electronic-record-div">
        {
          fileList?.map((item, index) => {
            return (
              <div className="electronic-record-info">
                {
                  item.archivesTypeName && <div className="logo">
                    {item?.archivesTypeName}
                  </div>
                }
                {
                  item.archivesPdfPhoto ? (
                    <div className='electronic-main'>
                      <Images height={93} src={item.archivesPdfPhoto} />
                      {/*<img*/}
                      {/*  onClick={() => {*/}
                      {/*    setImgsrcInfo({...item, student: form.getFieldValue("name")})*/}
                      {/*    dispatch({*/}
                      {/*      type: "information/save",*/}
                      {/*      payload: {*/}
                      {/*        isCuInformationModalVisible: true*/}
                      {/*      }*/}
                      {/*    })*/}
                      {/*  }}*/}
                      {/*  src={getDynamicProtocolDomain(fileDomainUrl) + item.archivesPdfPhoto} alt=""/>*/}
                    </div>
                  ) : (
                    <div className='electronic-main-null'>
                      <img src={require("@/assets/img/electron/3.png")} alt=""/>
                    </div>
                  )
                }
                <div className="electronic-footer">
                  {
                    item.archivesStatus === "缺失" ? (
                      // <img
                      //   style={{cursor: "pointer"}}
                      //   onClick={() => {
                      //     goto.push("/electronic/information/checkToviewPage/" + serialNum + "/" + item.archivesType + "/" + studentId + "/" + personId)
                      //   }}
                      //   src={require(`@/assets/img/electron/1.png`)} alt=""></img>
                      <img src={require(`@/assets/img/electron/qs.svg`)} alt="" />
                    ) : item.archivesStatus === "异常" ? (
                      <img
                        // style={{cursor: "pointer"}}
                        // onClick={() => {
                        //   goto.push("/electronic/information/checkToviewPage/" + serialNum + "/" + item.archivesType + "/" + studentId + "/" + personId)
                        // }}
                        src={require(`@/assets/img/electron/2.png`)} alt=""></img>
                    ) : item.archivesPdfPhoto ? (
                      <>
                        <span
                          onClick={() => {
                            if (loading) {
                              setLoading(false)
                              message.success("正在下载，请稍后!")
                              const filename = `${userInfo ? userInfo["name"] : ""}-${item?.archivesTypeName}`
                              // const filename = `${userInfo ? userInfo["name"] : ""}-${item?.archivesTypeName}`
                              downloadFileJpg("/file/downloadArchives/release", {
                                filename: filename,
                                // "url": item.archivesUrl // archivesPdfPhoto
                                "url": item.archivesPdfPhoto // archivesPdfPhoto
                              }, {
                                // url: item?.archivesUrl
                                url: item?.archivesPdfPhoto
                              }).then(() => {
                                setLoading(true)
                                message.success("下载完成!")
                              })
                            }
                          }}
                        ><img src={require("@/assets/img/electron/xiazai.png")} alt=""/></span>
                        <div className='border'>|</div>
                        <span
                          onClick={() => {
                            setImgsrcInfo({...item, student: form.getFieldValue("name")})
                            dispatch({
                              type: "information/save",
                              payload: {
                                isCuInformationModalVisible: true
                              }
                            })
                          }}
                        ><img src={require("@/assets/img/electron/quanping.png")} alt=""/></span>
                      </>
                    ) : (
                      <img src={require(`@/assets/img/electron/zanwu.png`)} alt=""></img>
                    )
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      <Tabs style={{marginLeft: "15px"}} defaultActiveKey="Electronic" onChange={callback} type="card">
        {/*<TabPane tab="人像比对信息" key="CompAred">*/}
        {/*  {tableViewRender(likeThan, compAredList, searchCompAredForm)}*/}
        {/*</TabPane>*/}
        {/*<TabPane tab="预约信息" key="AppoiNtment">*/}
        {/*  {tableViewRender(booking, appoiNtmentList, searchAppoiNtmentForm)}*/}
        {/*</TabPane>*/}
        {/*<TabPane tab="欠费信息" key="LackFormation">*/}
        {/*  {tableViewRender(owe, lackFormationList, searchLackFormationForm)}*/}
        {/*</TabPane>*/}
        <TabPane tab="业务日志" key="BusinessLog">
          {tableViewRender(businessLog, businessLogList, searchBusinessLogForm)}
        </TabPane>
      </Tabs>
      {isCuInformationModalVisible && <CuInforMatoneModal infoCardInfo={userInfo} imgsrcInfo={imgsrcInfo}/>}
      {isCoachModalVisible && <IndoemrionModal personId={personId} info={userInfo}/>}
    </WhiteCard>
  )
}
export default connect(({information, global}) => ({
  isCuInformationModalVisible: information.isCuInformationModalVisible,
  isCoachModalVisible: information.isCoachModalVisible,
  searchAppoiNtmentForm: information.searchAppoiNtmentForm,
  searchCompAredForm: information.searchCompAredForm,
  searchLackFormationForm: information.searchLackFormationForm,
  searchElectronicForm: information.searchElectronicForm,
  searchBusinessLogForm: information.searchBusinessLogForm,
  electronicList: information.electronicList,
  businessLogList: information.businessLogList,
  userInfo: information.userInfo,
  currentStep: global.currentStep,
  stageList: global.stageList,
  compAredList: information.compAredList,
  appoiNtmentList: information.appoiNtmentList,
  lackFormationList: information.lackFormationList,
  bizTypeList: global.bizTypeList,
  fileDomainUrl: global.fileDomainUrl
}))(Comparison)
