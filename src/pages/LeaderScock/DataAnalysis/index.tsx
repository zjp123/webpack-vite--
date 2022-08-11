import React, { Fragment, useEffect } from 'react'
import { connect } from 'dva'
import ReactDOM from 'react-dom'
import { TimerClock } from "@/components"
import './index.less'
import examineePortalBg from '@/assets/img/leader_cap_bg.png'
import examineePortalLine from '@/assets/img/leader_cap_top_line.png'
import FullScreen from "@/pages/LeaderScock/FullScreen"
import Percentage from './percentage'
import {
  drawExamineeTrainingPeriod,
  drawWaterFallChart,
  drawRankBarChart,
  drawAgePieChart,
  drawNewExamineeLineChart,
  examineeTrainChartInstance,
  waterFallChartInstance,
  rankBarChartInstance,
  agePieChartInstance,
  newExamineeLineChartInstance
} from './echart-fn.js'

const examineePortalContainer = {
  backgroundImage: `url(${examineePortalBg})`,
  backgroundClip: 'content-box' // 背景图片只展示content-box区域
}

/** 
 averageLicensingPeriod 平均领证周期
 issuanceAmount 本地区持证 发证数量
 stuAmount  本地区累计考生人数
 stuPassRate 考生通过率
 
 stuTrainingCycleStatistics 考生培训周期
 perdritypeStatistics 报考车型人数
 schNewStuNumberLeaderboard 驾校新增考生量排名
 ageStatistics 考生年龄分布
 thisMonthStatistics 新增考生数量

 不知道干嘛的
 businessTypeStatistics
 monthlyStatistics
 sexStatistics
 stuSourceStatistics
 thisWeekStatistics
 
*/

