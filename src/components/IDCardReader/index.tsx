/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-08 17:57:10
 * @description: 身份证阅读信息组件
 */
import React, { Fragment, useEffect, useState } from "react"
import { Alert, Modal, Button } from "antd"
import "./index.less"
import { openNotification } from "@/components/OpenNotification"
import { message } from "antd/es"
import useInterval from "@/utils/useInterval"

interface IProps {
  initConnect?: boolean, // 是否默认连接读卡器
  getReadResult?: Function, // 获取身份证读取结果
  resetIsShowModal?: Function // 在父组件中来设置 第二次是否显示 Modal 提示
}

// 定时器 id
let timerId
// 当用户没有放置身份证时,读取失败提示, 只提示一次
let failedCount = 1

// 检查身份证读卡器 是否是否已连接
// const connectStatus = () => {
//   let CertCtl: any = document.getElementById("CertCtl")
//   try {
//     let statusResult: any = CertCtl.getStatus()
//     statusResult = JSON.parse(statusResult || '{}')
//     if (statusResult?.resultFlag === 0) {
//     } else if (statusResult?.resultFlag === -1) {
//       return Promise.resolve({code: 0, msg: "对不起,您的设备没有连接,请检查设备是否连接完好!"})
//     }
//   } catch (e) {
//   }
// }

// 获取当前读卡器当前版本
// const getVersion = () => {
//   var CertCtl: any = document.getElementById("CertCtl")
//   try {
//     var result = CertCtl.getVersion()
//   } catch (e) {
//   }
// }

// 获取读卡器 SamId
// const SamId = () => {
//   var CertCtl: any = document.getElementById("CertCtl")
//   try {
//     var result = CertCtl.getSAMID()
//   } catch (e) {
//   }
// }


//1. 连接读卡器
export const connectReader = () => {
  let CertCtl: any = document.getElementById("CertCtl")
  try {
    let result = JSON.parse(CertCtl?.connect() || "{}")
    if (result.resultFlag === 0) {
      openNotification({ message: "身份证读卡器连接成功,正在读取身份证信息,请稍后... ..." }, "success")
      return Promise.resolve(result)
    } else if (result.resultFlag === -1) {
      openNotification({ message: "很抱歉,设备连接失败,请检查设备是否正确连接... ..." }, "error")
      return Promise.resolve({ code: 0, msg: "对不起,身份证连接失败!" })
    }
  } catch (e) {
    openNotification({ message: "很抱歉,设备连接失败,请检查设备是否正确连接" }, "error")
  }
}

//2. 读取身份证信息
export const readCert = () => {
  let CertCtl = document.getElementById("CertCtl") as any
  try {
    let result = JSON.parse(CertCtl?.readCert() || "{}")
    // console.log("读取身份证结果 result -->>", result)
    if (result?.resultFlag === 0) {
      return Promise.resolve(result)
    } else if (result?.resultFlag === -1) {
      failedCount === 1 && setTimeout(() => {
        openNotification({ message: "抱歉,身份证识别失败,请确认是否放置身份证卡片!" }, "error")
      }, 0)
      return Promise.resolve(result)
    }
  } catch (e) {
    console.log("e", e)
  }
}

//3. 断开连接
const disconnect = () => {
  let CertCtl: any = document.getElementById("CertCtl")
  try {
    let result = JSON.parse(CertCtl?.disconnect() || "{}")
    return Promise.resolve(result)
  } catch (e) {
  }
}

