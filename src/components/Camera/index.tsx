import { CameraFilled } from "@ant-design/icons"
import { Button, message, Spin } from "antd"
import React, { useEffect, useState } from "react"
import { Images } from "@/components"
import "./style.less"
import { uploadImgBase64 } from "@/api/common"
import useMergeValue from "use-merge-value"

interface CameraProps {
  value?: string
  onChange?: (value?: string) => void
  width?: number
  height?: number,
  btnHandle?: string,
  setBtnHandle?: Function
}

let cameraDomObj = {
  thisVideo: null,
  thisContext: null,
  thisCancas: null,
  base64ImgSrc: "",
}

const Camera: React.FC<CameraProps> = (props) => {
  const [isPhoto, setIsPhoto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useMergeValue<string>(props.value, {
    value: props.value,
    onChange: props.onChange
  })

  const { btnHandle, setBtnHandle } = props

  let cameraDomSize = {
    videoWidth: props.width || 200,
    videoHeight: props.height || 200,
  }

  useEffect(() => {
    if (btnHandle === 'click') onUpload()
  }, [btnHandle])

  useEffect(() => {
    btnHandle && setIsPhoto(true)
  }, [btnHandle])

  useEffect(() => {
    // 调用摄像头权限
    if (isPhoto) {
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
        video: { width: cameraDomSize.videoWidth, height: cameraDomSize.videoHeight, transform: "scaleX(-1)" }
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
          cameraDomObj.thisVideo.onloadedmetadata = function (e) {
            cameraDomObj.thisVideo.play()
          }
        })
        .catch((err) => {
          setLoading(false)
          message.error("没有开启摄像头权限或浏览器版本不兼容(需要切换https)")
        })
    } else {
      stopNavigator()
    }
    return function cleanup() {
    }
  }, [isPhoto])
  //重置画布
  // const resetCanvas = () => {
  //         this.base64ImgSrc = "";
  //         this.clearCanvas('canvasCamera');
  //     }
  //关闭摄像头
  const stopNavigator = () => {
    if (cameraDomObj.thisVideo && cameraDomObj.thisVideo !== null) {
      cameraDomObj.thisVideo.srcObject.getTracks()[0].stop()
    }
  }

  //绘制图片
  const drawImage = () => {
    // 点击，canvas画图
    cameraDomObj.thisContext.drawImage(cameraDomObj.thisVideo, 0, 0, cameraDomSize.videoWidth, cameraDomSize.videoHeight)
    // 获取图片base64链接
    cameraDomObj.base64ImgSrc = cameraDomObj.thisCancas.toDataURL("image/png").replace("data:image/png;base64,", "")
  }
  //base64转成文件后上传
  const onUpload = () => {
    if (loading) {
      return
    }
    drawImage()
    if (!cameraDomObj.base64ImgSrc) {
      message.error("请点击拍照！")
      return
    }

    setLoading(true)
    // // TOD
    uploadImgBase64({ imgBase64: cameraDomObj.base64ImgSrc })
      .then((result) => {
        setValue(result.data.uri)
        setLoading(false)
        setBtnHandle('pending')
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const closePhoto = () => {
    setValue("")
    setIsPhoto(false)
  }
  return (
    <>
      <div
        className='camera'
        style={{ width: cameraDomSize.videoWidth + 'px', height: cameraDomSize.videoHeight + 'px', position: "relative", overflow: "hidden" }}
        onClick={() => {
          setIsPhoto(true)
        }}
      >
        {
          isPhoto ?
            value ? <><p style={{
              position: "absolute",
              right: -20,
              top: -20,
              zIndex: 10,
              width: "50px",
              height: "50px",
              borderRadius: "100%",
              background: "#383636",
              opacity: 0.6
            }} onClick={(e) => {
              e.stopPropagation()
              closePhoto()
            }}></p> <span
              style={{ position: "absolute", right: 7, top: -1, zIndex: 11, fontSize: "16px", color: "#fff" }}
              onClick={(e) => {
                e.stopPropagation()
                closePhoto()
              }}>X</span> <Images width={cameraDomSize.videoWidth} height={cameraDomSize.videoHeight} src={value}
                enlarge={false} /></> :
              <Spin spinning={loading} tip="请正对摄像头">
                <div style={{ textAlign: "center" }}>
                  <video id="videoCamera" width={cameraDomSize.videoWidth} height={cameraDomSize.videoHeight}
                    autoPlay></video>
                  <canvas id="canvasCamera" style={{ display: "none" }} width={cameraDomSize.videoWidth}
                    height={cameraDomSize.videoHeight}></canvas>
                </div>
                <div style={{ textAlign: "center", marginTop: 5 }}>
                  {
                    !btnHandle && <Button type='primary' shape="round" onClick={onUpload}
                      style={{ position: "absolute", background: "BLUE", right: 6, bottom: 11, zIndex: 10, }}>
                      拍照
                    </Button>
                  }
                </div>
              </Spin>
            : <div className={"title"}>
              <CameraFilled />
              <div className={"text"}>人像采集</div>
            </div>
        }
      </div>
    </>
  )
}

export default Camera
