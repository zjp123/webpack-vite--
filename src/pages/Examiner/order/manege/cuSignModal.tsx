/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-04-01 17:24:54
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/Examiner/manage/cuSignModal.tsx
 */
import React, {  useState, useEffect } from "react"
import { Form, Button, message } from "antd"
import { connect } from "dva"
import "./index.less"
import { WhiteCard } from "@/components"
import { goto } from "@/utils"
import zy from "@/assets/img/zy_signature.png"
import { FACE_BASE64_URL } from "@/utils/constants"

const SignModal = (props) => {
  const {isShowSignModal, dispatch} = props
  const [form] = Form.useForm()
  const [base64Url, setBase64Url] = useState()
  //详情接口
  useEffect(() => {
  }, [])

  const handleClick = () => {
    goto.go(-1)
  }

  // 签字版确认 获取base64 签字
  const getBase64Data = async (res) => {
    setBase64Url(res)
  }

  // 确认签字 开启考试
  const handleConfirmClick = async () => {
    // 1. 确认签字
    await dispatch({ // 签字
      type: "manage/saveSigned",
      payload: {
        signPic: base64Url || FACE_BASE64_URL,
      },
    }).then((res) => {
      // 2.签完字再开启考试
      dispatch({
        type: "manage/startOrCloseExamination",
      }).then((res) => { // 开启考试成功
        message.success("开启考试成功...")
        goto.push("/examiner/manage")
      })
    })
  }
  return (
    <WhiteCard className="manage_sign_container">
      <Button type="link" onClick={() => {
        handleClick()
      }}>返回</Button>
      {/*<Signature getBase64data={(res) => {*/}
      {/*  console.log("签字结果 ---->>", res)*/}
      {/*}}/>*/}
      <div className="manage_sign_modal">
        <div className="manage_sign_pic">
          <img src={zy} alt=""/>
        </div>
        <div className="manage_sign_desc">
          请正确书写本人姓名
        </div>
        {/*<Signature getBase64data={getBase64Data}/>*/}
        <div className="manage_sign_btn" onClick={handleConfirmClick}>
          确认签字F
        </div>
      </div>
    </WhiteCard>
  )
}

export default connect(({manage}) => ({}))(SignModal)
