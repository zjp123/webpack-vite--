import { message, Spin } from "antd"
import React, { useEffect, useState, useRef } from "react"
import { Images, CountDown } from "@/components"
import { signCompared } from "@/api/common"
import useMergeValue from "use-merge-value"

interface CameraProps {
  value?: any
  onChange?: (value?: any) => void
  examId?: number
  isShowCountDown?: boolean
  takePic?: boolean
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
  // const [isModalVisible, setIsModalVisible] = useState(true)
  const isModalVisibleRef = useRef(true)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useMergeValue<any>(props.value, {
    value: props.value,
    onChange: props.onChange
  })
  const { isShowCountDown } = props

  //关闭摄像头
  const stopNavigator = () => {
    isModalVisibleRef.current = false
    if (cameraDomObj.thisVideo && cameraDomObj.thisVideo !== null) {
      cameraDomObj.thisVideo.srcObject.getTracks()[0].stop()
    }
  }

  useEffect(() => {
    // 调用摄像头权限
    if (isModalVisibleRef.current) {
      cameraDomObj.thisCancas = document.getElementById("canvasCamera")
      cameraDomObj.thisVideo = document.getElementById("videoCamera")
      cameraDomObj.thisContext = cameraDomObj.thisCancas.getContext("2d")
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
            return Promise.reject(new Error("getUserMedia is not implemented in this browser"))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      const constraints = {
        audio: false,
        video: { width: cameraDomObj.videoWidth, height: cameraDomObj.videoHeight, transform: "scaleX(-1)" }
      }
      // console.log(navigator.mediaDevices.getUserMedia(constraints))
      setLoading(true)
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          setLoading(false)
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in cameraDomObj.thisVideo) {
            cameraDomObj.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            cameraDomObj.thisVideo.src = window.URL.createObjectURL(stream as any)
          }
          cameraDomObj.thisVideo.onloadedmetadata = function async(e) {
            console.log("cameraDomObj.thisVideo.onloadedmetadata", isModalVisibleRef.current)
            cameraDomObj.thisVideo.play()
            message.success("请正对摄像头进行人脸识别")
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
      if(props.takePic) {
        drawImage()
        signCompared({
          examId: props.examId || 89,
          isLastTime: 1,
          photo: cameraDomObj.base64ImgSrc
        }).then(res => {
          setValue(res.data)
        })
      }
      stopNavigator()
    }
  }, [isModalVisibleRef.current])

  //绘制图片
  const drawImage = () => {
    if (cameraDomObj.thisContext && cameraDomObj.thisContext.drawImage) {
      // 点击，canvas画图
      cameraDomObj.thisContext.drawImage(cameraDomObj.thisVideo, 0, 0, cameraDomObj.videoWidth, cameraDomObj.videoHeight)
      // 获取图片base64链接
      cameraDomObj.base64ImgSrc = cameraDomObj.thisCancas.toDataURL("image/png").replace("data:image/png;base64,", "")
    }
  }

  let isLastTime = 0,//是否最后一次请求
    num = 1//请求次数,最多不超过5次

  //base64转成文件后上传
  const onUpload = () => {
    if (loading) {
      return
    }
    if(!isModalVisibleRef.current) {
      return
    }
    drawImage()

    if (!cameraDomObj.base64ImgSrc) {
      message.error("未捕捉到照片,需重新进入！")
      return
    }

    signCompared({
      examId: props.examId || 89,
      isLastTime,
      photo: cameraDomObj.base64ImgSrc
    }).then((res) => {
      console.log("signCompared", res)
      if (res.code === 0) {
        if (res.data.result === 1) {
          message.success("人脸比对成功")
          setValue(res.data)
        } else {
          if (num < 5) {
            num++
            if (num === 5) {
              isLastTime = 1
            }
            onUpload()
          } else {
            message.warning("人脸比对失败")
            setValue(res.data)
          }
        }
      }
    })
  }
  return (
    <>
      <div
        className={`camera`}
        style={{ margin: "0 auto" }}
        onClick={() => {
          isModalVisibleRef.current = false
        }}
      >
        {value ? <Images width={cameraDomObj.videoWidth} height={cameraDomObj.videoHeight} src={value.currectFaceUri}
                         enlarge={false}/> :
          <Spin spinning={loading} tip="请正对摄像头">
            <div style={{ textAlign: "center", position: "relative"}}>
              <video id="videoCamera" width={cameraDomObj.videoWidth} height={cameraDomObj.videoHeight}
                     autoPlay></video>
              <canvas id="canvasCamera" style={{ display: "none" }} width={cameraDomObj.videoWidth}
                      height={cameraDomObj.videoHeight}></canvas>
              {isShowCountDown &&
              <div style={{ position: "absolute",right:10,bottom:5}} className="count_down">
                <CountDown count={5} fontSize={20} color="#FFFFFF"/></div>}
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
