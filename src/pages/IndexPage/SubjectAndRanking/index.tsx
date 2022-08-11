/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:31:30
 * @description: 首页 考试科目人数 和 驾校排行榜拆分
 */

import React, { Fragment } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"
import { Pie } from "@ant-design/charts"
import "./subjectAndRanking.less"
import { Tooltip } from "antd"
import { connect } from "dva"
import { ANTD_CHART_BASE_CONFIG } from "@/utils/constants"

const SubjectAndRanking = ({ subjectAndRanking }) => {
  let examSubjectStudentNumber = subjectAndRanking?.examSubjectStudentNumber?.map((item) => ({
    type: item.examSubject,
    value: item.subjectStuNumber
  })) || []
  const schoolPassRateLeaderboard = subjectAndRanking?.schoolPassRateLeaderboard?.map((item, index) => ({
    id: index + 1,
    ...item
  })) || []
  const topFiveSchool = schoolPassRateLeaderboard.slice(0, 5)
  const lastFiveSchool = schoolPassRateLeaderboard.slice(5)

  const configEachSubject = {
    ...ANTD_CHART_BASE_CONFIG,
    data: examSubjectStudentNumber.filter(item => item.type !== "科五"),
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    width: 160,
    padding: [16, 80, 16, 8],
    appendPadding: [16, 80, 16, 8],
    color: ["#FF8D49", "#826AF9", "#2D99FF", "#f8747b"],
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: null
    // statistic: {
    //   title: {
    //     offsetY: -4,
    //     style: { fontSize: "14px" },
    //     customHtml: function customHtml(container, view, datum) {
    //       var _container$getBoundin = container.getBoundingClientRect(),
    //         width = _container$getBoundin.width,
    //         height = _container$getBoundin.height
    //       var d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
    //       var text = datum ? datum.type : "总计"
    //       return `<div style={{font-size: '10px'}}>总计</div>`
    //     }
    //   },
    //   content: {
    //     offsetY: 4,
    //     style: { fontSize: "14px" },
    //     customHtml: function customHtml(container, view, datum, data) {
    //       let total = examSubjectStudentNumber?.reduce((prev, curr) => {
    //         return prev + curr.value
    //       }, 0)
    //       var _container$getBoundin2 = container.getBoundingClientRect(),
    //         width = _container$getBoundin2.width
    //       var text = datum
    //         ? "\xA5 ".concat(datum.value)
    //         : "\xA5 ".concat(
    //           data.reduce(function (r, d) {
    //             return r + d.value
    //           }, 0)
    //         )
    //       return `${total}`
    //     }
    //   }
    // }
  }

  return <Fragment>
    <div className="index_page_subject_school_rank">
      <div className="index_page_subject_examinees">
        <div className="title">
          <span>各个科目考试人数</span>
          <Tooltip className="tool_tip" color="geekblue" title="截止当前日期前一天各个科目本年度累计考试人数"
                   placement="rightTop">
            <InfoCircleOutlined className="icon"/>
          </Tooltip>
        </div>
        <div className="divider_row"></div>
        <div className="subject_pie">
          <Pie  {...configEachSubject} />
        </div>
      </div>
      <div className="index_page_school_rank">
        <div className="title">
          <span>驾校排行榜</span>
          <Tooltip className="tool_tip" color="geekblue" title="按照通过率展示排名前十的驾校名称及通过率"
                   placement="rightTop">
            <InfoCircleOutlined className="icon"/>
          </Tooltip>
        </div>
        <div className="divider_row"></div>

        <div className="school_ranking">
          <div className="ranking_left">
            {topFiveSchool?.map((item) => {
              return <div className="ranking_school" key={item.id}>
                <div className="school_name"><span>{item.id}</span> {item.schName}</div>
                <div className="ratio">{item.passRate}</div>
              </div>
            })}
          </div>

          <div className="ranking_middle_divider"></div>
          <div className="ranking_right">
            {lastFiveSchool?.map((item) => {
              return <div className="ranking_school" key={item.id}>
                <div className="school_name"><span>{item.id}</span> {item.schName}</div>
                <div className="ratio">{item.passRate}</div>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}
export default connect(({ sysIndex }) => {
  return {
    subjectAndRanking: sysIndex?.subjectAndRanking
  }
})(SubjectAndRanking)
