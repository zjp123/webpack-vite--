/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2022-3-17 14:44:52
 * @description: 汉王签字版 http 本地服务调用版
 */
import React, { FC, useEffect, useState } from 'react'
import $ from 'jquery'
import { openNotification } from '@/components/OpenNotification'
import { store } from '@/store'
import './index.less'
import { uploadImgBase64 } from "@/api/common"

interface Props {
  outerWidth?:string, // 签字版最外层容器宽度
  initialImmediately?: boolean // 是否立即初始化
  getSignedBase64Result?: Function // 获取签字返回的base64结果
  getSignedUrl?: Function // 获取签字url
  styleIndex?: number // 根据风格索引,渲染不同的底部
  width?: number // 真实回显的 图片的宽
  height?: number // 真实回显的 图片的高
  prompt?: string // 用户自定义底部提示文字
  delay?: number // 签字窗口延迟打开
  defaultImg?: string // 默认有没有签字图
}

const openData = {
  nLogo: '签字完成后请点击确认按钮!', // 对话框 title内容ini
  nPenwidth: '3', // 笔宽 0-4 整数
  // nOrgX: "200", // 签名窗口弹出时显示在屏幕位置的X坐标值 默认在窗口中间
  // nOrgY: "100", // 签名窗口弹出时显示在屏幕位置的Y坐标值 默认在窗口中间
  width: '500', // 签字区域宽度  默认 600
  height: '300', // 签字区域高度 默认 400
  fingerFap: '0', // 指纹   0：只签字   1:  签字加指（若设备有指纹模块）  2： 只指纹（若设备有指纹模块）
  key: '4A05564228DF2C64AF2E137B71A4E7A3'
}

let timerId // 定时获取签字结果的定时器id
const url = 'http://127.0.0.1:29999'

/**
 * @param props
 * @param initialImmediately: 是否立即初始化签字版
 * @param width: 签完字回显的 图片 宽
 * @param height: 签完字回显的 图片 高
 * @param :
 * @param delay: 初始化社保延迟时间
 * @constructor
 */
