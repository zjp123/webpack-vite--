import React, { Fragment, useEffect, useState } from "react"
import { connect } from "dva"
import { WhiteCard, FaceRecognition, HWHttpSignature } from "@/components"
import { Col, Form, Input, message, Modal, Row } from "antd"
import { goto } from "@/utils"
import { FORMITEM_LAYOUT } from "@/utils/constants"
import SuccessModal from "./cuSuccessModal"
import "./index.less"
import {signCompared} from "@/api/common";

const { Item } = Form

const Manage = ({ match, dispatch, isShowFailedModal, isShowSuccessModal, isShowFaceRecognition, isShowSignature, searchmanageForm }) => {
  const [form] = Form.useForm()
  const id = match?.params?.id

  // 人脸认证成功后返回的 signId
  const [signId, setSignId] = useState()
  // 签完字的 signPic 图片
  const [signPic, setSignPic] = useState("")
  // 考试开启方式
  const [startType, setStartType] = useState(0)

  useEffect(() => {
    return () => {
      dispatch({
        type: "manage/save",
        payload: {
          isShowFaceRecognition: true, // 是否显示人脸识别框
          isShowSignature: false, // 是否显示签字框
          isShowFailedModal: false, // 是否显示认证失败对话框
          isShowSignModal: false, // 密码验证成功后,显示签名板
          isShowSuccessModal: false // 认证成功对话框
        }
      })
    }
  }, [])

  // 人脸识别拍照
  const renderFaceRecognition = () => {
    // 注意!! 点击输入密码查询的时候, 应该关闭摄像头 认证流程...
    console.log('人脸识别拍照初始化----------->')
    const handleInputPwd = () => {
      dispatch({
        type: "manage/save",
        payload: {
          isShowFaceRecognition: false, // 关闭摄像头页
          isShowFailedModal: true // 打开输入身份证框
        }
      })
    }

    // 通过人脸识别的方式 打开认证成功列表
    const showSuccessModalByFaceRecognition = () => {
      dispatch({
        type: "manage/save",
        payload: {
          isShowSuccessModal: true
        }
      })
    }
    return <Fragment>
      <div className="face_recognize_container" style={{ textAlign: "center" }}>
        {/*<img style={{ display: "inline-block" }} src={FaceMask} alt=""/>*/}
        <div className="face_recognize_camera">
          {/*人脸识别结果 框 */}
          {isShowFaceRecognition && <FaceRecognition takePic isShowCountDown={true} examId={id} onChange={(res) => {
            // res {currectFaceUri: '/file/5a10cac8c0c94ed1983308cfa82aa5e8.jpeg', result: 1, signId: 92}
            // signId 人脸对比结果返回的 id, 作为签字时的 参数
            setSignId(res?.signId)
            setStartType(0) // 考试开启方式 人脸开启
            if (res?.result === 1) { // 人脸认证成功
              showSuccessModalByFaceRecognition()
            } else if (res?.result === 0) { // 人脸认证失败
              dispatch({
                type: "manage/save",
                payload: {
                  isShowFaceRecognition: false, // 关闭摄像头页
                  isShowFailedModal: true // 打开输入身份证框
                }
              })
            }
          }}/>}
          <div className="face_recognize_desc">
            <div className="face_recognize_suggest">请正对摄像头,确保采集照片面部清晰,</div>
            <div className="face_recognize_finish">摄像头完成抓拍采集, 完成拍照</div>
            <span className="face_recognize_pwd" onClick={handleInputPwd}> 拍照并输入密码解锁  </span>
          </div>
        </div>
      </div>
    </Fragment>
  }

  //  签字页
  const renderSignature = () => {

    // 1. 签字保存
    const handleSaveSignature = (res) => {

    }
    // 确认签字 开启考试
    // 确认签字 1. 保存签字 2. 然后开启考试
    const handleConfirmSignature = () => {
      if(!signPic) {
        return message.error("请先签字")
      }

      // id 排期id examStatus : 考试开启状态 1开启，0关闭 // startType 考试开启方式 0人像，1密码  考试状态为 1 时必传
      // 1. 保存签字
      dispatch({ // 考官签字保存
        type: "manage/saveSigned",
        payload: {
          signId, // 人脸识别返回的 id, 必传
          signPic: signPic
        }
      }).then((res) => {
        if (res.code === 0) {
          // 2. 开启考试
          startOrCloseExamination()
        } else {
          message.error(res?.msg)
        }
      })

      const startOrCloseExamination = () => {
        dispatch({
          type: "manage/startOrCloseExamination",
          payload: {
            id, // 当前要开启的考试id
            examStatus: 1,
            startType
          }
        }).then(async (res) => {
          if (res?.code === 0) {// 最终成功开启考试
            message.info(res.msg)
            await dispatch({
              type: "manage/save",
              payload: {
                isShowSignature: false, // 关闭签字页面
              }
            })
            goto.push('/examiner/order')
          }
        })
      }
    }
    return (
      <div className="manage_signature_container">
        <div className="signature_machine">
          <HWHttpSignature
            delay={1500}
            getSignedResult={(res) => {
              res && setSignPic(res) // 签字图片的结果
            }}
          >
            <div
              style={{
                width: "250px",
                height: "40px",
                lineHeight: "40px",
                fontSize: "30px",
                backgroundColor: "green",
                color: "#ffffff",
                margin: "0 auto",
                cursor: "pointer",
                textAlign: "center"
              }}
              onClick={handleConfirmSignature}
            >
              确认签字
            </div>
          </HWHttpSignature>
        </div>
      </div>
    )
  }

  // 人脸认证失败 输入身份证号
  const renderFailedInput = () => {
    // 验证密码确认
    const handleFailedOk = () => {
      form.validateFields().then(async (res) => {
        setStartType(1) // 考试开启方式 密码开启
        dispatch({
          type: "manage/checkPwd",
          payload: {
            ...res,
            examId: id
          }
        }).then((res) => {  // 验证密码成功 查看考试列表
          if (res?.code === 0) {
            dispatch({
              type: "manage/save",
              payload: {
                isShowFailedModal: false,
                isShowSuccessModal: true
              }
            })
          }
        })
      })
    }

    // 取消验证密码
    const handleFailedCancel = async () => {
      // console.log("取消验证密码")
      await dispatch({
        type: "manage/save",
        payload: {
          isShowFaceRecognition: false, // 关闭摄像头页
          isShowFailedModal: false // 关闭输入身份证框
        }
      })
      goto.push('/examiner/order')
    }

    return (
      <Modal
        title=''
        visible={isShowFailedModal}
        destroyOnClose
        width="30%"
        onOk={handleFailedOk}
        onCancel={handleFailedCancel}
      >
        <Fragment>
          <div className="failed_conatiner">
            <div className="i_failed">
              !
            </div>
            <div className="description">
              <p>人脸识别失败,抱歉没有认出您来</p>
              <p>刷脸登录只能由本人操作，您可以尝试输入账号登录密码解锁</p>
            </div>
            <div className="form_container">
              <Form
                layout='horizontal'
                form={form}
                colon={false}
                autoComplete="off"
                initialValues={{}}
              >
                <Row>
                  <Col span={24}>
                    <Item  {...FORMITEM_LAYOUT} name="password" label=""
                           rules={[{ required: true, message: "请输入密码" }]}
                    >
                      <Input style={{ width: "220px" }} type="password" className="form_container_input"
                             placeholder="请输入密码"
                             maxLength={11}/>
                    </Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Fragment>
      </Modal>
    )
  }
  return (
    <WhiteCard>
      <div className="examination_manage_container">
        {/* 1.人脸识别内容区域 */}
        {isShowFaceRecognition && renderFaceRecognition()}

        {/* 2. 认证成功框  */}
        {isShowSuccessModal && <SuccessModal startId={id}/>}

        {/* 3. 认证成功 去签字*/}
        {isShowSignature && renderSignature()}

        {/* 4. 人脸识别失败 输入身份证号*/}
        {isShowFailedModal && renderFailedInput()}
      </div>
    </WhiteCard>
  )
}
export default connect(({ manage }) => ({
  manageList: manage.manageList,
  searchmanageForm: manage.searchmanageForm,
  isShowFaceRecognition: manage.isShowFaceRecognition,
  isShowFailedModal: manage.isShowFailedModal,
  isShowSuccessModal: manage.isShowSuccessModal,
  isShowSignModal: manage.isShowSignModal,
  isShowSignature: manage.isShowSignature
}))(Manage)


