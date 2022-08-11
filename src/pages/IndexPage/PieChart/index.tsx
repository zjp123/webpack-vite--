/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:21:23
 * @description: 首页饼图拆分
 */
import React, { Fragment } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"
import { Column, Pie } from "@ant-design/charts"
import "./pieChart.less"
import { Tooltip } from "antd"
import { connect } from "dva"
import { ANTD_CHART_BASE_CONFIG } from "@/utils/constants"
import { createElementByDynamicLength } from "@/utils/publicFunc"

const PieChart = ({ pieChartData }) => {
  // 年龄分布data
  const ageStatistics = pieChartData?.ageStatistics || []

  const getSex = value => {
    switch (value) {
      case 0:
        return "男"
      case 1:
        return "女"
      default:
        return "未知"
    }
  }

  // 考生性别分布
  const sexStatistics = pieChartData?.sexStatistics?.map((item) => ({
    sex: getSex(item.sex),
    sexStudentNumber: item.sexStudentNumber
  })) || []

  // 报考车型人数占比
  const perdritypeStatistics = pieChartData?.perdritypeStatistics || []

  // 业务类型
  const businessTypeStatistics = pieChartData?.businessTypeStatistics || []

  // 欠费统计数据
  const arrearsStatistics = pieChartData?.arrearsStatistics || {}

  // 年龄分布
  const configAge = {
    ...ANTD_CHART_BASE_CONFIG,
    appendPadding: 10,
    data: ageStatistics,
    angleField: "ageStudentNumber",
    colorField: "ageRange",
    radius: 0.8,
    color: ["#D385FA", "#F86D74", "#47E0BB", "#79ACFD", "#FFD200"],
    interactions: [{ type: "element-active" }]
  }
  // 性别分布
  const configSex = {
    ...ANTD_CHART_BASE_CONFIG,
    appendPadding: 10,
    data: sexStatistics,
    angleField: "sexStudentNumber",
    colorField: "sex",
    radius: 1,
    innerRadius: 0.6,
    color: ["#006EFF", "#FA7C84", 'gray'],
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: null
    // statistic: {
    //   title: {
    //     offsetY: -4,
    //     style: { fontSize: "14px" },
    //     // customHtml: function customHtml(container, view, datum) {
    //     //   const _container$getBoundin = container.getBoundingClientRect(),
    //     //     width = _container$getBoundin.width,
    //     //     height = _container$getBoundin.height
    //     //   const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
    //     //   const text = datum ? datum.type : "总计"
    //     //   return `<div style={{font-size: '10px'}}>总计</div>`
    //     // }
    //   },
    // /*  content: {
    //     offsetY: 4,
    //     style: { fontSize: "14px" },
    //     customHtml: function customHtml(container, view, datum, data) {
    //       let total = sexStatistics?.reduce((prev, curr) => {
    //         return prev + curr.sexStudentNumber
    //       }, 0)
    //       const _container$getBoundin2 = container.getBoundingClientRect(),
    //         width = _container$getBoundin2.width
    //       const text = datum
    //         ? "\xA5 ".concat(datum.value)
    //         : "\xA5 ".concat(
    //           data.reduce(function(r, d) {
    //             return r + d.value
    //           }, 0)
    //         )
    //       return `${total}`
    //     }
    //   }*/
    // }
  }

  // 报考车型
  const configCar = {
    ...ANTD_CHART_BASE_CONFIG,
    data: perdritypeStatistics,
    xField: "perdritype",
    yField: "perdritypeStudentNumber",
    isGroup: true,
    color: ["#2CD9C5"],
    minColumnWidth: 12,
    maxColumnWidth: 12,
    // legend: false,
    tooltip: {
      customItems: (originalItems) => {
        return originalItems?.map((item) => ({ ...item, name: "该车型报考人数" }))
      }
    },
    columnStyle: {
      tickInterval: 12
    }
  }

  // 业务类型配置
  const configBusiness = {
    ...ANTD_CHART_BASE_CONFIG,
    data: businessTypeStatistics.filter(item => item.businessType === "初次申领" || item.businessType === "增驾申请"),
    // appendPadding: 10,
    angleField: "businessTypeStudentNumber",
    colorField: "businessType",
    radius: 0.8,
    color: ["#327EF8", "#00A4FF", "#0076A9", "#79ACFD", "#47E0BB", "#FFD200", "#D385FA", "#F86D74"],
    interactions: [{ type: "element-active" }],
    appendPadding: [0, 10, 0, 0],
    statistic: null
  }

  return (
    <Fragment>
      <div className="index_page_pie_chart">
        {/* 考生年龄分布 */}
        <div className="index_page_pie_chart_item1">
          <div className="pie_chart_title">
            考生年龄分布
            <Tooltip className="tool_tip" color="geekblue" title="按自然年显示截至当前日期前一天，本年度各年龄段的考生总人数" placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="divider_row"></div>
          <div className="age_pie_container">
            <div className="age_pie">
              <Pie {...configAge} />
            </div>
          </div>
        </div>

        {/* 考生性别分布*/}
        <div className="index_page_pie_chart_item2">
          <div className="pie_chart_title">
            考生性别分布
            <Tooltip className="tool_tip" color="geekblue" title="按自然年显示截至当前日期前一天，本年度男女考生总人数比例图" placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="divider_row"></div>
          <div className="sex_pie_container">
            <div className="sex_pie"><Pie {...configSex} /></div>
          </div>
        </div>

        {/* 报考车型人数占比 */}
        <div className="index_page_pie_chart_item3">
          <div className="pie_chart_title">
            报考车型人数
            <Tooltip className="tool_tip" color="geekblue" title="按自然年显示截至当前日期前一天，本年度考生报考各个车型总人数" placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="divider_row"></div>
          <div className="car_pie_container">
            <div className="car_pie"><Column {...configCar} /></div>
          </div>
        </div>

        {/* 业务类型 */}
        <div className="index_page_pie_chart_item4">
          <div className="pie_chart_title">
            业务类型
            <Tooltip className="tool_tip" color="geekblue" title="按自然年显示截至当前日期前一天，本年度考生报考各业务类型的总人数"
                     placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="divider_row"></div>
          <div className="business_pie_container">
            <div className="business_pie"><Pie {...configBusiness} /></div>
          </div>
        </div>

        {/* 欠费统计  */}
        <div className="index_page_pie_chart_item5">
          <div className="pie_chart_title">
            欠费统计
            <Tooltip className="tool_tip" color="geekblue" title="现存欠费总金额，单位：元" placement="rightTop">
              <InfoCircleOutlined className="icon"/>
            </Tooltip>
          </div>
          <div className="divider_row"></div>
          <div className="arrearage_desc">
            <div className="arrearage_money">
              <div className="arrearage_cash_title">
                欠费总金额
                <Tooltip className="tool_tip" color="geekblue" title="欠费总金额" placement="rightTop">
                  <InfoCircleOutlined className="icon"/>
                </Tooltip>
                {/*<InfoCircleOutlined className="icon"/>*/}
              </div>
              <div className="arrearage_number"> ¥{arrearsStatistics?.arrearsAmount}</div>
            </div>
            <div className="divider_row"></div>

            <div className="arrearage_school">
              <div className="arrearage_school_count">
                <div>欠费驾校数</div>
                <div className="number">{arrearsStatistics?.arrearsSchoolNumber}</div>
              </div>
              <div className="divider_column"></div>
              <div className="arrearage_people">
                <div>欠费总人数</div>
                <div className="number">{arrearsStatistics?.arrearsStudentNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {createElementByDynamicLength(5)}
      </div>
    </Fragment>
  )
}
export default connect(({ sysIndex }) => {
  return {
    pieChartData: sysIndex?.pieChartData
  }
})(PieChart)
