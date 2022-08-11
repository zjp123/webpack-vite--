import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { WhiteCard, IDCardReader, Images, CameraAutomatic, HWHttpSignature } from "@/components"
import "./index.less"
import FaceMask from "@/assets/img/id_read.png"
import CuAddIDNo from "./cuAddIDNo"
import {Col, message, Row, Modal, Input} from "antd"
import { openNotification } from "@/components/OpenNotification"
import replacementPic from "@/components/Replacement"
import QZWC from "@/assets/svg/qzwc.svg"
import useTimeout from "@/utils/useTimeout";

// 上一次读取到的身份证号
let lastCertNumber = undefined

/**
 * 考生签名管理
 */
const SignManagement = ({
                          dispatch,
                          isShowResignContent,
                          isShowScoreReport,
                          isShowWriting,
                          isShowResigningDrawer,
                          isShowPlaceholderImg,
                          scoreReport,
                          isShowQZWC,
                          idCard
                        }) => {
  // 拍照结果 url
  const [sitePhotoPic, setSitePhotoPic] = useState("")
  // 签字结果
  const [signPic, setSignPic] = useState("")

  useEffect(() => {
    return () => {
      dispatch({
        type: "resign/save",
        payload: {
          isShowResignContent: true, // 关闭读身份证页
          isShowPlaceholderImg: false, // 打开占位图
          isShowScoreReport: false
        }
      })
    }
  }, [])

  // 获取读取的身份证信息
  const getReadResult = (res) => {
    if (res) {
      let certNumber = res?.data?.certNumber
      // 身份证号存在, 上一次结果和本次结果不相等 => 验证是否还有未签名成绩单
      if (certNumber && (lastCertNumber !== certNumber)) {
        lastCertNumber = certNumber
        openNotification({ message: "正在查询成绩单,请稍后" }, "info", false)
        hasUnsignedReport(certNumber)
      } else {
      }
    }
  }
  // 1. 根据身份证号 验证是否还有未签字成绩单
  const hasUnsignedReport = (idCard) => {
    dispatch({
      type: "resign/hasUnsignedReport",
      payload: {
        idCard
      }
    }).then((res) => {
      console.log(res)
      if (res?.isHas === 0) { // 1. 没有未签名成绩单
        setTimeout(() => {
          openNotification({ message: "查询成功", duration: 4, description: "您好, 您暂时没有未签名成绩单!" }, "success", false)
        }, 2000)
        dispatch({
          type: "resign/save",
          payload: {
            isShowWriting: false,
            isShowResignContent: true, // 默认显示读身份证页面
            isShowScoreReport: false, // 默认显示读身份证页面
            isShowPlaceholderImg: false, //默认显示占位图
            isShowResigningDrawer: false
          }
        })
      } else {
        // 2. 仍有未签字成绩单 获取一张成绩单
        dispatch({
          type: "resign/save",
          payload: {
            isShowResignContent: false, // 关闭读身份证页
            isShowPlaceholderImg: true // 打开占位图
          }
        })
        dispatch({
          type: "resign/loadUnsignScoreReport",
          payload: {
            idCard
          }
        }).then((res) => {
          dispatch({
            type: "resign/save",
            payload: {
              scoreReport: res?.data,
              isShowPlaceholderImg: false, // 关闭占位图
              isShowScoreReport: true // 打开成绩单页
            }
          })
        })
      }
    })
  }

  // 1. 默认读取身份证页面C
  const renderResignContent = () => {
    return <div className="resign_content">
      <div className="card_monitor">
        {replacementPic(FaceMask, <img src={FaceMask} style={{ width: "297px", height: "210px" }}/>, {})}
        <div>请将学员身份证放于读卡器上, 系统将自动识别学员信息.</div>
        <div> 或 <span className="manual_write" onClick={() => {
          dispatch({
            type: "resign/save",
            payload: {
              isShowWriting: true
            }
          })
        }}> 手动输入 </span>身份证号
        </div>
      </div>
    </div>
  }

  // 展示占位图
  const renderPlaceholderImg = () => {
    return <div className="placeholder-div">
      <img className='placeholder-img' src={require("@/assets/img/report-img.png")} alt=""/>
    </div>
  }

  // 3. 确认成绩 去签字
  const handleConfirmScore = () => {
    dispatch({
      type: "resign/save",
      payload: {
        isShowResignContent: false,
        isShowScoreReport: false,
        isShowResigningDrawer: true
      }
    })
    // setBtnType("")
  }

  // 4.完成最终签字  => 5. 查看是否还有未签名成绩单
  const handleCompleteSign = () => {
    dispatch({
      type: "resign/finishedSign",
      payload: {
        transcriptId: scoreReport?.id,
        sitePhotoPic,
        signPic
      }
    }).then(async (res) => {
      if (res?.code === 0) {
        dispatch({
          type: "resign/save",
          payload: {
            isShowWriting: false,
            isShowResignContent: false, // 默认显示读身份证页面
            isShowScoreReport: false, // 默认显示读身份证页面
            isShowPlaceholderImg: false, //默认显示占位图
            isShowResigningDrawer: false,
            isShowQZWC: true,
            idCard: "读取到的身份证号"
          }
        })
      }
    })
  }

  const QZWCRender = () => {
    useTimeout(() => {
      hasUnsignedReport(idCard)
      dispatch({
        type: "resign/save",
        payload: {
          isShowWriting: false,
          isShowResignContent: true, // 默认显示读身份证页面
          isShowScoreReport: false, // 默认显示读身份证页面
          isShowPlaceholderImg: false, //默认显示占位图
          isShowResigningDrawer: false,
          isShowQZWC: false,
          idCard: ""
        }
      })
    }, 3000)

    return (
      <img style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%) translateY(-50%)'
      }} src={QZWC} alt=""/>
    )
  }


  //  成绩单页
  const renderScoreReport = () => {
    return <div className="pdf_container">
      <div
        style={{ width: "500px", margin: " 0 auto", textAlign: "center", height: "600px" }}>
        <Images width={500} height={600} style={{ height: "500px" }}
                src={scoreReport?.url} alt=""/>
      </div>

      {<div className="pdf_btn_sign" onClick={handleConfirmScore}>
        <span>确认成绩</span>
      </div>}
    </div>
  }

  // 成绩单签字画板页
  const renderSigningScore = () => {
    return (
      <Row>
        <Col span={14}>
          <div
            style={{ width: "500px", margin: " 0 auto", textAlign: "center", height: "600px" }}>
            <Images width={500} height={600} style={{ height: "500px" }} src={scoreReport?.url} alt=""/>
          </div>
        </Col>

        <Col span={10}>
          <div className="examiner_signing_container">
            <div className="examiner_signing_content">
              <div className="examiner_pic">
                {/* 拍照 */}
                <CameraAutomatic onChange={(res) => {
                  if (res) {
                    setSitePhotoPic(res)
                  }
                }}/>
              </div>
              <div className="examiner_sign">
                {/*签字*/}
                <HWHttpSignature prompt=" " width={200} height={150} getSignedResult={(imgBase64) => {
                  if (imgBase64) {
                    setSignPic(imgBase64)
                  }
                }}>
                  <div style={{ marginTop: "15px" }} className="examiner_desc">
                    请考生在电子版上签字确认
                    <div className="examiner_sign_btn" onClick={handleCompleteSign}>
                      确 定
                    </div>
                  </div>
                </HWHttpSignature>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
  return (
    <WhiteCard isPaved={false} className="resign_container">
      {/* 1. 默认读身份证页面 */}
      {isShowResignContent && renderResignContent()}

      {/*展示占位图*/}
      {isShowPlaceholderImg && renderPlaceholderImg()}

      {/* 2. 成绩单页 */}
      {isShowScoreReport && renderScoreReport()}

      {/* 3. 打开签字页面 */}
      {isShowResigningDrawer && renderSigningScore()}
      {/*读取身份证信息组件*/}
      {isShowWriting && <CuAddIDNo/>}
      {/* 4. 是否展示签字完成 */}
      {isShowQZWC && <QZWCRender />}
      <IDCardReader initConnect={true} getReadResult={getReadResult}>
      </IDCardReader>
    </WhiteCard>
  )
}

export default connect(({ resign }) => ({
  isShowWriting: resign.isShowWriting,
  unSigned: resign.unSigned,
  isShowResignContent: resign.isShowResignContent,
  isShowScoreReport: resign.isShowScoreReport,
  scoreReport: resign.scoreReport,
  isShowResigningDrawer: resign.isShowResigningDrawer,
  isShowPlaceholderImg: resign.isShowPlaceholderImg,
  isShowQZWC: resign.isShowQZWC,
  idCard:　resign.idCard
}))(SignManagement)

