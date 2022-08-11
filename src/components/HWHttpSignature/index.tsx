/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-13 18:02:52
 * @description: 汉王签字版 http 本地服务调用版
 */
import React, { FC, useEffect } from "react"
import $ from "jquery"
import { Button, Space, Tooltip } from "antd"
import { openNotification } from "@/components/OpenNotification"
import { store } from "@/store"
import './index.less'

const { storeData = {} } = store.getState()
const { fileDomainUrl } = storeData

interface Props {
  initialImmediately?: boolean, // 是否立即初始化
  getSignedResult: Function, // 获取签字结果
  getSignedUrl?: Function, // 获取签字url
  width?: number,
  height?: number,
  prompt?: string, // 用户自定义底部提示文字
  delay?: number, // 签字窗口延迟打开
  defaultImg?: string, // 默认有没有签字图
}

const openData = {
  nLogo: "签字完成后请点击确认按钮!", // 对话框 title内容
  nPenwidth: "4", // 笔宽 0-4 整数
  // nOrgX: "200", // 签名窗口弹出时显示在屏幕位置的X坐标值
  // nOrgY: "100", // 签名窗口弹出时显示在屏幕位置的Y坐标值
  width: "500", // 签字区域宽度  默认 600
  height: "300", // 签字区域高度 默认 400
  fingerFap: "0", // 指纹   0：只签字   1:  签字加指（若设备有指纹模块）  2： 只指纹（若设备有指纹模块）
  key: "4A05564228DF2C64AF2E137B71A4E7A3"
}

const tooltipTitle = `签字板打不开?
  1. 请尝试多点我几次,强制关闭签字版.
  2. 请尝试开启重启!
`

// 汉王签字板组件
const HWHttpSignature: FC<Props> = (props) => {
  const {
    initialImmediately = false,
    width = 400,
    height = 300,
    prompt,
    getSignedResult,
    delay = 0,
    defaultImg = "" // 如果之前有签名, 是否显示
  } = props
  let timerId // 定时获取签字结果的定时器id

  const signParams = {
    nImageType: "3",    // 生成图片类型  "1" bmp, "2" jpg    "3" png
    // nImageWidth: width,  // 生成图片宽度 默认 0
    nImageWidth: 120,  // 生成图片宽度 默认 0
    // nImageHeight: height, //生成图片高度 默认 0
    nImageHeight: 160 //生成图片高度 默认 0
  }
  const url = "http://127.0.0.1:29999"

  useEffect(() => {
    initialImmediately && initialHWTablet()
  }, [])

  // 1. 初始化签字板
  const initialHWTablet = async () => {
    openNotification({
      message: "正在初始化设备",
      duration: 2.5,
      description: "正在初始化设备,请稍后... ..."
    }, "info", false)
    closeHWTablet() // 初始化设备前, 确保设备关闭
    destroySigningImg()// 清空签字版
    $.ajax({
      type: "get",
      url: `${url}/HWPenSign/HWGetDeviceStatus`,
      dataType: "jsonp",
      success: function(data) {
        setTimeout(() => {
          openHWTablet() // 打开签字版
        }, delay)
      },
      error: function() {
        setTimeout(() => {
          openNotification({
            message: "初始化失败",
            description: "请检查设备是否正确连接... ..."
          }, "error")
        }, 1000)
      }
    })
  }

  // 2. 打开设备
  const openHWTablet = async () => {
    $.ajax({
      type: "get",
      url: `${url}/HWPenSign/HWInitialize`,
      data: openData,
      dataType: "jsonp",
      success: function(data) {
        if (data.msgID === "0") {
          let signedBase64Result
          openNotification({
            message: "初始化成功",
            duration: 2.5,
            description: "设备已经打开, 请开始签字... ..."
          }, "success")
          timerId = setInterval(async () => {
            if (signedBase64Result) { // 如果签字结果返回, 清空定时器
              return clearInterval(timerId)
            } else {
              signedBase64Result = await getSignResult()
            }
          }, 1000) // 定时获取签字结果
        } else {
          openNotification({ message: "对不起,设备开启失败,请手动重新打开设备" }, "warning", false)
        }
      },
      error: function() {
      }
    })
  }

  // 3. 关闭设备
  const closeHWTablet = async () => {
    clearInterval(timerId)
    $.ajax({
      type: "get",
      url: `${url}/HWPenSign/HWFinalize`,
      dataType: "jsonp",
      success: function(data) {
        if (data.msgID === "0") {
          //   设备关闭成功
          destroySigningImg()
        } else {
          // alert(data.message);
        }
      },
      error: function() {
      }
    })
  }

  // 4. 重新签名 // 清除手写设备的输入
  const resigningHWTablet = async () => {
    $.ajax({
      type: "get",
      url: `${url}/HWPenSign/HWClearPenSign`,
      dataType: "jsonp",
      success: function(data) {
        if (data.msgID === "0") {
          destroySigningImg()
          initialHWTablet()
        }
      },
      error: function() {
      }
    })
  }

  // 获取签字结果
  const getSignResult = async () => {
    $.ajax({
      type: "get",
      url: `${url}/HWPenSign/HWGetSign`,
      data: signParams,
      dataType: "jsonp",
      success: function(data) {
        if (data.msgID === "0") {
          clearInterval(timerId)
          createSigningImg(data)
          getSignedResult(data.message)
        } else if (data.msgID === "-15") {

        } else {
          // alert(data.message);
        }
      },
      error: function() {
      }
    })
  }

  // 创建签字图片
  const createSigningImg = (res) => {
    let img = document.createElement("img")
    img.id = "signing_img"
    img.src = res.message
    document.getElementById("img_container") && document.getElementById("img_container").appendChild(img)
  }

  // 清空签字图片
  const destroySigningImg = () => {
    const img = document.getElementById("signing_img")
    img && img.parentNode.removeChild(img)
  }

  return (
    // flexDirection: 主轴纵向排列,  alignItems: 交叉轴居中
    <div
      className="hwhttp_signature_container"
      style={{
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
      {/* 签字图片 */}
      <div id="img_container" className="img_container"
           style={{
             width: `${width}px`,
             height: `${height}px`,
             backgroundColor: "lightcyan"
             // border: "1px dashed #979797",
           }}
      >
        {defaultImg !== "" ?
          <img alt={""} id="signing_img" style={{ width, height }} src={fileDomainUrl + defaultImg}/> : null}
      </div>

      {/* 签字提示 */}
      <div
        className="sign_prompt"
        style={{
          margin: "5px 0",
          fontSize: "20px",
          fontFamily: "微软雅黑",
          fontWeight: 500,
          color: "rgba(255, 125, 0, 0.85)"
        }}
      >
        {prompt ? prompt : "请考生在电子签名板上进行签字确认!"}
      </div>

      {/* 签字按钮 */}
      <div className="sign_btn">
        <Space size="small">
          <Button size="middle" type="primary" onClick={initialHWTablet}>签名</Button>
          {/*<Button size="middle" type="primary" onClick={openHWTablet}>打开设备</Button>*/}
          <Button size="middle" type="primary" onClick={resigningHWTablet}>重新签名</Button>
          {/* <Button size="middle" type="primary" onClick={closeHWTablet}>强制关闭</Button>*/}
          <Tooltip title={tooltipTitle} color="blue">
            <Button type="primary" danger onClick={closeHWTablet}>设备有问题?</Button>
          </Tooltip>
        </Space>
      </div>

      {/* 用户传入的children 内容*/}
      <div style={{ width: width, margin: "5px 0" }}>
        {props.children}
      </div>
    </div>
  )
}
export default HWHttpSignature
