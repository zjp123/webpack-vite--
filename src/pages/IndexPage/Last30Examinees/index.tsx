/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:27:05
 * @description: 首页近30日考试人数拆分
 */
import React, { Fragment } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"
import { Line } from "@ant-design/charts"
import "./last30Examinees.less"
import { Tooltip } from "antd"
import { connect } from "dva"
import { ANTD_CHART_BASE_CONFIG } from "@/utils/constants"
import { repeatArrayMonth } from "@/utils/publicFunc"

const Last30Examinees = ({ last30Examinees }) => {
  let options = [
    { category: "当日人数", value: "thatDayStudentNumber" },
    { category: "同比上月当日人数", value: "samePeriodStudentNumber" }
  ]
  last30Examinees = repeatArrayMonth(last30Examinees, 2, options) || []
  let config = {
    ...ANTD_CHART_BASE_CONFIG,
    data: last30Examinees,
    xField: "date",
    yField: "value",
    seriesField: "category",
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return "".concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
            return "".concat(s, ",")
          })
        }
      }
    },
    color: ["#5B8FF8", "#2FC25B"]
  }

  return (
    <Fragment>
      <div className="index_page_last_30_examinees">
        <div className="line_chart_container">
          <div className="title">
            <div className="title_desc">
              月度考试人数对比
              <Tooltip className="tool_tip" color="geekblue" title="统计当月每天考试人数, 每天考试人数与上月同期考试人数对比趋势图"
                       placement="rightTop">
                <InfoCircleOutlined className="icon"/>
              </Tooltip>
            </div>
            {/*<div className="title_legend">*/}
            {/*  <div>*/}
            {/*    <div className="signed_number">*/}
            {/*      <span></span>*/}
            {/*      <label>当月参加考试人数</label>*/}
            {/*    </div>*/}
            {/*    <div className="examinee_number">*/}
            {/*      <span></span>*/}
            {/*      <label> 上月同期参加考试人数</label>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          <div className="divider_horizontal"></div>

          <div className="count_chart_container">
            <Line {...config} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default connect(({ sysIndex }) => {
  return {
    last30Examinees: sysIndex?.last30Examinees
  }
})(Last30Examinees)
