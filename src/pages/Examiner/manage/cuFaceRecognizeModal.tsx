import React, { Fragment, useEffect } from "react"
import { Modal, message } from "antd"
import { connect } from "dva"
import "./index.less"
import FaceMask from "@/assets/img/face-recognize-mask.png"
import { FACE_BASE64_URL } from "@/utils/constants"

const Manage = (props) => {
  const {dispatch, isShowFaceRecognition, startId} = props
  useEffect(() => {
    // console.log("考试id examId --->>", startId)
    // startViceCamera()
  }, [])

  const handleCancel = () => {
    // console.log("点击返回 -->>")
    dispatch({
      type: "manage/save",
      payload: {
        isShowFaceRecognition: false,
      },
    })
  }

  // 校验密码
  const handleInputPwd = () => {
    // 拍照一张 对比拍照
    dispatch({
      type: "manage/checkFace",
      payload: {
        examId: startId,
        photo: FACE_BASE64_URL,
        isLastTime: 1,
      },
    }).then((res) => {
      if (res?.code == 0) {
        message.success("照片比对成功.")
        dispatch({
          type: "manage/save",
          payload: {
            signId: res?.data?.signId,
          },
        })
      }
    })

    // 输入密码弹框
    dispatch({
      type: "manage/save",
      payload: {
        isShowFaceRecognition: false,
        isShowFailedModal: true,
        startOrCloseData: {
          id: startId,
          examStatus: 1,
          startType: 1,
        },
      },
    })
  }

  // modal content
  const renderModalContent = () => {
    return <Fragment>
      <div className="face_recognize_container" style={{textAlign: "center"}}>
        <img style={{display: "inline-block"}} src={FaceMask} alt=""/>
        <p className="face_recognize_desc">请正对摄像头,确保采集照片面部清晰,</p>
        <p className="face_recognize_desc">摄像头完成抓拍采集, 完成拍照</p>
        <span className="face_recognize_pwd" onClick={handleInputPwd}> 拍照并输入密码解锁  </span>
      </div>
    </Fragment>
  }
  return (
    <Modal
      title=''
      visible={isShowFaceRecognition}
      width="60%"
      footer={null}
      onOk={() => {
      }}
      onCancel={handleCancel}
    >
      {/* <Button type="link" onClick={handleCancel}>返回</Button> */}
      {/*{renderModalContent()}*/}
      {/* <HighBeatMeter imgNumPage={1} isfaceRecognition={true} id={startId} getResult={(data) => {
        console.log("人脸对比结果--->>", data)
        if (data?.result == 1) { // 人脸对比成功 => 认证成功页
          message.success({ content: "拍照成功,正在上传数据库比对照片,请稍后... ...", duration: 2 })
          setSignId(data?.signId)
          dispatch({
            type: "manage/save",
            payload: {
              signId: data?.signId
            }
          })
          dispatch({
            type: "manage/save",
            payload: {
              isShowFaceRecognition: false,
              isShowFailedModal: false,
              isShowSuccessModal: true,
              startOrCloseData: {
                id: startId,
                examStatus: 1,
                startType: 1
              }
            }
          })
        } else if (data?.result == 0) { // 人脸对比失败 弹窗密码框
          dispatch({
            type: "manage/save",
            payload: {
              isShowFaceRecognition: false,
              isShowFailedModal: true,
              isShowSuccessModal: false,
              signId: data?.signId,
              startOrCloseData: {
                id: startId,
                examStatus: 1,
                startType: 1
              }
            }
          })
        }
      }}/> */}
    </Modal>
  )
}

export default connect(({manage}) => ({
  isShowFaceRecognition: manage.isShowFaceRecognition,
}))(Manage)
