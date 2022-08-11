/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:35:53
 * @description: 首页异常数据看板拆分
 */

import React, { Fragment,  } from "react"
import { Area } from "@ant-design/charts"
import { InfoCircleOutlined } from "@ant-design/icons"
import "./abnormalCard.less"
import { connect } from "dva"
import { ANTD_CHART_BASE_CONFIG } from "@/utils/constants"
import { Tooltip } from "antd"

export const AbnormalCard = ({ abnormalData }) => {
  const archivesStatistics = abnormalData?.archivesStatistics || {}

  // 电子档案数
  let eRecordOptions = [
    { year: new Date().getFullYear(), value: archivesStatistics.thisYearArchivesAmount },
    { year: new Date().getFullYear() - 1, value: archivesStatistics.lastYearArchivesAmount },
    { year: new Date().getFullYear() - 2, value: archivesStatistics.yearBeforeLastArchivesAmount }
  ]
  const eRecord = eRecordOptions.map((item, index) => ({
    year: item.year,
    value: item.value
  }))
  // 电子档案数配置
  const eRecordConfig = {
    data: eRecord,
    ...ANTD_CHART_BASE_CONFIG,
    height: 75,
    smooth: true,
    tooltip: true,
    areaStyle: { fill: "#DFE9FE", opacity: 20 },
    line: {
      stroke: "#5B8FF9"
    },
    xField: "year",
    yField: "value",
    tickLine: null
  }

  // 异常档案数
  let abnormalRecordOptions = [
    { year: new Date().getFullYear(), value: archivesStatistics.thisYearAbnormalArchivesAmount },
    { year: new Date().getFullYear() - 1, value: archivesStatistics.lastYearAbnormalArchivesAmount },
    { year: new Date().getFullYear() - 2, value: archivesStatistics.yearBeforeLastAbnormalArchivesAmount }
  ]
  const abnormalRecord = abnormalRecordOptions.map((item) => ({
    year: item.year,
    value: item.value
  }))
  // 异常档案数配置
  const abnormalRecordConfig = {
    data: abnormalRecord,
    ...ANTD_CHART_BASE_CONFIG,
    height: 75,
    smooth: true,
    tooltip: true,
    areaStyle: { fill: "#DFE9FE", opacity: 20 },
    line: {
      stroke: "#5B8FF9"
    },
    xField: "year",
    yField: "value",
    tickLine: null
  }

  // 档案补录数
  const makeupOptions = [
    { year: new Date().getFullYear(), value: archivesStatistics.thisYearMakeupArchivesAmount },
    { year: new Date().getFullYear() - 1, value: archivesStatistics.lastYearMakeupArchivesAmount },
    { year: new Date().getFullYear() - 2, value: archivesStatistics.yearBeforeLastMakeupArchivesAmount }
  ]
  const makeupData = makeupOptions.map((item) => ({
    year: item.year,
    value: item.value
  }))
  // 档案补录数配置
  const makeupConfig = {
    ...ANTD_CHART_BASE_CONFIG,
    height: 75,

    data: makeupData,
    smooth: true,
    tooltip: true,
    areaStyle: { fill: "#DFE9FE", opacity: 20 },
    line: {
      stroke: "#5B8FF9"
    },
    xField: "year",
    yField: "value",
    tickLine: null
  }

  return <Fragment>
    <div className="index_page_abnormal_card">

      <div className="index_page_abnormal_item1">
        <div className="abnormal_desc">
          <div className="desc_content">
            <span>电子档案数</span>
            <Tooltip className="tool_tip" color="geekblue" title="按照自然年统计，截止当前日期前一天，现存电子档案总数"
                     placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="number">{archivesStatistics?.archivesAmount}</div>
        </div>

        <div className="abnormal_line_area">
          <Area   {...eRecordConfig} />
        </div>
      </div>
      <div className="index_page_abnormal_item2">
        <div className="abnormal_desc">
          <div className="desc_content">
            <span>异常档案数</span>
            <Tooltip className="tool_tip" color="geekblue" title="按照自然年统计，截止当前日期前一天，电子档案中存在异常状态的电子档案总数"
                     placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="number">{archivesStatistics?.abnormalArchivesAmount}</div>
        </div>
        <div className="abnormal_line_area">
          <Area   {...abnormalRecordConfig} />
        </div>
      </div>
      {/*<div className="index_page_abnormal_item3">*/}
      {/*  <div className="abnormal_desc">*/}
      {/*    <div className="desc_content">*/}
      {/*      <span>档案补录数</span>*/}
      {/*      <Tooltip className="tool_tip" color="geekblue" title="按照自然年统计，截止当前日期前一天，电子档案由驾校完成上传补录总数量（按每个学员一份档案计算，补齐学员名下全部资料算完成一份）"*/}
      {/*               placement="rightTop">*/}
      {/*        <InfoCircleOutlined className="icon"/>*/}
      {/*      </Tooltip>*/}
      {/*    </div>*/}
      {/*    <div className="number">{archivesStatistics?.makeupArchivesAmount}</div>*/}
      {/*  </div>*/}
      {/*  <div className="abnormal_line_area">*/}
      {/*    <Area   {...makeupConfig} />*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="index_page_abnormal_item4">

        <div className="abnormal_left">
          <div className="abnormal_left_top">
            <div className="history_desc">
              <span>近三年异常档案制证量</span>
              <Tooltip className="tool_tip" color="geekblue" title="统计本地区近三个自然年，已制证但档案存在缺失异常状态的学员数量，单位：人"
                       placement="rightTop">
                <InfoCircleOutlined className="icon"/>
              </Tooltip>
            </div>
            <div className="history_number">{archivesStatistics?.historicalAnomalyCertificatesNumber}</div>
          </div>

          <div className="abnormal_left_divider_vertical"></div>

          <div className="abnormal_left_bottom">
            <div className="history_desc">
              <span>本年度异常档案制证量</span>
              <Tooltip className="tool_tip" color="geekblue" title="统计本地区，已制证但存在档案缺失（异常）的学员数量，单位：人"
                       placement="rightTop">
                <InfoCircleOutlined className="icon"/>
              </Tooltip>
            </div>
            <div className="history_number">{archivesStatistics?.existingAbnormalCertificatesNumber}</div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
}
export default connect(({ sysIndex }) => {
  return {
    abnormalData: sysIndex?.abnormalData
  }
})(AbnormalCard)
