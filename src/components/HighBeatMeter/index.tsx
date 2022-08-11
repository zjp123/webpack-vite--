import React, { forwardRef, FC, useState, memo } from "react"
import { Button, Image } from "antd"
import { uploadImgBase64 } from "@/api/common"

interface HighBeatMeterProps {
  imgNumPage?: number,
  isfaceRecognition?: boolean
  id?: number
  getResult: Function
  theexaminee?: boolean
  children?: any
}

const HighBeatMeter: FC<HighBeatMeterProps> = forwardRef(
  (props: HighBeatMeterProps, ref: RefType) => {
    const [srcList, setSrcList] = useState<any>([
      // {
      //     base64Url: 'http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg'
      // },
      // {
      //     base64Url: 'http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg'
      // }
    ])
    // base64Url: 'http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg'

    const mainBtn = () => {//启动主
      const captrue: any = document.getElementById("captrue")
      if (typeof captrue.bStopPlay === "boolean") {
        captrue.bStopPlay()
        captrue.bStartPlay()
      }
    }

    const viceBtn = () => {//启动副
      const captrue: any = document.getElementById("captrue")
      if (typeof captrue.bStopPlay === "boolean") {
        captrue.bStopPlay()
        captrue.bStartPlay2(0)
      }
    }

    const stopBtn = () => {//停止
      const captrue: any = document.getElementById("captrue")
      if (typeof captrue.bStopPlay === "boolean") {
        captrue.bStopPlay()
      }
    }
    // let currentRef = useRef<any>()
    // useEffect(() => {
    //     currentRef.current = srcList;
    // }, [srcList])

    const saveBtn = (type) => {//拍照
      const captrue: any = document.getElementById("captrue")
      if (captrue) {
        captrue.vSetRotate(0)
        //下载到本地
        // captrue.bSaveJPG("D:\\", type);
        uploadImgBase64({
          imgBase64: captrue.sGetBase64(),
        }).then((res) => {
          if (res.code === 0) {
            const newSrcList = JSON.parse(JSON.stringify(srcList))
            newSrcList.push({
              base64Url: `data:image/${type};base64,` + captrue.sGetBase64(),
              uri: res.data.uri,
            })
            setSrcList(newSrcList)
            getResultUri(newSrcList)
          }
        })
      }
    }

    const getResultUri = (newSrcList) => {
      const array = newSrcList.map(({uri}) => {
        return uri
      })
      props.getResult(array)
    }
    //人脸识别
    // const faceRecognition = () => {
    //     const captrue: any = document.getElementById('captrue')
    //     if (captrue && typeof captrue.bStopPlay === 'boolean') {
    //         captrue.bStopPlay();
    //         captrue.bStartPlay2(0);
    //     }
    //     if (captrue.sGetBase64) {
    //         let isLastTime = 1;
    //         // num = 0,
    //         const interval = () => {
    //             // num++
    //             signCompared({
    //                 examId: props.id,
    //                 isLastTime,
    //                 photo: captrue.sGetBase64(),
    //             }).then((res) => {
    //                 if (res.code === 0) {
    //                     if (res.data.result === 1) {
    //                         message.success('人脸识别成功')
    //                         props.getResult(res?.data)
    //                     } else {
    //                         message.warning('人脸识别失败,请重新识别或下一步')
    //                         // if (num < 5) {
    //                         //     // isLastTime = num == 4 ? 1 : isLastTime
    //                         //     // num == 4 ? 1 : isLastTime
    //                         //     interval()
    //                         // } else {
    //                         //     props.getResult(res?.data)
    //                         //     // message.warning('人脸识别失败,请重新识别或下一步')
    //                         // }
    //                     }
    //                 }
    //             })
    //         }
    //         interval()
    //     }
    // }

    // const faceRecognition1 = () => {
    //     const captrue: any = document.getElementById('captrue')
    //     if (captrue && typeof captrue.bStopPlay === 'boolean') {
    //         captrue.bStopPlay();
    //         captrue.bStartPlay2(0);
    //     }
    //     if (captrue.sGetBase64) {
    //         let num = 0
    //         const interval = () => {
    //             num++
    //             uploadImgBase64({
    //                 imgBase64: captrue.sGetBase64()
    //             }).then((res) => {
    //                 if (res.code === 0) {
    //                     props.getResult(res.data.uri)
    //                 }
    //             })
    //         }
    //         interval()
    //     }
    // }

    //删除图片
    const deleteSrc = (index) => {
      const newSrcList = JSON.parse(JSON.stringify(srcList))
      newSrcList.splice(index, 1)
      setSrcList(newSrcList)
      getResultUri(newSrcList)
    }
    const isMultiple = props.imgNumPage !== 1
    return (
      <React.Fragment>
        <div style={{display: "flex"}}>
          <object
            id="captrue" width="400" height="300"
            classID='clsid:454C18E2-8B7D-43C6-8C17-B1825B49D7DE'>
          </object>
          <ul style={{display: "flex", padding: 0, width: "395px"}}>
            {
              srcList.map((item, index) => {
                return <li style={{
                  listStyle: "none",
                  width: isMultiple ? "190px" : "395px",
                  border: "1px solid #fff",
                  height: "280px",
                  background: "#eff2f5",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <p style={{
                    position: "absolute",
                    right: -20,
                    top: -20,
                    zIndex: 10,
                    width: "50px",
                    height: "50px",
                    borderRadius: "100%",
                    background: "#383636",
                    opacity: 0.6,
                  }} onClick={(e) => {
                    e.stopPropagation()
                    if (item.base64Url) {
                      deleteSrc(index)
                    }
                  }}></p> <span
                  style={{position: "absolute", right: 7, top: -1, zIndex: 11, fontSize: "16px", color: "#fff"}}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (item.base64Url) {
                      deleteSrc(index)
                    }
                  }}>X</span>
                  {
                    isMultiple ? <div style={{textAlign: "center"}}><Image src={item.base64Url} width={"100%"}
                                                                           height={247}/>{index === 0 ? "身份证正面" : "身份证反面"}
                    </div> : <Image src={item.base64Url} width={"100%"} height={247}/>
                  }
                </li>
              })
            }
          </ul>
        </div>
        <div style={{padding: "0 10px", boxSizing: "border-box",marginTop:"-8%"}}>
          <Button onClick={mainBtn}>启动主</Button>
          {/* <Button onClick={viceBtn} style={{ marginLeft: '4px' }}>启动副</Button> */}
          <Button onClick={stopBtn} style={{marginLeft: "4px"}}>停止</Button>
          <Button style={{marginLeft: "4px"}} onClick={() => saveBtn("jpg")}
                  disabled={srcList.length === props.imgNumPage}>拍照JPG</Button>
        </div>
      </React.Fragment>
    )
  },
)
export default memo(HighBeatMeter)
HighBeatMeter.defaultProps = {
  imgNumPage: 2,
}
