/**
 * 面部遮罩
 */

import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import './face-mask.less'
import FaceMaskFocus01 from '@/assets/img/face_mask_focus01.png'

// 面部遮罩函数
const FaceMask = props => {
  const { children, width = 310, height = 310, borderColor = 'rgba(7, 193, 96, 1)', bgColor = 'rgba(7, 193, 96, 0.5)', text = '请对准取景框' } = props
  return (
    <div className="face_mask_container">
      <div style={{ width: `${width + 25}px`, height: `${height + 25}px` }} className="face_mask_outer_box">
        <div style={{ borderTop: `5px solid ${borderColor}`, borderLeft: `5px solid ${borderColor}` }} className="left_top"></div>
        <div style={{ borderTop: `5px solid ${borderColor}`, borderRight: `5px solid ${borderColor}` }} className="right_top"></div>
        <div style={{ borderRight: `5px solid ${borderColor}`, borderBottom: `5px solid ${borderColor}` }} className="right_bottom"></div>
        <div style={{ borderBottom: `5px solid ${borderColor}`, borderLeft: `5px solid ${borderColor}` }} className="left_bottom"></div>

        {/** ============================== 内部边框渲染,最主要的部分 ============= */}
        <div style={{ width: `${width}px`, height: `${height}px` }} className="face_mask_inner_box">
          <div className="top_children">{children}</div>
          <div style={{ backgroundColor: bgColor }} className="bottom_desc">
            <div className="icon"></div>
            <div className="text">{text}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => state,
  actions
)(FaceMask)
