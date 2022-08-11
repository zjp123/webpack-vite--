/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 16:49:12
 * @description: 考生预录入信息 报名信息采集
 */

import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { HighBeatMeter } from "@/components"
import { goto } from "@/utils"
import Steps from "./Steps"
import { Card } from "antd"
import "./index.less"
import { getIDCardInfoByUrlApi } from "@/api/student"
import { openNotification } from "@/components/OpenNotification"
import { setSessionItem } from "@/utils/publicFunc"

const Registration = ({}) => {

  const [idUrl, setIdUrl] = useState([])
  useEffect(() => {

  }, [])

  // 1. 识别身份证 下一步
  const handle2IDCardInfo = () => {
    let dataArr = idUrl?.map((item, index) => {
      return {
        url: item,
        type: index,
      }
    })
    dataArr = [
      {"url": "/file/4faaa3d012734c298cf6a6df528f2d14.png", "type": 0},
      {"url": "/file/0a0f9387fc1d4d5f8dcac508ef3c00c2.png", "type": 1}]
    openNotification({message: "上传成功,正在识别身份信息"}, "info")
    getIDCardInfoByUrlApi({files: dataArr}).then((res) => {
      if (res?.code === 0) {
        openNotification({message: "身份证识别成功"}, "success")
        goto.push("/student/info")
        setSessionItem("registration/idCardUrlArr", dataArr)
        setSessionItem("registration/idIdentificationInfo", res?.data)
      }
    })
  }

  return (
    <div className="registration_container" style={{background: "#FFFFFF"}}>
      {/* 1. 第一步 学员身份证照片采集 */}
      <Steps/>

      <Card title="拍摄身份证照片">
        <div style={{backgroundColor: "gray", width: "fit-content", margin: "0 auto"}}>
          <HighBeatMeter
            imgNumPage={2}
            getResult={(idUrl) => {
              setIdUrl(idUrl)
            }}/>
        </div>
      </Card>
      <div className="footer_content">
        <div className="footer_btn">
          <div className="footer_btn_right" onClick={handle2IDCardInfo}>
            照片采集完成, 下一步
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
    global,
  }
})(Registration)
