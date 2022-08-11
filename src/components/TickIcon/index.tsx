import React from 'react'
import { connect } from 'dva'
import './tick-icon.less'

/**
 * 对号成功 ICon 标志
 * @param match
 * @constructor
 */
const TickIcon = ({}) => {
  return (
    <div className="tick_icon_outer">
      <div className="icon_container">
        <div className="tick_icon"></div>
      </div>
    </div>
  )
}
export default connect(({}) => ({}))(TickIcon)
