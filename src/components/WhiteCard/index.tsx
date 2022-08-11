/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-03-24 18:37:19
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/components/WhiteCard/index.tsx
 */
import React, { FC } from "react"
import { Row, Col } from "antd"
import "./index.less"

interface Props {
  style?: object,
  title?: any,
  pageTitle?: any,
  className?: string,
  children?: any, // 内容
  actions?: any, // 按钮
  isPaved?: boolean
  titleFontSize?: string
}

// 详情
const WhiteCard: FC<Props> = (props) => {
  const styleProps = { height: document.body.clientHeight - 58, overflowY: "scroll", ...props.style }
  const getTitle = () => {
    if (props.title) {
      return (
        <div className="whiteCard-title"
             style={{ fontSize: props.titleFontSize, paddingLeft: "10px", boxShadow: "border-box" }}
        >
          {props.title}
        </div>)
    } else {
      return null
    }
  }

  const getPageTitle = () => {
    const { actions, pageTitle } = props
    let children = pageTitle
    if (actions) {
      children = <Row>
        <Col span={12} style={{ lineHeight: "32px" }}>
          {children}
        </Col>
        <Col span={12}>
          {actions}
        </Col>
      </Row>
    }
    if (pageTitle) {
      return <div className="whiteCard-page-title">
        {children}
      </div>
    } else {
      return null
    }
  }
  return (
    <div
      className={`${props.className || ""} ${props.isPaved ? "paved" : ""} whiteCard`}
    >
      {
        getTitle()
      }
      {
        getPageTitle()
      }
      <div className={props.pageTitle ? "whiteCard-page-content" : "whiteCard-content"} style={{flex:1}}>
        {
          props.children
        }
      </div>
    </div>
  )
}
WhiteCard.defaultProps = {
  isPaved: true
}
export default WhiteCard

