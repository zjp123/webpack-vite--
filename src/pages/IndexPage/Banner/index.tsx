/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 13:53:24
 * @description: 系统首页 banner
 */

import React, { Fragment, useEffect } from "react"
import IndexPageBanner from "@/assets/img/banner_bj.png"
import "./banner.less"
import { connect } from "dva"
// import { store } from "store"
import { store } from "@/store"

const bannerStyle = {
  backgroundImage: `url(${IndexPageBanner})`,
  backgroundClip: "content-box" // 背景图片只展示content-box区域
}

const Banner = ({ dispatch, loginLogData }) => {
  let list = [
    { id: 0, loginTime: "2021-09-29 14:53:57", ipaddr: "127.0.0.1" },
    { id: 1, loginTime: "2021-09-20 20:19:00", ipaddr: "127.0.0.1" },
    { id: 2, loginTime: "2021-09-20 20:19:00", ipaddr: "127.0.0.1" },
    { id: 3, loginTime: "2021-09-20 20:19:00", ipaddr: "127.0.0.1" }
  ]
  list = loginLogData?.loginInformation || []
  const { storeData = {} } = store.getState()
  const { userInfo = {} } = storeData
  useEffect(() => {
    getLoginLogData()
  }, [])

  const getLoginLogData = () => {
    dispatch({
      type: "sysIndex/loadLoginLogData",
      payload: {
        userName: userInfo?.userName
      }
    })
  }

  // 仅一条数据时
  const renderOneBunchData = () => {
    return (
      <Fragment>
        <div className="one_bunch_data">
          <div className="one_left">
            <div className="title">
              欢迎使用智慧驾考无纸化综合服务平台!
            </div>
            <div className="one_left_data">
              {list[0] &&
              <span>1.登录时间: {list[0]?.loginTime} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 登录IP: {list[0]?.ipaddr}</span>}
            </div>
          </div>
          <div className="one_divider_vertical"></div>
          <div className="one_right">
            <span>本月登录次数: {loginLogData?.monthLoginCount}次</span>
            <span>账号有效期剩余: {loginLogData?.remainingDay}天</span>
          </div>
        </div>
      </Fragment>
    )
  }

  // 多余两条数据时
  const renderMoreThanOneBunchData = () => {
    return (
      <div className="more_than_one_data">
        <div className="title">
          欢迎使用智慧驾考无纸化综合服务平台!
        </div>
        <div className="list">
          <div className="list_left">
            <div className="list_left_left">
              {list[0] && <span>1.登录时间: {list[0]?.loginTime} &nbsp;&nbsp;&nbsp;&nbsp; 登录IP: {list[0]?.ipaddr}</span>}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {list[2] && <span>3.登录时间: {list[2]?.loginTime} &nbsp;&nbsp;&nbsp;&nbsp; 登录IP: {list[2]?.ipaddr}</span>}
            </div>
            {list.length >= 2 ? <div className="divider_horizontal"></div> : ""}
            <div className="list_left_right">
              {list[1] && <span>2.登录时间: {list[1]?.loginTime} &nbsp;&nbsp;&nbsp;&nbsp; 登录IP: {list[1]?.ipaddr}</span>}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {list[3] && <span>4.登录时间: {list[3]?.loginTime} &nbsp;&nbsp;&nbsp;&nbsp; 登录IP: {list[3]?.ipaddr}</span>}
            </div>
          </div>
          <div className="divider_vertical"></div>

          <div className="list_right">
            <span>本月登录次数: {loginLogData?.monthLoginCount}次</span>
            <span>账号有效期剩余: {loginLogData?.remainingDay}天</span>
          </div>
        </div>
      </div>
    )
  }
  return (<Fragment>
    <div style={bannerStyle} className="index_page_banner">
      {list.length === 1 && renderOneBunchData()}
      {list.length >= 2 && renderMoreThanOneBunchData()}
    </div>
  </Fragment>)
}
export default connect(({ sysIndex }) => {
  return {
    loginLogData: sysIndex.loginLogData
  }
})(Banner)

