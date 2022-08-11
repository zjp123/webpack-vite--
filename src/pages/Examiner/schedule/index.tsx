import React, { useEffect, useState } from "react"
import { connect } from "dva"
import { Empty, Popover } from "antd"
import { WhiteCard } from "@/components"
import "./index.less"
import { goto } from "@/utils"
import { createElementByDynamicLength } from "@/utils/publicFunc"

//考试预约管理
const Schedule = ({ dispatch, scheduleCardList, searchScheduleForm }) => {
  const [, setLoading] = useState(false)
  useEffect(() => {
    getData()
  }, [])
  //获取列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "schedule/loadScheduleCardList",
      payload: {
        ...searchScheduleForm
      }
    })
    setLoading(false)
  }

  // 动态创建 status 状态元素
  const createStatusTag = status => {
    let bgColor
    bgColor = status === "待考" ? "#6B798E" : status === "正在考试" ? "#00A70D" : "#999999"
    return (
      <div className="status" style={{ backgroundColor: bgColor }}>
        <span>{status}</span>
      </div>
    )
  }

  // 没有数据
  const renderEmpty = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Empty/>
      </div>
    )
  }

  // 渲染card列表
  const renderInnerList = () => {
    return (
      <div className="outer_flex_container">
        {scheduleCardList?.map((item, index) => {
          return (
            <div key={index} className="inner_flex_item_card"
                 onClick={() => {
                   goto.push(`/examiner/schedule/checkSchedule/${item.date}`)
                 }}
            >
              <div className="date_title_status">
                <div className="left">
                  <span className="date">{item.date.split(" ")[0]}</span>
                </div>
                <div className="right">
                  <div> {createStatusTag(item.status)}</div>
                </div>
              </div>
              <div className="num_desc">
                <div className="left">
                  <div className="number">{item.sessionCount} <span>场</span></div>
                  <div className="number_desc">考场次数</div>
                </div>
                <div className="right">
                  <div className="number"> {item.stuCount} <span>人</span></div>
                  <div className="number_desc">预约人数</div>
                </div>
              </div>
              <div className="divider_horizontal"></div>
              <div className="subject">
                <div className="left">
                  {item?.examType?.includes("科一") ? (
                    <span style={{ color: "black" }}>科一</span>
                  ) : (
                    <Popover placement="bottom" content="该科目没有预约信息">
                      <span style={{ color: "#999999" }}>科一</span>
                    </Popover>
                  )}
                </div>
                <div className="right">
                  {item?.examType?.includes("科二") ? (
                    <span style={{ color: "black" }}>科二</span>
                  ) : (
                    <Popover placement="bottom" content="该科目没有预约信息">
                      <span style={{ color: "#999999" }}>科二</span>
                    </Popover>
                  )}
                </div>
              </div>
              <div className="divider_horizontal"></div>
              <div className="subject_desc">
                <div className="left">
                  {item.examType && item?.examType?.includes("科三") ? (
                    <span style={{ color: "black" }}>科目三道路考试</span>
                  ) : (
                    <Popover placement="bottom" content="该科目没有预约信息">
                      <span>科目三道路考试</span>
                    </Popover>
                  )}
                </div>
                <div className="right">
                  {item?.examType?.includes("科四") ? (
                    <span style={{ color: "black" }}>科目三道理论考试</span>
                  ) : (
                    <Popover placement="bottom" content="该科目没有预约信息">
                      <span>科目三道理论考试</span>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {createElementByDynamicLength(scheduleCardList?.length)}
      </div>
    )
  }

  return (
    <WhiteCard>
    <div className="schedule_container">
      {scheduleCardList?.length === 0 ? renderEmpty() : renderInnerList()}
    </div>
    </WhiteCard>
  )
}

export default connect(({ schedule, global }) => ({
  scheduleCardList: schedule.scheduleCardList,
  scheduleList: schedule.scheduleList,
  searchScheduleForm: schedule.searchScheduleForm,
  courseList: global.courseList
}))(Schedule)
