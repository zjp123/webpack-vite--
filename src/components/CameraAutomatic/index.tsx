import { CameraFilled } from "@ant-design/icons"
import { Button, message, Spin } from "antd"
import React, { useEffect, useState } from "react"
import { Images } from "@/components"
import { uploadImgBase64 } from "@/api/common"
import useMergeValue from "use-merge-value"

interface CameraProps {
  value?: string
  onChange?: (value?: string) => void,
  style?: Record<string, string>,
  width?: number | string
  height?: number | string
}

let cameraDomObj = {
  thisVideo: null,
  thisContext: null,
  thisCancas: null,
  videoWidth: 200,
  videoHeight: 200,
  base64ImgSrc: ""
}

const CameraAutomatic: React.FC<CameraProps> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useMergeValue<string>(props.value, {
    value: props.value,
    onChange: props.onChange
  })

  useEffect(() => {
    // 调用摄像头权限
    if (isModalVisible) {
      cameraDomObj.thisCancas = document.getElementById("canvasCamera")
      cameraDomObj.thisVideo = document.getElementById("videoCamera")
      cameraDomObj.thisContext = cameraDomObj.thisCancas.getContext("2d")
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        ; (navigator.mediaDevices as any) = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          let getUserMedia = (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia || (navigator as any).getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(new Error("getUserMedia is not implemented in this browser"))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      const constraints = {
        audio: false,
        video: { width: cameraDomObj.videoWidth, height: cameraDomObj.videoHeight, transform: "scaleX(-1)" }
      }
      setLoading(true)
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          setLoading(false)
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in cameraDomObj.thisVideo) {
            cameraDomObj.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            cameraDomObj.thisVideo.src = window.URL.createObjectURL(stream as any)
          }
          cameraDomObj.thisVideo.onloadedmetadata = function async(e) {
            cameraDomObj.thisVideo.play()
            message.success("请正对摄像头拍照", 5)
            setTimeout(onUpload, 5000)
          }
        })
        .catch((err) => {
          setLoading(false)
          message.error("没有开启摄像头权限或浏览器版本不兼容!(需要切换https)")
        })
    } else {
      stopNavigator()
    }
    return function cleanup() {
    }
  }, [isModalVisible])

  // 关闭摄像头
  const stopNavigator = () => {
    if (cameraDomObj.thisVideo && cameraDomObj.thisVideo !== null) {
      cameraDomObj.thisVideo.srcObject.getTracks()[0].stop()
    }
  }

  //绘制图片
  const drawImage = () => {
    if (cameraDomObj.thisContext && cameraDomObj.thisContext.drawImage) {
      // 点击，canvas画图
      cameraDomObj.thisContext.drawImage(cameraDomObj.thisVideo, 0, 0, cameraDomObj.videoWidth, cameraDomObj.videoHeight)
      // 获取图片base64链接
      cameraDomObj.base64ImgSrc = cameraDomObj.thisCancas.toDataURL("image/png").replace("data:image/png;base64,", "")
    }
  }
  //base64转成文件后上传
  const onUpload = () => {
    if (loading) {
      return
    }
    drawImage()
    if (!cameraDomObj.base64ImgSrc) {
      message.error("未捕捉到照片,需重新拍照！")
      return
    }

    //
    uploadImgBase64({ imgBase64: cameraDomObj.base64ImgSrc })
      .then((result) => {
        setValue(result.data.uri)
      })
      .catch(() => {
        message.warn("拍照失败")
      })
  }

  return (
    <>
      <div
        style={{ width: "200px", height: "200px", margin: "0 auto", ...props.style || {} }}
        onClick={() => {
          setIsModalVisible(true)
        }}
      >
        {value ? <Images width={"width" in props ? props.width : cameraDomObj.videoWidth}
          height={"height" in props ? props.height : cameraDomObj.videoHeight}
          src={value} {...("width" in props ? { enlarge: true } : { enlarge: false })} /> :
          <Spin spinning={loading} tip="请正对摄像头">
            <div>
              <video id="videoCamera" width={"width" in props ? props.width : cameraDomObj.videoWidth}
                height={"height" in props ? props.height : cameraDomObj.videoHeight} autoPlay></video>
              <canvas id="canvasCamera" style={{ display: "none" }} width={cameraDomObj.videoWidth}
                height={cameraDomObj.videoHeight}></canvas>
            </div>
          </Spin>
        }
      </div>
    </>
  )
}

export default CameraAutomatic

{/* <CameraAutomatic onChange={(res)=>{
    console.log(res,'res')
  }}/> */
}
