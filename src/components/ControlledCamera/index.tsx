/**
 * 可控相机组件
 */
import { message, Spin } from 'antd'
import React, { useEffect, useImperativeHandle,Fragment, useState } from 'react'
import './style.less'
import { uploadImgBase64 } from '@/api/common'
import { FaceMask} from "@/components"
import useMergeValue from 'use-merge-value'
import { openNotification } from "@/components/OpenNotification"

interface CameraProps {
  value?: string
  onChange?: (value?: string) => void
  width?: number
  height?: number
  btnHandle?: string
  setBtnHandle?: Function
  ref?: any
}

let cameraDomObj = {
  thisVideo: null,
  thisContext: null,
  thisCancas: null,
  base64ImgSrc: ''
}

// 可控相机组件
const ControlledCamera = (props: { value?: any; onChange?: any; postState?: any; getBase64Result?: any; children?: any; width?: any; height?: any; renderIndex?: any }, ref: React.Ref<unknown> | undefined) => {
  /**
   * videoWidth: 相机开启宽度
   * videoHeight 相机开启高度
   */
  const { width, width: videoWidth, height, height: videoHeight,renderIndex=1} = props
  const [isOpening] = useState(true) // 是否开启摄像头 默认开启
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useMergeValue<any>(props.value, {
    // value: props.value,
    value: props.value,
    onChange: props.onChange,
    postState:props.postState
  })
  useEffect(() => {
    // 打开摄像头权限
    invokeCameraMedia()
    return () => {
      // 关闭摄像头
      stopNavigator()
    }
  }, [])

  // 向父组件暴露的方法
  const invokeSonMethod = () => {
    // console.log('%c父组件调换用到了子组件的方法了 =====', 'color:red')
  }

  // 1. 调用摄像头权限
  const invokeCameraMedia = () => {
    // 调用摄像头权限
    if (isOpening) {
      cameraDomObj.thisCancas = document.getElementById('canvasCamera')
      cameraDomObj.thisVideo = document.getElementById('videoCamera')
      cameraDomObj.thisContext = cameraDomObj.thisCancas.getContext('2d')
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        ;(navigator.mediaDevices as any) = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          let getUserMedia = (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia || (navigator as any).getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      // 相机宽高
      const constraints = {
        audio: false,
        video: { width: width, height: height, transform: 'scaleX(-1)' }
      }
      setLoading(true)
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          setLoading(false)
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in cameraDomObj.thisVideo) {
            cameraDomObj.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            cameraDomObj.thisVideo.src = window.URL.createObjectURL(stream as any)
          }
          cameraDomObj.thisVideo.onloadedmetadata = function(e) {
            cameraDomObj.thisVideo.play()
          }
        })
        .catch(err => {
          setLoading(false)
          message.error('没有开启摄像头权限或浏览器版本不兼容(需要切换https)')
        })
    } else {
      stopNavigator()
    }
  }

  //2. 开启拍照 base64转成文件后上传
  // 捕捉照片
  const capturePicture = () => {
    console.log('---->开始拍照')
    if (loading) {
      return
    }
    drawImage()
    if (!cameraDomObj.base64ImgSrc) {
      message.error('请重新拍照！')
      return
    }

    // 1. 如果 getBase64Result 存在,证明想要 base64的结果, 直接返回图片base64结果
    if (props?.getBase64Result){
      openNotification({message:"拍照成功"},"success")
      props?.getBase64Result(cameraDomObj.base64ImgSrc)
    }

    // 2. 上传保存 base64图片, 传回 url 结果
    if (props?.onChange){
      uploadImgBase64({ imgBase64: cameraDomObj.base64ImgSrc })
        .then(result => {
          setValue(result.data.uri)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }

  // 关闭摄像头
  const stopNavigator = () => {
    if (cameraDomObj.thisVideo && cameraDomObj.thisVideo !== null) {
      cameraDomObj?.thisVideo?.srcObject?.getTracks()[0].stop()
    }
  }

  // 重置画布
  const resetCanvas = () => {
    (this as any).base64ImgSrc = '' as any
    (this as any).clearCanvas('canvasCamera')
  }

  //绘制图片
  const drawImage = () => {
    // 点击，canvas画图
    cameraDomObj.thisContext.drawImage(cameraDomObj.thisVideo, 0, 0, videoWidth, videoHeight)
    // 获取图片base64链接
    cameraDomObj.base64ImgSrc = cameraDomObj.thisCancas.toDataURL('image/png').replace('data:image/png;base64,', '')
  }

  // 向父组件暴露方法
  useImperativeHandle(ref, () => {
    return {
      invokeSonMethod: invokeSonMethod,
      capturePicture: capturePicture
    }
  })

  // 根据 renderIndex 渲染对应结果
  const renderByRenderIndex = ()=>{
    if (renderIndex===1){
      return (   <div className="camera_focus">
        {props?.children}
      </div>)
    } if (renderIndex===2){
      return (<div style={{width:width}} className="sub_button">
        <div className="upload_pic">本地上传</div>
        <div className="shoting_pic" onClick={()=>{
          capturePicture()
        }}>拍 照</div>
      </div>)
    }
  }
  return (
    <div style={{}} className="controlled_camera_container">
      <div className="camera_outer">
        <Spin spinning={loading} tip="正在打开摄像头,请稍后... ...">
          <div style={{ margin: '0 auto', width: `${width}px`, height: `${height}px` }}>
            <div style={{position:"relative"}}>
              <video id="videoCamera" width={`${width}px`} height={height} autoPlay></video>
              <canvas id="canvasCamera" style={{ display: "none" }} width={width} height={height}></canvas>
              {/*<div className="inner_bottom_text">*/}
              {/*  <span>未查询到您的考试预约信息</span>*/}
              {/*</div>*/}
            </div>
          </div>
        </Spin>
      </div>
      <Fragment>
        {renderByRenderIndex()}
      </Fragment>
    </div>
  )
}

export default ControlledCamera
