import React, {useEffect, useState} from 'react'
import {connect} from 'dva';
import {HWHttpSignature} from '@/components'
import {Card,} from 'antd'
import ResetPwd from "./resetPwd"
import './index.less'
import {getDoctorDetailApi, saveDoctorInfoApi, uploadBase64Api} from "@/api/common"
import {openNotification} from "@/components/OpenNotification"

interface IDoctor {
  doctorName: string,
  hospitalName: string,
  phonenumber: string,
  electronicSign: string,
  userId: number
}

const AccountInfo = ({match}) => {
  const userId = match?.params?.userid
  const [doctorDetail, setDoctorDetail] = useState<IDoctor>()
  const [signatureResult, setSignatureResult] = useState(doctorDetail?.electronicSign)
  const [isShowResetPwd, setIsShowResetPwd] = useState<boolean>(false)

  useEffect(() => {
    getDoctorDetail()
  }, [])

  // 获取医生信息
  const getDoctorDetail = () => {
    getDoctorDetailApi({userId}).then((res) => {
      setDoctorDetail(res?.data)
    })
  }

  // 保存签名
  const handleSaveSignature = () => {
    const data = {
      ...doctorDetail,
      electronicSign: signatureResult,
    }
    saveDoctorInfoApi(data).then((res) => {
      if (res?.code === 0) {
        openNotification({message: "更新签名成功"}, "success", false)
      }
    })
  }

  // 修改密码
  const handleResetPwd = () => {
    setIsShowResetPwd(true)
  }

  const onCancel = async () => {
    setIsShowResetPwd(false)
  }
  return (
    <div className="account_container">
      <Card>
        <div className="account_title">账号信息</div>
      </Card>
      <Card>
        <HWHttpSignature
          prompt="更新完签名后请点击 保存签名!" width={528} height={140} initialImmediately={false}
          defaultImg={doctorDetail?.electronicSign}
          getSignedResult={(imgBase64) => {
            uploadBase64Api({imgBase64}).then((res) => {
              res && setSignatureResult(res?.data?.uri)
            })
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
              textAlign: "center",
            }}
            onClick={handleSaveSignature}
          >
            保存签名
          </div>
          <div className="signature_children"
               style={{display: "flex", alignItems: "flex-start", flexDirection: "column"}}>
            <div>姓名: {doctorDetail?.doctorName}</div>
            <div>医院: {doctorDetail?.hospitalName}</div>
            <div>手机: {doctorDetail?.phonenumber}</div>
            <div>密码: <span className="reset_pwd_btn" onClick={handleResetPwd}> 修改密码 </span></div>
          </div>
        </HWHttpSignature>
      </Card>
      {isShowResetPwd && <ResetPwd
        userName={doctorDetail?.doctorName}
        userId={doctorDetail?.userId} isCuresetPasswordlVisible={isShowResetPwd}
        onCancel={onCancel}/>}
    </div>
  )
}
export default connect(({account}) => ({}))(AccountInfo)