const HWSignature: FC<Props> = props => {
  const {
    initialImmediately = true,
    outerWidth=460, width = 300, height = 200, getSignedUrl, getSignedBase64Result, delay = 0, styleIndex = 1,
    defaultImg = '' // 如果之前有签名, 是否显示
  } = props

  const { storeData = {} } = store.getState()
  const { fileDomainUrl } = storeData
  const [initStatus, setInitStatus] = useState(false)

  const signParams = {
    nImageType: '3', // 生成图片类型  "1" bmp, "2" jpg    "3" png
    // nImageWidth: width,  // 生成图片宽度 默认 0
    nImageWidth: 120, // 生成图片宽度 默认 0
    // nImageHeight: height, //生成图片高度 默认 0
    nImageHeight: 160 //生成图片高度 默认 0
  }
  const [tooltip,setTooltip] = useState({cursor:"default",color:"#69cb00",text:"签字版准备就绪"})

  useEffect(() => {
    initialImmediately && initialHWTablet()
    // return ()=>{
    //   closeHWTablet()
    // }
  }, [])

  const successOrFail = (result: 'success' | 'fail') => {
    if(result === 'success') {
      openNotification(
        {message: '初始化设备成功', duration: 2.5, description: '初始化设备成功'},
        'success',
        false)
      setTooltip({cursor:"default",color:"#69cb00",text:"签字版准备就绪"})
    } else {
      openNotification({message: '初始化失败', description: '请检查设备是否正确连接... ...'}, 'error')
      setTooltip({cursor:"pointer",color:"red",text:"签字版异常, 点击连接设备"})
    }
  }

  // 1. 初始化签字板
  const initialHWTablet = async () => {
    openNotification(
      {message: '正在初始化设备', duration: 2.5, description: '正在初始化设备,请稍后... ...'},
      'info',
      false
    )
    closeHWTablet() // 初始化设备前, 确保设备关闭
    destroySigningImg() // 清空签字版
    $.ajax({
      type: 'get',
      url: `${url}/HWPenSign/HWGetDeviceStatus`,
      dataType: 'jsonp',
      success: function(data) {
        console.log(data)
        data.msgID === '0' ? successOrFail('success') : successOrFail('fail')
      },
      error: function() {
        setTimeout(() => {
         successOrFail('fail')
        }, 1000)
      }
    })
  }

  // 2. 打开设备
  const openHWTablet = async () => {
    $.ajax({
      type: 'get',
      url: `${url}/HWPenSign/HWInitialize`,
      data: openData,
      dataType: 'jsonp',
      success: function(data) {
        console.log('openHWTablet', data)
        if (data.msgID === '0') {
          let signedBase64Result
          successOrFail('success')
          timerId = setInterval(async () => {
            if (signedBase64Result) {
              // 如果签字结果返回, 清空定时器
              return clearInterval(timerId)
            } else {
              signedBase64Result = await getSignResult()
            }
          }, 1000) // 定时获取签字结果
        } else {
          successOrFail('fail')
        }
      },
      error: function() {}
    })
  }

  // 3. 关闭设备
  const closeHWTablet = async () => {
    clearInterval(timerId)
    $.ajax({
      type: 'get',
      url: `${url}/HWPenSign/HWFinalize`,
      dataType: 'jsonp',
      success: function(data) {
        if (data.msgID === '0') {
          //   设备关闭成功
          destroySigningImg()
        } else {
          // alert(data.message);
        }
      },
      error: function() {}
    })
  }

  // 4. 重新签名 // 清除手写设备的输入
  const resigningHWTablet = async () => {
    $.ajax({
      type: 'get',
      url: `${url}/HWPenSign/HWClearPenSign`,
      dataType: 'jsonp',
      success: function(data) {
        if (data.msgID === '0') {
          destroySigningImg()
          openHWTablet()
        }
      },
      error: function() {
        setTimeout(() => {
          successOrFail('fail')
        }, 1000)
      }
    })
  }

  // 获取签字结果
  const getSignResult = async () => {
    $.ajax({
      type: 'get',
      url: `${url}/HWPenSign/HWGetSign`,
      data: signParams,
      dataType: 'jsonp',
      success: function(data) {
        if (data.msgID === '0') {
          clearInterval(timerId)
          createSigningImg(data)
          getSignedBase64Result?.(data.message)
          // 上传签字结果, 抛出 url
          if (data?.message){
            uploadImgBase64({ imgBase64: data.message })
              .then(result => {
                if (result?.code===0){
                  getSignedUrl?.(result?.data?.uri)
                }
              })
              .catch(() => {
              })
          }
        } else if (data.msgID === '-15') {
        } else {
          // alert(data.message);
        }
      },
      error: function() {}
    })
  }

  // 签字完成 创建签字图片
  const createSigningImg = res => {
    let img = document.createElement('img')
    img.id = 'signing_img'
    img.src = res.message
    document.getElementById('img_container') && document.getElementById('img_container').appendChild(img)
  }

  // 点击重签, 清空签字图片
  const destroySigningImg = () => {
    const img = document.getElementById('signing_img')
    img && img.parentNode.removeChild(img)
  }


  // 根据 style风格类型,渲染不同的底部逻辑
  const renderByStyleIndex = () => {
    if (styleIndex === 1) {
      return (
        <div className="signature_bottom_submit" >
          <div className="sign_btn" onClick={openHWTablet}>签 名</div>
          <div className="resign_btn" onClick={resigningHWTablet}>重 签</div>
          {props?.children}
        </div>
      )
    }
  }

  return (
    <div style={{
      width:`${outerWidth}px`,
      border:"1px solid #006eff"
    }} className="hw_optimized_signature_container">
      <div style={{cursor:tooltip?.cursor}} className="signature_top_tooltip" onClick={resigningHWTablet}>
        <span style={{backgroundColor:tooltip?.color}} className="tooltip_icon"></span>
        <span style={{color:tooltip?.color}} className="tooltip_text">{tooltip?.text}</span>
      </div>
      {/* 签字容器 */}
      <div className="signature_middle_img_container">
        <div id="img_container"  className="img_result_container"
             style={{width:`${width+10}px`,height:`${height+10}px`}}
        >
          {defaultImg !== "" ?
            <img alt="" id="signing_img" src={fileDomainUrl + defaultImg}/> : null}
        </div>
      </div>
      <div className="signature_bottom_container">
        { renderByStyleIndex()}
      </div>
    </div>
  )
}
export default HWSignature
