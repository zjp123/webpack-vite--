/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 15:23:04
 * @description: 学员证件照采集
 */

import React, { useEffect, useState } from "react"
import { connect } from "dva"
import Steps from "./Steps"
import { goto } from "@/utils"
import { Images, Camera } from "@/components"
import { getPhotoApi, uploadPhotoApi } from "@/api/student"

import "./index.less"
import { openNotification } from "@/components/OpenNotification"

const Step2 = ({match}) => {

  // 预录入基础信息接口返回 学员id, 用于验证是否有证件照
  const id = match.params.id && parseInt(match.params.id)
  const [photoUrl, setPhotoUrl] = useState()

  useEffect(() => {
    id && getPhoto()
  }, [])

  // 验证六合一是否有证件照
  const getPhoto = () => {
    getPhotoApi({id}).then((res) => {
      if (res?.code === 0) {
        setPhotoUrl(res?.data?.url)
      }
    })
  }


  const handleClick2IDCardInfo = () => {
    // 去医院体检页
    goto.push(`/student/health-input/${id}`)
  }

  const renderImages = () => {
    return <Images width={180} height={240} src={photoUrl}/>
  }
  const renderCamera = () => {
    const onChage = (res) => {
      res && uploadPhotoApi({Id: id, photoUrl: res}).then((res) => {
        if (res?.code === 0) {
          openNotification({message: "照片上传成功"}, "success", false)
        }
      })
    }
    return (<div className="student_photo_camera">
      <Camera onChange={onChage}/>
    </div>)
  }
  return (
    <div className="registration_container" style={{background: "#FFFFFF"}}>
      <div className="student_photo_container">
        { /* 头部进度条*/}
        <Steps currentStep={1}/>
        <div className="student_photo">
          {/* 有证件照 photoUrl: 直接回显, 无证件照: 拍照上传*/}
          {photoUrl ? renderImages() : renderCamera()}
        </div>
      </div>
      <div className="footer_content">
        <div className="footer_btn">
          <div className="footer_btn_left" onClick={() => {
            goto.go(-1)
          }}>
            返回上一步
          </div>
          <div className="footer_btn_right" onClick={handleClick2IDCardInfo}>
            信息确认无误, 下一步
          </div>
        </div>
      </div>
    </div>
  )
}
export default connect(({registration, global}) => {
  return {
    isShowShootIDCard: registration.isShowShootIDCard,
    isShowInputForm: registration.isShowInputForm,
  }
})(Step2)

