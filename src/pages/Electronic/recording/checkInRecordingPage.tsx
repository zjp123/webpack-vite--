import React, {useEffect, useState} from 'react'
import {Button, Col, Form, Row, Input, Card, Select, message, Divider} from 'antd'
import {connect} from 'dva';
import {getInfoCollectionInfo, upDateformation, electronicList} from '@/api/electronic'
import {Dsteps, InfoCard} from '@/components'
import {goto, deleteObjectEmptyKey, downloadFile} from '@/utils'
import IndoemrionModal from "./indoemrionModal"
import {informaTion} from '../information/columns'
import './style.less'
import CuRecordingModal from "@/pages/Electronic/recording/cuRecordingModal";
import {getDynamicProtocolDomain} from "@/utils/publicFunc";
import {ELECTRONIC_ARCHIVE_MANAGE_STEPS} from "@/utils/constants"

const FORMITEM_LAYOUT_NOWRAP = {}
const Comparison = ({
                      dispatch,
                      match,
                      isCoachModalVisible,
                      isCheckRecordingModalVisible,
                      fileDomainUrl,
                      userInfo,
                      currentStep,
                      stageList
                    }) => {
  const [form] = Form.useForm()
  const [btnTit, setBtnTit] = useState('编辑基本信息')
  const [data, setData] = useState({})
  const [disable, setDisableg] = useState(true)
  const [fileList, setFileList] = useState([])
  const {id: serialNum, stage, studentId, fileNum, personId, stageCode} = match.params
  const totalAmount = match.params.totalAmount
  const [loading, setLoading] = useState(true)
  const stageInfoTit = ['报名', '科目一考试', '科目二考试', '科目三道路考试', '科目三理论考试', '已领证']
  const [infoCardInfo, setInfoCardInfo] = useState({})
  const dstepsArray = stageInfoTit.map((item, index) => {
    return {
      title: item
    }
  })
  const [imgsrcInfo, setImgsrcInfo] = useState({})
  useEffect(() => {
    getInfo()
    getSteps()
    dispatch({
      type: 'global/getFileDomain'
    })

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
      type: 'recording/loadStudentInfo',
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
  const dealForm = (item: string, value: string | number) => {
    if (item === "sex") {
      let sexs = ["男", "女"]
      return sexs[value]
    }
    return value
  }

  return (
    <Card>
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Row style={{display: "flex", justifyContent: "space-between"}} align="middle">
          <Col span={24} style={{display: "flex", margin: "10px", justifyContent: "space-between"}}>
            <h3>
              <span>档案编号:{fileNum} </span>
              <span>流水号:{serialNum} </span>
              <span style={{color: "red", marginLeft: '20px'}}>总欠费额: {totalAmount ?? 0} 元</span>
            </h3>
            <div>
              <Button
                size="small"
                style={{margin: "4px"}}
                onClick={() => {
                  setDisableg(!disable)
                  setBtnTit(!disable ? "编辑基本信息" : "编辑基本信息")
                  dispatch({
                    type: "recording/save",
                    payload: {
                      isCoachModalVisible: true
                    }
                  })
                  if (!disable) {
                    form.validateFields().then(e => {
                      let postData = {
                        ...userInfo,
                        ...deleteObjectEmptyKey(e)
                      }
                      delete postData.studentInfoStatus
                    })
                  }
                }}
                type="primary"
                className="mar-l-4"
              >
                {btnTit}
              </Button>
              <Button size="small" onClick={() => {
                goto.push('/electronic/recording')
              }}>返回</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="info-detail" style={{width: "100%"}}>
            <InfoCard style={{width: '100%'}} columns={informaTion} data={userInfo} />
          </Col>
        </Row>
      </Form>
      <Divider style={{
        borderTop: '4px solid #f8f8f8',
        margin: '10px 0'
      }}/>
      <div style={{margin: "50px 0 0 20px"}}>
        <Dsteps current={currentStep} data={stageList}/>
      </div>
      <Divider style={{
        borderTop: '4px solid #f8f8f8',
        margin: '10px 0'
      }}/>
      <h3>档案清单</h3>
      <div className="electronic-record-div">
        {
          fileList.map((item, index) => {
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
                      <img
                        onClick={() => {
                          setImgsrcInfo({...item, student: form.getFieldValue("name")})
                          dispatch({
                            type: "recording/save",
                            payload: {
                              isCheckRecordingModalVisible: true
                            }
                          })
                        }}
                        src={getDynamicProtocolDomain(fileDomainUrl) + item.archivesPdfPhoto} alt=""/>
                    </div>
                  ) : (
                    <div className='electronic-main-null'>
                      <img src={require('@/assets/img/electron/3.png')} alt=""/>
                    </div>
                  )
                }
                <div className="electronic-footer">
                  {
                    item.archivesStatus === "缺失" ? (
                      <img
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          goto.push("/electronic/recording/checkToviewPage/" + serialNum + "/" + item.archivesType + "/" + studentId + "/" + personId)
                        }}
                        src={require(`@/assets/img/electron/1.png`)} alt=""></img>
                    ) : item.archivesStatus === "异常" ? (
                      <img
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          goto.push("/electronic/recording/checkToviewPage/" + serialNum + "/" + item.archivesType + "/" + studentId + "/" + personId)
                        }}
                        src={require(`@/assets/img/electron/2.png`)} alt=""></img>
                    ) : item.archivesPdfPhoto ? (
                      <>
                        <span
                          onClick={() => {
                            if (loading) {
                              setLoading(false)
                              message.success('正在下载，请稍后!')
                              const filename = `${data ? data["name"] : ""}-${item?.archivesTypeName}`
                              downloadFile("/file/downloadArchives/release", {
                                filename: `${filename}- ${Math.random().toString().slice(2)}`,
                                "url": item.archivesUrl
                              }, {url: item?.archivesUrl}).then(() => {
                                setLoading(true)
                                message.success('下载完成！')
                              })
                            }
                          }}
                        ><img src={require('@/assets/img/electron/xiazai.png')} alt=""/></span>
                        <div className='border'>|</div>
                        <span
                          onClick={() => {
                            setImgsrcInfo({...item, student: form.getFieldValue("name")})
                            dispatch({
                              type: "recording/save",
                              payload: {
                                isCheckRecordingModalVisible: true
                              }
                            })
                          }}
                        ><img src={require('@/assets/img/electron/quanping.png')} alt=""/></span>
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
      {isCheckRecordingModalVisible && <CuRecordingModal data={userInfo} imgsrcInfo={imgsrcInfo}/>}
      {isCoachModalVisible && <IndoemrionModal info={userInfo} personId={personId}/>}
    </Card>
  )
}
export default connect(({recording, global}) => ({
  isCoachModalVisible: recording.isCoachModalVisible,
  isCheckRecordingModalVisible: recording.isCheckRecordingModalVisible,
  userInfo: recording.userInfo,
  fileDomainUrl: global.fileDomainUrl,
  currentStep: global.currentStep,
  stageList: global.stageList,
}))(Comparison)


