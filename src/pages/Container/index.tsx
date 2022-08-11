import React, { useState, useEffect, useRef } from "react"
import { useHistory, useLocation, Switch, Route, Redirect } from "react-router-dom"
import { Menu, Header } from "@/components"
import classNames from "classnames"
import { Layout, BackTop, Dropdown, Menu as Menus, Modal, Checkbox, Button } from "antd"
import { connect } from "react-redux"
import * as actions from "@/store/actions"
import styles from "./Home.module.less"
import Titile from "@/assets/img/jh.png"
import NotFound from "@/pages/Public/errorPage"
import Portrait from "@/assets/img/portrait.png"
import moment from "moment"
import { setCookie } from "@/utils/auth"
import ResetPasswordModal from "./resetPasswordModal"
import useInterval from "@/utils/useInterval"
import { app } from "@/main"
import { getPluginsApi, downloadPluginsApi, getFileDomainApi, loginOutApi } from "@/api/common"
import { getDynamicProtocolDomain, wrapperDynamic } from "@/utils/publicFunc"
import { generatePageWaterMark } from "@/utils"
import gif from "@/assets/xiazai.gif"
import "./styled.less"


const Home = props => {
  const [isCuresetPasswordlVisible, setIsCuresetPasswordlVisible] = useState<boolean>(false)
  const pathRef: RefType = useRef<string>("")
  const history = useHistory()
  const { pathname, search } = useLocation()
  const {
    storeData: { collapsed, userInfo, userType, watermark },
    setStoreData
  } = props
  const { token, userName, userid, globalRoutes: menusResult } = userInfo
  const [isHospital, setIsHospital] = useState(false) // 当前登录人是否是医院端 false
  const [globalRoutes, setGlobalRoutes] = useState([])
  // 判断时间为上午还是下午
  const [curTime, setCurTime] = useState(new Date().getHours())
  useInterval(() => setCurTime(new Date().getHours()), 60000)

  useEffect(() => {
    generatePageWaterMark('water-mark-wrappr', {
      text: `${watermark?.name}\n${watermark?.idNumber}\n${watermark?.ip}  ${watermark?.loginDate}\n本操作将被记录\n泄漏相关信息将被依法追究法律责任`, // 文本  多行文本用\n分割
      textColor: '#ccc', // 文本颜色
      textOpacity: 0.3, // 文本透明度
      textFontSize: '13px', // 文本字体大小
      textFontFamily: '微软雅黑', // 字体
      waterMarkBgImgWidth: 320, // 水印图片宽
      waterMarkBgImgHeight: 320, // 水印图片高
      textRotate: -30, // 水印文本旋转角度
      textSpacing: 20, // 水印多行文本间距
      isFixed: false, // 水印容器定位方式
      suffix: 'png', // 生成水印图片背景图格式
    })
  }, [])

  useEffect(() => {
    // 获取全局文件域名,为避免多次请求,所以只监听 token,当 token变化了,说明用户变了,再重新替换fileDomain
    getFileDomainApi({}).then((res) => {
      let fileDomain = res?.data?.fileDomain
      let newFileDomain = getDynamicProtocolDomain(fileDomain)
      setStoreData("SET_FILE_DOMAIN_URL", newFileDomain)
    })
  }, [token])

  useEffect(() => {
    // 记录新的路径，用于下次更新比较
    const newPath = search ? pathname + search : pathname
    pathRef.current = newPath
    getUserType()
    // 获取菜单
    getMenus()
  }, [history, pathname, search, token, userType, menusResult])


  // 获取目录数据
  const getMenus = async () => {
    setGlobalRoutes(wrapperDynamic(app, menusResult))
  }

  // 项目加载成功时, 删除 app_spin_container 的行内样式. 否则会引起 div的 line-height 首页样式混乱
  const removeInlineStyle = () => {
    const ele = document.getElementById("app_spin_container")
    ele && ele.removeAttribute("style")
  }

  // 获取用户类型
  const getUserType = () => {
    // 医院 或 医生
    if (userType === 6 || userType === 4) {
      setIsHospital(true)
    } else {
      setIsHospital(false)
    }
  }
  // 登出
  const logout = async () => {
    await loginOutApi()
    await setStoreData("SET_USERINFO", {})
    history.replace({ pathname: "/login" })
    // setCookie("token", "", 28800)
  }

  // 修改密码
  const update = async () => {
    setIsCuresetPasswordlVisible(true)
  }

  const onCancel = async () => {
    setIsCuresetPasswordlVisible(false)
  }

  globalRoutes.length && removeInlineStyle()

  // 账户信息
  const accountInfo = () => {
    if (userType === 4) { // 去 医院账号信息
      history.push(`/student/thedoctor/chthedoctorPage/${userInfo?.userid}`)
    } else if (userType === 6) { // 去医生账号信息
      history.push(`/system/account/${userInfo?.userid}`)
    }
  }

  // 驱动下载
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false)
  const [pluginsList, setPluginsList] = useState()
  const [checkedValues, setCheckedValues] = useState([])
  const [downloadName, setDownloadName] = useState([])

  const handleOk = async () => {
    setIsDownloadModalVisible(true)
    const res = checkedValues.map(async (item) => {
      item && await downloadPluginsApi({ url: item }, item.split("/").reverse()[0].split(".")[0])
    })
    Promise.all(res).then(res => {
      setIsModalVisible(false)
      setIsDownloadModalVisible(false)
      setDownloadName([])
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onChange = v => {
    setCheckedValues(v)
    v = v.map(item => item.split("/")[2].split(".")[0])
    setDownloadName(v)
  }

  // 删除 header 面包屑容器
  const deleteHeaderContainer = (id) => {
    const headerContainerDom = document.getElementById(id)
    headerContainerDom?.remove()
  }

  // 获取面包屑名字
  const getBreadCrumbName = (name) => {
    if (name === "系统首页") { // 删除面包屑容器
      // deleteHeaderContainer("sysHeaderContainer")
    }
  }

  const driverDownload = async () => {
    const res: any = await getPluginsApi()
    setIsDownloadModalVisible(false)
    setIsModalVisible(true)
    res.data.map(item => {
      item.label = item.pluginName
      item.value = item.url
    })
    setPluginsList(res.data)
  }

  let menus = (
    <Menus>
      <Menus.Item onClick={update}>
        <span>修改密码</span>
      </Menus.Item>
      <Menus.Item onClick={driverDownload}>
        <span>插件下载</span>
      </Menus.Item>
      <Menus.Item onClick={logout}>
        <span>退出登录</span>
      </Menus.Item>
    </Menus>
  )

  let hospitalMenus = (
    <Menus>
      <Menus.Item onClick={accountInfo}>
        <span>账号信息</span>
      </Menus.Item>
      <Menus.Item onClick={driverDownload}>
        <span>插件下载</span>
      </Menus.Item>
      <Menus.Item onClick={logout}>
        <span>退出登录</span>
      </Menus.Item>
    </Menus>
  )
  let redirectHome = "/index"
  if (menusResult[0] && menusResult[0].children) {
    if (menusResult[0].children.length) {//菜单
      redirectHome = menusResult[0].children[0].path
    } else {//一级目录
      redirectHome = menusResult[0].path
    }
  }
  const modalFoot = [
    <Button key="back" onClick={handleCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" onClick={handleOk}>
      确认
    </Button>
  ]

  const modalDownloadFoor = [
    <Button block={true} key="submit" type="primary" onClick={driverDownload}>
      重新下载
    </Button>
  ]

  // 账号信息
  return (
    <Layout>
      <Modal
        width="400px"
        title="插件下载"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={isDownloadModalVisible ? modalDownloadFoor : modalFoot}
      >
        {
          isDownloadModalVisible ? <div className='download-modal-div'>
            <span><img src={gif} alt="" /></span>
            <h2>下载启动中</h2>
            <p>如果页面没有反应请耐心等待或点击重新下载按钮</p>
            <div>
              {
                downloadName?.map(item => {
                  return (
                    <span>{item}</span>
                  )
                })
              }
            </div>
          </div> : <Checkbox.Group options={pluginsList} onChange={onChange} />
        }
      </Modal>

      {/* 顶部 banner */}
      <div className={styles.homeContent}>
        {/* 左半部分 title */}
        <section className={styles.headerLeftContent}>
          {/*<img className={styles.headersImg} src={Titile} alt="" style={{ marginTop: "-6px" }}/>*/}
          <img className={styles.headersImg} src={Titile} alt="" style={{ marginTop: "-6px" }} />
          <div className={styles.titleContent}>
            <div className={styles.titleName} style={{ marginTop: "-2px" }}>智慧驾考无纸化</div>
            <div className={styles.titleDes}>综合服务平台</div>
          </div>
          <div className={styles.titleCuts} style={{ marginBottom: "10px" }}></div>
          <div className={styles.nameSpace}>
            <div className={styles.rName}>{curTime >= 12 ? "下午" : "上午"}好,{userName}</div>
            <div className={styles.rTime}>{moment().format("YYYY-MM-DD")}</div>
          </div>
        </section>

        {/* 右半部分 登录框 */}
        {<Dropdown className={styles.headerRightContent} overlay={isHospital ? hospitalMenus : menus}>
          <span>
            <img src={Portrait} alt="" className="avart" />
            <span style={{ color: "#fff" }}>{userName}</span>
          </span>
        </Dropdown>}
      </div>

      {/* 项目整体content */}
      <Layout className={styles.container} onContextMenu={e => e.preventDefault()}
        style={{ display: pathname.includes("/login") ? "none" : "flex", overflowX: 'scroll' }}>
        {/** ========== 左侧菜单 ======== */}
        <Menu {...props} globalRoutes={globalRoutes}  />
        {/** ========== content 区域 ====== */}
        <Layout
          className={classNames(styles.content, {
            [styles.collapsed]: collapsed
          })}
          style={{
            position: 'relative',
            minWidth: '768px'
          }}
        >
          {/** header ======= 面包屑区域 ======== */}
          <div id="water-mark-wrappr">
            <div id="sysHeaderContainer">
              <Header id="sysHeaderContainer" getBreadCrumbName={getBreadCrumbName}
                deleteHeaderContainer={deleteHeaderContainer} />
            </div>
          </div>
          {/** content 内容区域 */}
          <Layout.Content className="layout-content-main">
            {globalRoutes && globalRoutes.length > 0 && (
              <Switch>
                {globalRoutes.map(item => {
                  const Component = item.component
                  if (Component) {
                    return (
                      <Route
                        exact={item.exact} key={item.key} path={item.path}
                        render={props => <Component {...props} {...item} />}
                      />)
                  }
                })}
                <Redirect exact from="/" to={redirectHome} />
                <Route component={NotFound} />
              </Switch>
            )}
          </Layout.Content>
        </Layout>
        <BackTop visibilityHeight={1080} />
      </Layout>
      {isCuresetPasswordlVisible &&
        <ResetPasswordModal userName={userName} userId={userid} isCuresetPasswordlVisible={isCuresetPasswordlVisible}
          onCancel={onCancel} />}
    </Layout>
  )
}

export default connect(
  state => state,
  actions
)(Home)

