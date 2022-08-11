/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 14:00:59
 * @description: 首页拆分 第一行看板
 */
import React, { Fragment } from "react"
import { InfoCircleOutlined } from "@ant-design/icons"
import { Area, Column } from "@ant-design/charts"
import { each, groupBy } from '@antv/util';
import { Progress, Tooltip } from "antd"
import "./descCard.less"
import { connect } from "dva"
import { ANTD_CHART_BASE_CONFIG } from "@/utils/constants"
import { createElementByDynamicLength } from "@/utils/publicFunc"
import {isEmpty} from "@/utils";

// 首页第一行card
const DescCard = ({ titleCard }) => {
  // 考生人数
  let examineesAndPeriodAverage = titleCard?.monthlyStatistics?.map((item, index) => ({
    month: item.month.toString(), // 横坐标是数字    类型的时候,容易导致横坐标从 0 开始计算,造成数据错位
    stuNumber: item.stuNumber,
    licensePeriod: item.licensePeriod
  })) || []

  let stuPassRate = titleCard?.stuPassRate || []
  stuPassRate = stuPassRate.filter(item => item.course !== "5").map(item => {
    switch (item.course) {
      case "1":
        item.course = "科目一"
        break
      case "2":
        item.course = "科目二"
        break
      case "3":
        item.course = "科目三"
        break
      case "4":
        item.course = "科目四"
        break
      case "5":
        item.course = "科目五"
        break
      default:
        break
    }
    return item
  })

  const config = {
    ...ANTD_CHART_BASE_CONFIG,
    data: examineesAndPeriodAverage,
    tooltip: {
      customItems: (originalItems) => {
        return originalItems?.map((item) => ({
          ...item,
          name: "人数",
          month: item.month
        }))
      }
    },
    xField: "month",
    yField: "stuNumber"
  }

  var config1 = {
    ...ANTD_CHART_BASE_CONFIG,
    data: examineesAndPeriodAverage,
    xField: "month",
    yField: "licensePeriod",
    tooltip: {
      customItems: (originalItems) => {
        return originalItems?.map((item) => ({
          ...item,
          name: "天数"
        }))
      }
    }
  }

  // 也可以在项目中直接使用 lodash
  const annotations = [];
  each(groupBy(stuPassRate, 'course'), (values, k) => {
    const value = values.reduce((a, b) => a + b.passRate, "");
    annotations.push({
      type: 'text',
      position: [k, parseInt(value)],
      content: `${parseInt(value) + "%"}`,
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: 'rgba(0,0,0,0.85)',
      },
      offsetY: -10,
    });
  });

  const config2 = {
    ...ANTD_CHART_BASE_CONFIG,
    padding: [20, 0, 24, 0],
    data: stuPassRate.map(item => {
      item.passRate = parseInt(item.passRate)
      return item
    }),
    xField: "course",
    yField: "passRate",
    isGroup: true,
    color: ["#2CD9C5"],
    minColumnWidth: 12,
    maxColumnWidth: 12,
    // legend: false,
    tooltip: {
      customItems: (originalItems) => {
        return originalItems?.map((item) => {
          item.value = item.value + "%"
          return { ...item, name: "通过率" }
        })
      }
    },
    columnStyle: {
      tickInterval: 12
    },
    // 使用 annotation （图形标注）来展示：总数的 label
    annotations,
  }
  return (
    <Fragment>
      <div className="index_page_card">
        <div className="item_card_container">
          {/* 驾校 card */}
          <div className="index_page_card_item1">
            <div className="index_page_card_item_total">
              <div className="school_total">
                驾校总数
                <Tooltip className="tool_tip" color="geekblue" title="本地区现存驾校总数" placement="rightTop">
                  <InfoCircleOutlined className="icon"/>
                </Tooltip>
              </div>
              <div className="number">{titleCard?.schAmount} <span className="home">家</span></div>
            </div>
            <div className="index_page_card_item_school">
              {titleCard?.schoolStuNumberLeaderboard?.map((item, index) => {
                return (
                  <div className="school_list" key={index}>
                    <div>
                      <span className="list">{index + 1}</span>
                      <span className="school">{isEmpty(item.schShortName) ? item.schShortName:item.schShortName}学员数</span>
                    </div>
                    <div>
                      <span className="number">{item.schStuNumber} 人</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 考场card */}
          <div className="index_page_card_item2">
            <div className="index_page_card_item_total">
              <div className="examination_room_total">
                <span>考场总数</span>
                <Tooltip className="tool_tip" color="geekblue" title="本地区现存考场信息中考场总数" placement="rightTop">
                  <InfoCircleOutlined className="icon"/>
                </Tooltip>
              </div>
              <div className="number">{titleCard?.examinationRoomAmount} <span className="home">家</span></div>
            </div>
            <div className="divider_horizontal"></div>
            <div className="test">
              <div className="tested_round">
                <div>已考场次</div>
                <div className="number">{titleCard?.testedTimes}</div>
              </div>
              <div className="divider_column"></div>
              <div className="tested_number">
                <div>已考人数</div>
                <div className="number">{titleCard?.testedStuNumber}</div>
              </div>
            </div>
          </div>

          {/* 考生人数 */}
          <div className="index_page_card_item3">
            <div className="index_page_card_item_total">
              <div className="examination_room_total">
                考生人数
                <Tooltip className="tool_tip" color="geekblue" title="本地区现存各个驾校学员总人数" placement="rightTop">
                  <InfoCircleOutlined className="icon"/>
                </Tooltip>
              </div>
              <div className="number">{titleCard?.stuAmount} <span className="home">人</span></div>
            </div>

            <div className="examinee_mini_chart">
              <Area  {...config} />
            </div>
          </div>

          {/* 考生通过率 */}
          <div className="index_page_card_item4">

            <div className="index_page_card_item_total">
              <div className="examination_room_total">
                考生通过率
                <Tooltip className="tool_tip" color="geekblue" title="本地区截至当前日期前一天通过率" placement="rightTop">
                  <InfoCircleOutlined className="icon"/>
                </Tooltip>
              </div>
            </div>
            <div className="ratio">
              <Column {...config2} />
            </div>
          </div>

          {/* 平均领证周期 */}
          <div className="index_page_card_item5">
            <div className="index_page_card_item_total">
              <div className="examination_room_total">
                平均领证周期
                <Tooltip className="tool_tip" color="geekblue" title="本地区本年度学员自报名到领证天数" placement="rightTop">
                  <InfoCircleOutlined className="icon"/>
                </Tooltip>
              </div>
              <div className="number">{titleCard?.averageLicensingPeriod} <span className="home">天</span></div>
            </div>

            {/* 平均领证周期 chart */}
            <div className="examinee_mini_chart">
              <Area   {...config1} /> {/*这个用的是重复的,后期数据来了,记着改一下*/}
            </div>
          </div>
          {/* 动态创建的空 i 标签*/}
          {createElementByDynamicLength(5)}
        </div>
      </div>
    </Fragment>
  )
}
export default connect(({ sysIndex }) => {
  return {
    titleCard: sysIndex?.titleCard
  }
})(DescCard)