/** -------------------- 身份证读卡器组件 ------------------------ */
const IDCardReader: React.FC<IProps> = (props) => {
  const { initConnect = true, getReadResult, resetIsShowModal } = props // 是否默认链接读卡器
  const [isConnected, setIsConnected] = useState<Boolean>(false) // 是否已经连接读卡器
  const [isShowModal, setIsShowModal] = useState(true) // 是否显示 modal, 默认是 true
  const [isShowIDCardReader, setIsShowIDCardReader] = useState(false)   // 是否渲染身份证读卡器组件
  let [accumulator, setAccumulator] = useState<number>(0)

  useEffect(() => {
    // 1. 建立连接身份证读卡器
    if (initConnect && isConnected === false) {
      // console.log(" 建立链接身份证读卡器 isConnected ======>> 11111111111 ",isConnected);
      initConnect && toConnect()
    }

    // 连接成功之后 开始定时读取身份证信息
    if (isConnected) {
      timerId = setInterval(toReadCert, 3000)
      // useInterval(toReadCert,3000)
    }

    return () => {
      // 组件销毁时,清除定时器
      clearInterval(timerId)
      // 组件销毁时, 销毁连接, 连接失败计数器重置为1
      isConnected && toDisconnect()
      failedCount = 1
    }
  }, [isConnected, isShowIDCardReader])

  // 1. 建立连接
  const toConnect = async () => {
    const res = await connectReader()
    // console.log("%c建立链接 ===>>","color:green",res);
    if (res?.resultFlag === 0) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }

  // 2.  身份证读卡器连接成功 去读卡
  const toReadCert = async () => {
    try {
      const res = await readCert()
      if (res?.resultFlag === 0) {
        getReadResult && getReadResult({
          code: 1,
          data: {
            ...res?.resultContent,
            // 身份证读卡器读出的结果 0为女,  1为男, 但是跟我们后端数据库定义的枚举值正好相反,
            // 故, 我们在读卡器读出结果时, 把 gender 字段取反一下, 再把结果抛出.
            gender: res?.resultContent?.gender === 1 ? 0 : 1
          }
        })
        // 如果中途读取过身份证时, 把之前读取失败的计数器重置为 1
        failedCount = 1
      } else if (res?.resultFlag === -1) {
        getReadResult && getReadResult({ code: 1, data: { ...res } })
        failedCount++
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 断开连接
  const toDisconnect = async () => {
    const result = await disconnect()
  }

  // 确认
  const handleConfirmButton = () => {
    // 第一次关闭 modal 之后, 计数器 + 1, 说明已经弹出过一次弹出框,以后不再显示
    setIsShowModal(false)
    setAccumulator(accumulator + 1)
    message.loading({ content: "正在读取身份证信息,请稍后..." })
    // 延迟渲染身份证读卡器插件, 避免渲染读卡器插件时, modal 框卡死不消失
    setTimeout(() => {
      setIsShowIDCardReader(true)
    }, 600)
  }

  return (
    <Fragment>
      <div className="idCard_reader">
        {/*<Modal visible={isShowModal} destroyOnClose closable={false}*/}
        {/*       footer={[*/}
        {/*         <Button key={0} type="primary" onClick={handleConfirmButton}*/}
        {/*                 style={{ width: "120px", display: "block", margin: "0 auto" }}*/}
        {/*         >好的,我知道了!*/}
        {/*         </Button>*/}
        {/*       ]}*/}
        {/*>*/}
        {/*  <p style={{ color: "#333333", fontSize: "25px" }}>注意!</p>*/}
        {/*  <p style={{ color: "#666666", fontSize: "18px" }}>*/}
        {/*    您将开启身份证自动识别功能, 请确保身份证读卡器设备已经连接好,否则将导致设备不可用,系统将无法读取身份证!*/}
        {/*  </p>*/}
        {/*</Modal>*/}
        {true && (
          <div>
            <object id="CertCtl" type="application/cert-reader" width="0" height="0">
              <Alert banner={true} message='身份证读卡器控件不可用，可能未正确安装控件及驱动，或者控件未启用!' type="error"/>
            </object>
          </div>
        )}
        {/*{isShowIDCardReader && (*/}
        {/*  <div>*/}
        {/*    <object id="CertCtl" type="application/cert-reader" width="0" height="0">*/}
        {/*      <Alert banner={true} message='身份证读卡器控件不可用，可能未正确安装控件及驱动，或者控件未启用!' type="error"/>*/}
        {/*    </object>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </Fragment>
  )
}

export default IDCardReader