/** ================= 考生数据分析 =============== */
const DataAnalysis = (props) => {
  const { dispatch,numberDescData }=props

  // const myRef = useRef(null)
  // myRef.current = () => {
  //   getExamineeData()
  // };
  useEffect(() => {
    let id = setInterval(() => {
      // myRef.current()
      getExamineeData()
    }, 8000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    getExamineeData()
  }, [])

  // 考生数据分析获取数据接口
  const getExamineeData = () => {
    dispatch({
      type: 'dataAnalysis/loadExamineeData'
    }).then((res)=>{
      // drawCharts()
      drawExamineeTrainingPeriod(res?.stuTrainingCycleStatistics)
      drawWaterFallChart(res?.perdritypeStatistics)
      drawRankBarChart(res?.schNewStuNumberLeaderboard)
      drawAgePieChart(res?.ageStatistics)
      drawNewExamineeLineChart(res?.thisMonthStatistics)
    })
  }

  /** =================== 渲染部分 ====================== */
  //  考生数据分析  头部
  const renderBanner = () => {
    return (
      <Fragment>
        <div className="examinee_portal_title">
          <div className="left">当前城市: 周口市</div>
          <div className="center">智慧驾考 - 考生数据分析</div>
          <div className="right">
            <TimerClock />
            <FullScreen onFullScreenFn={() => {
              // ksrsChartInstance.resize()
              examineeTrainChartInstance.resize()
              waterFallChartInstance.resize()
              rankBarChartInstance.resize()
              agePieChartInstance.resize()
              newExamineeLineChartInstance.resize()
            }}/>
          </div>
        </div>

        {/* 横隔线图片 */}
        <div className="examinee_portal_line">
          <img src={examineePortalLine} />
        </div>
      </Fragment>
    )
  }

  // 2. 数字描述
  const renderNumberDesc = () => {
    return (
      <div className="number_desc_container">
        <div className="left">
          <div className="top">本地区累计考生人数(人)</div>
          <div className="bottom">{100 || numberDescData?.stuAmount}</div>
        </div>
        <div className="second">
          <div className="top">本地区持证发证数量(本)</div>
          <div className="bottom">{200 || numberDescData?.issuanceAmount}</div>
        </div>
        <div className="third">
          <div className="top">考生通过率</div>
          <div className="bottom">{'99%' || numberDescData?.stuPassRate}</div>
        </div>
        <div className="right">
          <div className="top">平均领证周期</div>
          <div className="bottom">{35 || numberDescData?.averageLicensingPeriod}天</div>
        </div>
      </div>
    )
  }

  // 考生数据分析 图表部分
  const renderDataBody = () => {
    return (
      <div className="examinee_charts_container">
        <div className="top">
          <div className="left">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="broken_line_chart_title">
              <span>考生培训周期</span>
            </div>
            {/* <div className="title_bottom_line"></div> */}
            {/* 折线图的容器 */}
            <div id="examineeTrainingPeriod" className="broken_line_chart"></div>
          </div>
          <div className="center">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="examinee_number_title">
              <span>报考车型人数</span>
            </div>
            {/* <div className="title_bottom_line"></div> */}
            {/* 瀑布图的容器 */}
            <div id="waterFallChart" className="water_fall_chart"></div>
          </div>
          <div className="right">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="new_added_examinee_rank">
              <span>驾校新增考生量排名</span>
            </div>
            {/* <div className="new_added_examinee_rank_line"></div> */}
            {/* 排名柱状图 的容器 */}
            <div id="rankBarChart" className="rank_bar_chart"></div>
          </div>
        </div>

        <div className="bottom">
          <div className="left">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="examinee_pie_chart_title">
              <span>考生年龄分布</span>
            </div>
            {/* <div className="examinee_pie_chart_line"></div> */}
            {/* 饼图图 的容器 */}
            <div id="examineePieChart" className="examinee_pie_chart"></div>
          </div>
          <div className="center">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="new_add_examinee_number_title">
              <span>新增考生数量</span>
            </div>
            {/* <div className="new_add_examinee_number_line"></div> */}
            {/* 饼图图 的容器 */}
            <div id="newExamineeLineChart" className="new_examinee_line_chart"></div>
          </div>
          <div className="right">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
           <div className="rectangle_desc">
             {/* <div className="sex_ratio">
               <div className="sex_ratio_inner">
                 <div className="bar_desc_left">
                   <div className="bar_number">
                     <span>456</span>
                   </div>
                   <div className="bar_ratio_desc">
                     <span>男性 73%</span>
                   </div>
                 </div>
                 <div className="bar_center_divider"></div>
                 <div className="bar_desc_right">
                   <div className="bar_number">
                     <span>123</span>
                   </div>
                   <div className="bar_ratio_desc">
                     <span>女性 27%</span>
                   </div>
                 </div>
               </div>
             </div> */}
             <Percentage numLeft={555} numRight={666} textLeftPercen='45%' textRightPercen='54%' textLeft='男性' textRight='女性' />
             <div className="sex_ratio_divider"></div>
             {/* <div className="certificate_type">
               <div className="sex_ratio_inner">
                 <div className="bar_desc_left">
                   <div className="bar_number">
                     <span>33212</span>
                   </div>
                   <div className="bar_ratio_desc">
                     <span>初次申领 73%</span>
                   </div>
                 </div>
                 <div className="bar_center_divider"></div>
                 <div className="bar_desc_right">
                   <div className="bar_number">
                     <span>66513</span>
                   </div>
                   <div className="bar_ratio_desc">
                     <span>增驾 27%</span>
                   </div>
                 </div>
               </div>
             </div> */}
              <Percentage numLeft={50} numRight={200} textLeftPercen='20%' textRightPercen='80%' textLeft='初次申领' textRight='增驾' />
             <div className="sex_ratio_divider"></div>
             <Percentage numLeft={50} numRight={200} textLeftPercen='20%' textRightPercen='80%' textLeft='本地生源' textRight='外地生源' />
             {/* <div className="student_origin">
               <div className="sex_ratio_inner">
                 <div className="bar_desc_left">
                   <div className="bar_number">
                     <span>32013</span>
                   </div>
                   <div className="bar_ratio_desc">
                     <span>本地生源 73%</span>
                   </div>
                 </div>
                 <div className="bar_desc_right">
                   <div className="bar_number">
                     <span>23981</span>
                   </div>
                   <div className="bar_ratio_desc">
                     <span>外地生源 27%</span>
                   </div>
                 </div>
               </div>
             </div> */}
           </div>
          </div>
        </div>
      </div>
    )
  }

  return ReactDOM.createPortal(
    <div style={examineePortalContainer} className="examinee_portal_container">
      <div className='render-wrap'>
        {/* 头部*/}
        {renderBanner()}

        {/* 数字描述*/}
        {renderNumberDesc()}

        {/* 图表部分 */}
        {renderDataBody()}
      </div>
    </div>,
    document.getElementById('root')
  )
}

export default connect(({dataAnalysis}) => ({
  numberDescData:dataAnalysis?.numberDescData,
  // stuTrainingCycleStatistics:dataAnalysis?.stuTrainingCycleStatistics, // 考生培训周期
}))(DataAnalysis)
