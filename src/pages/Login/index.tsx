import React, { useEffect, FC, useState } from "react"
import { useHistory } from "react-router-dom"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Form, Input, Button, message } from "antd"
import "./login.less"
import { FORMITEM_LAYOUT } from "@/utils/constants"
import LEFT from "@/assets/img/landing.png"
import { setUserInfo } from "@/utils/publicFunc"
import { connect } from "react-redux"
import * as actions from "@/store/actions"
import { login, getRouter, getUserInfoApi } from "@/api/common"
import { setCookie } from "@/utils/auth"
import { toCode } from "@/utils"
import ResetPasswordModal from "./resetPasswordModal"
import { USER_TYPE_ARR } from "@/utils/constants"
import BgImg from "@/assets/img/bgicon.png"
import {version} from "@/utils/version";

interface IObject {
  [p: string]: any
}
const loginLayoutStyle = {
  backgroundImage: `url(${BgImg})`,
  backgroundColor: "#ffffff",
  backgroundRepeat: "no-repeat"
}
const { Item } = Form

const LoginForm: FC<IObject> = ({ storeData: { userInfo = {} }, setStoreData }) => {
  const history = useHistory()
  const [isShowResetPassword, setIsShowResetPassword] = useState<boolean>(false)
  const [userid, setUserId] = useState<number>(0)
  const userTypeArr = USER_TYPE_ARR

  useEffect(() => {
    const { token, firstLogin } = userInfo
    if (token && firstLogin === 1) {
      history.push("/")
      return
    }
    // 重置 tab栏为首页
    setStoreData("SET_CURTAB", ["/"])
  }, [history, setStoreData, userInfo])

  const onCancel = () => {
    setIsShowResetPassword(false)
  }

  // 登录方法
  const onFinish = async (values: CommonObjectType<string>): Promise<void> => {
    const { userName, password } = values
    login({ userName: toCode(userName), password: toCode(password) }).then(async (loginResult: IObject) => {
      const { token, code, firstLogin, userid } = loginResult

      // 登录成功之后 再获取路由
      if (code === 0) {
        // 登录后返回的数据，包括权限
        await setCookie("token", token, 60 * 60 * 6 * 4)
        let routers = await getRouter({})
        let globalRoutes = routers && routers["data"]
        globalRoutes && localStorage.setItem("getRouterList", JSON.stringify(globalRoutes))

        // 不是第一次登录 1
        if (firstLogin === 1) {
          // 用户信息详情
          getUserInfoApi({}).then(async (res) => {
            const userType = res?.user?.userType
            const hospitalId = res?.hospitalId
            setStoreData("SET_USER_TYPE", userType)
            setStoreData("SET_HOSPITALID_TYPE", hospitalId)
            setStoreData("SET_WATERMARK", res?.watermark)
            setStoreData("SET_PERMISSIONS", res?.permissions)
            setUserId(res?.user?.userId)
            // 匹配跳转路由
            const path = userTypeArr.find((item) => item.userType === userType)?.path
            // 如果是医生, 需要验证是否完善信息
            const isNeedComplete = userTypeArr.find((item) => item.userType === userType)?.isNeedComplete
            if (!isNeedComplete) {// 考官 直接跳转去统计首页
              // 跳转前再 更新 store,否则会有 bug
              await setUserInfo({ ...loginResult, globalRoutes }, setStoreData)
              history.push(path)
            } else {
              // 医生 => 直接去 医生首页
              await setUserInfo({ ...loginResult, globalRoutes }, setStoreData)
              history.push(path)
            }
          })
          // 第一次登录firstLogin=0 重置密码
        } else if (firstLogin === 0) {
          setUserId(userid)
          setIsShowResetPassword(true)
        }
      } else {
        message.warn(loginResult.msg)
      }
    })
  }

  return (
    <div style={loginLayoutStyle} className="login-layout">
      <Form className="login-form" name="login-form" onFinish={onFinish} layout="horizontal">
        <div className="left"><img src={LEFT} className="img"/></div>
        <p style={{ margin: "50px 0", textAlign: "center", fontSize: "18px", fontWeight: 800 }}>账号密码登录</p>
        <Item {...FORMITEM_LAYOUT} label="姓名" name="userName" rules={[{ required: true, message: "请输入用户名/手机号" }]}>
          <Input placeholder="用户名/手机号" allowClear prefix={<UserOutlined/>} size="large"/>
        </Item>
        <Item {...FORMITEM_LAYOUT} label='密码' name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password
            allowClear
            placeholder="密码"
            prefix={<LockOutlined/>}
            size="large"
          />
        </Item>
        <Item>
          <Button
            className="login-form-button"
            htmlType="submit"
            size="large"
            type="primary">
            登录
          </Button>
        </Item>
      </Form>
      <p className="footer">
        <span style={{ marginRight: "10px", display: "inline-block" }}>软件版本号：{version}</span>
        建议您使用IE10+、360浏览器极速模式，分辨率1920*1080及以上浏览本网站，获得更好用户体验。
      </p>
      {isShowResetPassword &&
      <ResetPasswordModal userId={userid} isShowResetPassword={isShowResetPassword} onCancel={onCancel}/>}
    </div>
  )
}

export default connect(
  (state) => state,
  actions
)(LoginForm)
