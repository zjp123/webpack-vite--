import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { HWOptimizedSignature, Images } from '@/components'
import './physic.less'
import {Button} from "antd"
import GoBackSvg from "@/assets/svg/go_back.svg"
import PhysicalReport from "@/assets/svg/physical_report.svg"
import { goto } from '@/utils'
import { getExamineePhysicalReportApi, savePhysicalSigningApi } from "@/api/student"
import { openNotification } from "@/components/OpenNotification"

/**
 * 展示体检单,并且确认签字
 * @param match
 * @constructor
 */
const MedicalExaminationReport = ({ match }) => {
  const id = match?.params?.id // 学员id
  const [reportUrl,setReportUrl]=useState<any>()
  const [signPhoto,setSignPhoto]=useState<any>()
  const [signSuccess,setSignSuccess]=useState<any>(false)

  useEffect(() => {
    getExamineePhysicalReport()
  }, [])

  // 获取考生体检单图
  const getExamineePhysicalReport=()=>{
    getExamineePhysicalReportApi({id}).then((res)=>{
      if (res?.code===0){
        setReportUrl(res?.data?.url)
      }
    })
  }

  // 获取签字的 url
  const getSignedUrl = (signPhoto)=>{
    setSignPhoto(signPhoto)
  }

  // 确认签字, 更新一次成绩单
  const handleSigningClick = ()=>{
    savePhysicalSigningApi({id,signPhoto}).then((res)=>{
      if (res?.code===0){
        openNotification({message:"签字成功"},"success")
        setSignSuccess(true)
        // 签字成功, 更新成绩单
        getExamineePhysicalReportApi({id}).then((res)=>{
          if (res?.code===0){
            setReportUrl(res?.data?.url)
          }
        })
      }
    }).catch((err)=>{
      openNotification({message:err?.msg},"error")
    })
  }

  const handleCommitAndToNextStep = ()=>{
     // if (!signSuccess){
     //   openNotification({message:"请先确认签字"},"info")
     //   return
     // }
    goto.push(goto.push('/student/physical/successfulPage'))
  }

  return (
    <div className="medical_examination_report_container">
      {/* 左侧体检单详情 */}
      <div className="left_examination_report">
        <div className="report_top_title">
          <div
            className="go_back"
            onClick={() => {
              goto.go(-1)
            }}
          >
            <img src={GoBackSvg}/>
            <span>返回</span>
          </div>
          <div className="divider_horizontal"></div>
        </div>
        <div className="report_bottom_pic">
          <div className="real_report_pic">
            {reportUrl
              ?   <Images src={reportUrl} enlarge={true} width="100%" height="90%"/>
              :   <div style={{width:"100%", height:"100%"}}><img width="100%" height="100%" src={PhysicalReport}/></div>}
          </div>
        </div>
      </div>
      {/* 右侧申请人签字 */}
      <div className="right_applicant_signing">
        <div className="signing_top_title">
          <div className="signing_title_text">申请人签字确认</div>
          <div className="divider_horizontal"></div>
        </div>
        <div className="signing_container">
          <HWOptimizedSignature initialImmediately={false} getSignedUrl={getSignedUrl}>
            <div className="confirm_btn" onClick={handleSigningClick}> 确 认 </div>
          </HWOptimizedSignature>
        </div>
        <div className="bottom_btn_container">
          {signSuccess
            ?  <div
            className="confirm_and_next_step"
            onClick={handleCommitAndToNextStep}
          >
            <span>信息确认无误, 提交</span>
          </div>
            : <div
            className="confirm_and_next_step"
            style={{backgroundColor:"#f5f5f5",cursor:"default"}}
          >
            <span style={{color:"#b8b8b8",}}>信息确认无误, 提交</span>
          </div>}
        </div>
      </div>
    </div>
  )
}
export default connect(({ physical }) => ({}))(MedicalExaminationReport)
