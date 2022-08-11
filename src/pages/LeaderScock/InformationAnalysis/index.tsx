import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import ReactDOM from 'react-dom'
import './index.less'
import examineePortalBg from '@/assets/img/leader_cap_bg.png'
import examineePortalLine from '@/assets/img/leader_cap_top_line.png'
import map from '@/assets/img/map.png'
import xuanzhong from "@/assets/img/xuanzhong.png"
import weixuanzhong from "@/assets/img/weixuanzhong.png"
import * as echarts from 'echarts'
import {ChartBorder, TimerClock} from "@/components";
import { isBigScreen } from "@/utils"
import FullScreen from "@/pages/LeaderScock/FullScreen";
import {pointLocation} from "@/pages/LeaderScock/InformationAnalysis/utils";

const examineePortalContainer = {
  backgroundSize: '100% 100%',
  backgroundImage: `url(${examineePortalBg})`,
  backgroundClip: 'content-box', // 背景图片只展示content-box区域
}

let jxtglChartInstance, jxpxzqChartInstance = null;

const InformationAnalysis = ({dispatch, loadSchoolData}) => {
  const [point, setPoint] = useState("")
  const [coordinate, setCoordinate] = useState({})
  const {abnormalArchivesAmount, archivesAmount, examSiteAmount, schPassRateLeaderboard, schTrainingCycleLeaderboard, schoolAmount, schoolInfoList} = loadSchoolData
  const [showPoint, setShowPoint] = useState(false)
  const [pointData, setPointData] = useState({})
  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    passRate(schPassRateLeaderboard)
    periodOfTraining(schTrainingCycleLeaderboard)
  }, [loadSchoolData])

  // 初始化扎点弹框数据
  useEffect(() => {
    setPointData(point && schoolInfoList.find(item => item.schoolName === point))
  }, [point])

  const getData = () => {
    dispatch({
      type: "informationAnalysis/loadSchoolDataAnalysis"
    })
  }

  // 扎点
  const Point = ({schoolName}) => {
    return (
      <img
           className='pointCss'
           src={point === schoolName ? xuanzhong : weixuanzhong}
           alt=""
           style={(pointLocation.find(item => item.schoolName === schoolName) as any)?.location}
           onClick={(e) => {
             setPoint(schoolName);
             setShowPoint(true)
             setCoordinate({x: e.clientX, y: e.clientY})
           }
           } />
    )
  }
  // 扎点弹框
  const PointContent = () => {
    const {schoolName, stuAmount, perdritypes, examPassRate, schId} = pointData as any
    const {x, y} = coordinate as any
    return (
      <div
        id="point-content"
        className='point-content'
        style={{
          top: y,
          left: x,
          display: showPoint ? 'block' : "none"
        }}>
        <div className="point-title" onClick={() => window.open('/#/leaderscock/drivingdetails/'+schId+'/'+schoolName)}>{schoolName}＞</div>
        <p>学员数量：{stuAmount}</p>
        <p>可培训车型：{perdritypes}</p>
        <p>考试通过率：{examPassRate}</p>
        <span className="sanjian" />
      </div>
    )
  }

  // 驾校通过率排行榜
  const passRate = (data) => {
    // let chartDom = document.getElementById('pass-rate')
    // let myChart = echarts.init(chartDom)

    jxtglChartInstance && jxtglChartInstance.clear()
    jxtglChartInstance = echarts.getInstanceByDom(document.getElementById('pass-rate')); //有的话就获取已有echarts实例的DOM节点。
    if (jxtglChartInstance == null) { // 如果不存在，就进行初始化。
      jxtglChartInstance = echarts.init(document.getElementById('pass-rate'))
    }

    let option

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '5%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        show: false,
        axisLabel: {
          textStyle: {
            fontSize: isBigScreen() ? 15 : 12,
            color: '#ffffff'
          }
        }
      },
      yAxis: {
        type: 'category',
        // data: data && data.map(item => item.name),
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            fontSize: isBigScreen() ? 15 : 12,
            color: '#ffffff'
          }
        }
      },
      barMaxWidth: 15, // 柱状图宽度
      series: [
        {
          type: 'bar',
          // barWidth: 10,
          // data: data && data.map(item => item.amount),
          data: [10, 20, 30, 40, 50],
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              // return data.value + '%'
              return ([10, 20, 30, 40, 50].reduce((cur, value) => cur + value)) / data.value + '%'
            },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#66FFEE'
                },
                {
                  offset: 1,
                  color: '#0099BA'
                }
              ])
            }
          }
        }
      ]
    }

    jxtglChartInstance.setOption(option)
  }

  const periodOfTraining = (data) => {
    // let chartDom = document.getElementById('period-of-training')
    // let myChart = echarts.init(chartDom)
    jxpxzqChartInstance && jxpxzqChartInstance.clear()
    jxpxzqChartInstance = echarts.getInstanceByDom(document.getElementById('period-of-training')); //有的话就获取已有echarts实例的DOM节点。
    if (jxpxzqChartInstance == null) { // 如果不存在，就进行初始化。
      jxpxzqChartInstance = echarts.init(document.getElementById('period-of-training'))
    }
    // data = data && data.filter(item => item!=null)
    let option

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '5%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        show: false,
        axisLabel: {
          textStyle: {
            fontSize: isBigScreen() ? 15 : 12,
            color: '#ffffff',
          }
        }
      },
      yAxis: {
        type: 'category',
        // data: data && data.map(item => item.schName),
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            fontSize: isBigScreen() ? 15 : 12,
            color: '#ffffff',
          }
        }
      },
      barMaxWidth: 15, // 柱状图宽度
      series: [
        {
          type: 'bar',
          // data: data && data.map(item => item.trainingCycle),
          data: [10, 20, 30, 40, 50],
          // barWidth: 10,
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              return ([10, 20, 30, 40, 50].reduce((cur, value) => cur + value)) / data.value + '%'
            },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#00C6FF'
                },
                {
                  offset: 1,
                  color: '#0086AC'
                }
              ])
            }
          }
        }
      ]
    }

    jxpxzqChartInstance.setOption(option)
  }

  return ReactDOM.createPortal(
    <div id="information-analysis" style={examineePortalContainer} onClick={(e:any) => {
      if(showPoint && e.target.className !== 'pointCss') {
        setCoordinate({})
        setShowPoint(false)
        setPoint("")
      }
    }}>
      <div className='level-wrap'>
        <div className="information_portal_title">
          <div className="information_portal_title_left">当前城市：周口市</div>
          <div className="information_portal_title_middle">智慧驾考-驾校数据分析</div>
          <div className="information_portal_title_right">
            <span className="information_portal_title_right_time"><TimerClock/></span>
            <FullScreen  onFullScreenFn={() => {
                  // console.log(ksqkfxChartInstance.resize, '..........PPPPP')
                  jxtglChartInstance && jxtglChartInstance.resize()
                  jxpxzqChartInstance && jxpxzqChartInstance.resize()
                }}
            />
          </div>
        </div>
        <div className="information_portal_line">
          <img src={examineePortalLine}/>
        </div>
        <div className="content">
          <div className="examSiteAmount">
            <span className="title">驾校数量</span>
            <span className="data">{schoolAmount}</span>
          </div>
          <div className="siteDeviceCount">
            <span className="title">考场数量</span>
            <span className="data">{examSiteAmount}</span>
          </div>
          <div className="stuPassRate">
            <span className="title">电子档案数</span>
            <span className="data">{archivesAmount}</span>
          </div>
          <div className="avgExamTime">
            <span className="title">异常档案数</span>
            <span className="data">{abnormalArchivesAmount}</span>
          </div>
        </div>
        <div className="charts">
          <div className="map" id="map">
            <div className='border-left-top border'></div>
            <div className='border-right-top border'></div>
            <div className='border-left-bottom border'></div>
            <div className='border-right-bottom border'></div>
            {/*<Point id='dujiang' schoolName="铜陵市世源驾驶员培训学校" />*/}
            {schoolInfoList && schoolInfoList.map(item => {
              const flag = pointLocation.find(i => i.schoolName === item.schoolName)
              return flag && <Point schoolName={flag.schoolName} />
            })}
            <img id='map' src={map} alt=""/>
            <PointContent />
          </div>
          <div className="echarts">
            <ChartBorder className='pass-rate' title='驾校通过率排行榜'>
              <div id="pass-rate" className="chart"></div>
            </ChartBorder>
            <ChartBorder className='period-of-training' title='驾校培训周期排行榜'>
              <div id="period-of-training" className="chart"></div>
            </ChartBorder>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('root')
  )
}
export default connect(({informationAnalysis}) => ({
  loadSchoolData: informationAnalysis.loadSchoolData
}))(InformationAnalysis)
