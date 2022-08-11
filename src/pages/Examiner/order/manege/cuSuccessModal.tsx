import React, { useState } from "react"
import { Result, Modal } from "antd"
import { connect } from "dva"
import { TableView } from "@/components"
// import { goto } from "@/utils"

const Success = ({ examinationSiteList, dispatch, startId, isShowSuccessModal }) => {
  // const [loading, setLoading] = useState(false)

  // 认证成功 开启考试
  const handleOk = async () => {
    await dispatch({
      type: "manage/save",
      payload: {
        isShowSuccessModal: false,// 关闭成功列表,
        isShowFaceRecognition: false,// 关闭人脸识别框,
        isShowSignature: true // 打开签字页,
      }
    })
    // 确定 去签字
    // goto.push("/examiner/sign")
    // dispatch({
    //   type: "manage/startOrCloseExamination",
    //   payload: {
    //     id: startId,
    //     examStatus: 1 // 开启或结束考试, 1 开启,  0 关闭
    //   }
    // }).then((res) => {
    //   if (res?.code == 0) {
    //     dispatch({
    //       type: "manage/save",
    //       payload: {
    //         isShowSuccessModal: false
    //       }
    //     })
    //     message.success("认证成功, 已经为您成功开启考试!")
    //   }
    // })
  }
  // 认证成功 取消
  const handleCancel = () => {
    dispatch({
      type: "manage/save",
      payload: {
        isShowCurrentContent: true, // 打开列表
        isShowFaceRecognition: false, // 关闭摄像头页
        isShowFailedModal: false,// 关闭输入身份证框
        isShowSuccessModal: false // 关闭认证成功框
      }
    })
  }

  const columns = [
    {
      title: "考场名称",
      width: 20,
      dataIndex: "examSiteName"
    },
    {
      title: "监考时间",
      width: 20,
      dataIndex: "examDate"
    },
    {
      title: "考官姓名",
      dataIndex: "examinerName",
      width: 20
    }
  ]
  return (
    <Modal
      title=''
      visible={isShowSuccessModal}
      width="30%"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Result
        status="success"
        title="认证成功,请确认考场信息"
        extra={[]}
      >
      </Result>
      <TableView
        showTitle={false}
        dataSource={examinationSiteList}
        hasPagination={false}
        columns={columns as any}
        rowKey="id"
      />
    </Modal>

  )
}
export default connect(({ manage }) => {
  return {
    isShowSuccessModal: manage.isShowSuccessModal,
    examinationSiteList: manage.examinationSiteList
  }
})(Success)

