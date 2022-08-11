/**
 * 签字成功页
 */
import React from 'react'
import { connect } from 'dva'
import { CountDown, TickIcon } from '@/components'
import { goto } from '@/utils'
import './physic.less'

const SuccessfulPage = ({}) => {
  const timeCountDown = 5 // 倒计时时间
  const handleGetCount = s => {
    if (s === 0) {
      goto.push('/student/physical')
    }
  }
  return (
    <div className="physical_examination_info_submitted">
      <TickIcon />
      <div className="success_title"> 体检信息提交成功 </div>
      <div className="success_sub_title">
        <span>
          倒计时 <CountDown getCount={handleGetCount} fontSize={16} count={timeCountDown} /> 后自动返回体检页, 继续进行下一名学员信息录入
        </span>
      </div>
      <div className="success_bottom_btn">
        <div className="check_examination_report"> 查看体检单 </div>
        <div
          className="to_first_page"
          onClick={() => {
            goto.push('/student/physical')
          }}
        >
          返回体检首页
        </div>
      </div>
    </div>
  )
}
export default connect(({}) => ({}))(SuccessfulPage)
