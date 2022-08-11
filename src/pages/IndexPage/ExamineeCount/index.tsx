/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:20:43
 * @description: 首页考生统计柱状图拆分
 */
import React, { Fragment } from "react"
import "./examineeCount.less"
import { Column } from "@ant-design/charts"
import { InfoCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import { connect } from "dva"
import { repeatArrayItem } from "@/utils/publicFunc"

const ExamineeCount = ({ examinessCountHistogram }) => {
  let examinessCountData = examinessCountHistogram?.map((item) => ({
    month: item.month,
    signupNumber: item.signupNumber, // 报名人数
    examStuNumber: item.examStuNumber, // 考试人数
    issuanceNumber: item.issuanceNumber // 发证数量
  }))
  let options = [
    { name: "报名人数", value: "signupNumber" },
    { name: "考试人数", value: "examStuNumber" },
    { name: "发证数量", value: "issuanceNumber" }
  ]
  const resData = repeatArrayItem(examinessCountData, 3, options)

  const config = {
    data: resData,
    isGroup: true,
    autoFit: true,
    height: 300,
    xField: "月份",
    yField: "当月人数",
    seriesField: "name",
    // legend: false,
    colorField: "name", // 部分图表使用 seriesField
    color: ["#5B8FF8", "#5D7092", "#65DAAB"],
    minColumnWidth: 18,
    maxColumnWidth: 18,
    // dodgePadding: 0,
    columnStyle: {
      lineWidth: 12
    }
  }
  return (
    <Fragment>
      <div className="index_page_examinee_count">
        <div className="bar_chart_container">
          <div className="title">
            <div className="title_desc">
              考生统计
              <Tooltip className="tool_tip" color="geekblue" title="按照自然年度统计考生数量" placement="rightTop">
                <InfoCircleOutlined className="icon"/>
              </Tooltip>
            </div>
            {/*<div className="title_legend">*/}
            {/*  <div>*/}
            {/*    <div className="signed_number">*/}
            {/*      <span></span>*/}
            {/*      <label>报名人数</label>*/}
            {/*    </div>*/}
            {/*    <div className="examinee_number">*/}
            {/*      <span></span>*/}
            {/*      <label> 考试人数</label>*/}
            {/*    </div>*/}
            {/*    <div className="certificate_number">*/}
            {/*      <span></span>*/}
            {/*      <label>发证数量</label>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          {/* 横向分割线 */}
          {/*<div className="divider_horizontal"></div>*/}
          <div className="count_chart">
            <Column {...config} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
export default connect(({ sysIndex }) => {
  return {
    examinessCountHistogram: sysIndex?.examinessCountHistogram
  }
})(ExamineeCount)
