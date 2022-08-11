import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import ReactDOM from 'react-dom'
import './index.less'
import examineePortalBg from '@/assets/img/leader_cap_bg.png'
import * as echarts from 'echarts'
import {ChartBorder, TimerClock} from "@/components";
import examineePortalLine from "@/assets/img/leader_cap_top_line.png";
// import {Swiper, SwiperSlide} from "swiper/react/swiper-react";
// import '~swiper/swiper-bundle.css'
// import 'swiper/swiper.min.css'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import {Autoplay} from "swiper";

import {changeEChartsLegendLine, changeExamEChartsLegendLine} from "@/utils/publicFunc";
import FullScreen from "@/pages/LeaderScock/FullScreen";

// 定时器指针
let changeLegendLineTimer
let changeExamLegendTimer

const examineePortalContainer = {
  backgroundImage: `url(${examineePortalBg})`,
  backgroundClip: 'content-box' // 背景图片只展示content-box区域
}

const DrivingDetails = ({dispatch, match, detailTop, detailBottom}) => {
  let [period, setPeriod] = useState({key: 0, value: "本日"}) // 0本日,1本周,2本月,3本年
  let [subject, setSubject] = useState({key: 0, value: "全部"}) // 0全部1科目一2科目二3科目三4科目三理论5各车型约考总人数
  let [exam, setExam] = useState({key: 0, value: "全部"})
  const {id, schoolName} = match?.params
  const {
    annualNewRegistrations,
    archivesAmount,
    certifiedStuAmount,
    examPassRate,
    studentAmount,
    undocumentedStuAmount,
    yearlySignUpGrowthRate
  } = detailTop
  const {schStuExamPreasign, abnormalBusinessSituation, dailyRegistrationNumber} = detailBottom

  useEffect(() => {
    getData()
    drawSituationAnalysis()
    // 中层
    getExaminationMiddleVehicleData()
    return () => {
      clearInterval(changeLegendLineTimer)
      clearInterval(changeExamLegendTimer)
    }
  }, [])
  useEffect(() => {
    drawSevenDat(dailyRegistrationNumber)
    drawPieChart(schStuExamPreasign)
  }, [detailBottom])

  const getData = () => {
    getTopData()
    getBottomData()
  }

  const getTopData = () => {
    dispatch({
      type: 'drivingDetails/loadSchoolDataAnalysisDetailTop',
      payload: {schId: id}
    })
  }

  const getBottomData = () => {
    dispatch({
      type: 'drivingDetails/loadSchoolDataAnalysisBottomTop',
      payload: {schId: id}
    })
  }

  const drawSituationAnalysis = () => {
    const chartDom = document.getElementById('situationAnalysis')
    const myChart = echarts.init(chartDom)
    let option
    option = {
      color: ['#F7D648'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ["啊啊"],
        textStyle: {
          color: '#ccc'
        },
        icon: 'bar',
        itemWidth: 20,
        itemHeight: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            }
          }
        }
      ],
      series: [
        {
          name: '啊啊',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 1
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(247, 214, 72, 0)'
              },
              {
                offset: 1,
                color: 'rgba(247, 214, 72, 0.2)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: [140, 232, 101, 264, 90, 340, 250]
        }
      ]
    }

    option && myChart.setOption(option)
  }

  const drawPieChart = (data) => {
    const chartDom = document.getElementById('pieChart')
    const myChart = echarts.init(chartDom)
    let option
    option = {
      backgroundColor: 'transparent',
      title: {
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            {value: data && data[0]?.examStuNumber, name: '科一', itemStyle: {color: '#cf92f5'}},
            {value: data && data[1]?.examStuNumber, name: '科二', itemStyle: {color: '#95b7f9'}},
            {value: data && data[2]?.examStuNumber, name: '科三', itemStyle: {color: '#fae34c'}},
            {value: data && data[3]?.examStuNumber, name: '科四', itemStyle: {color: '#77dcbc'}},
          ].sort(function (a, b) {
            return a.value - b.value;
          }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
    option && myChart.setOption(option)
  }

  const drawSevenDat = (data) => {
    let chartDom = document.getElementById('sevenDay')
    let myChart = echarts.init(chartDom)
    console.log(data)
    let option
    option = {
      color: ['#6600FF'],
      xAxis: {
        type: 'category',
        data: data && data.map(item => item.date),
        axisLabel: {
          textStyle: {
            color: '#ffffff'
          }
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff'
          }
        }
      },
      series: [
        {
          data: data && data.map(item => item.registrationNumber),
          type: 'line',
          lineStyle: {
            width: 1
          },
          itemStyle: {normal: {label: {show: true, color: "#FFFFFF"}}},
          showSymbol: true,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(161, 0, 255, 0)'
              },
              {
                offset: 1,
                color: 'rgba(227, 179, 255, 0.2)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    }

    option && myChart.setOption(option)
  }

  const drawExaminationInformationAnalysis = (exam) => {
    const chartDom = document.getElementById('situationAnalysis')
    const myChart = echarts.init(chartDom)
    let option
    // series 的 每一项对象
    const seriesItem = {
      stack: '人数',
      smooth: true,
      lineStyle: {
        width: 1
      },
      showSymbol: true,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'top', //在上方显示
            textStyle: {     //数值样式
              color: '#FFFFFF',
              fontSize: 16
            }
          },
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(29, 223, 201, 1)'
            },
            {
              offset: 1,
              color: 'rgba(126, 255, 240, 1)'
            }
          ])
        }
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(247, 214, 72, 0)'
          },
          {
            offset: 1,
            color: 'rgba(247, 214, 72, 0.2)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
    }
    const getVehicleTypeSeries = (series) => {
      const newSeries = series?.map((item) => ({
        ...seriesItem,
        ...item,
      }))
      return newSeries
    }
    // 获取legend值
    const getLegendData = () => {
      return exam?.legendData
    }
    // 动态切换图例
    changeExamEChartsLegendLine(myChart, changeExamLegendTimer, 5000)
    option = {
      color: ['#F7D648'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: getLegendData(),
        left: "3%",
        textStyle: {
          color: '#ccc'
        },
        selectedMode: "single", // 只显示一条 线
        icon: 'bar',
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 20,
        padding: 15, // legend 边距
        // inactiveColor: "#49e8d6",  //选中状态的颜色
      },
      grid: {
        top: "15%",
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true, // 距离坐标轴距离
          data: exam?.xAxis?.data,
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            }
          }
        }
      ],
      series: getVehicleTypeSeries(exam?.series)
    }
    option && myChart.setOption(option)
  }

  const drawEachCarTypeNumber = (subject) => {
    const chartDom = document.getElementById('eachCarTypeNumber')
    const myChart = echarts.init(chartDom)
    let option
    // series 的 每一项对象
    const seriesItem = {
      stack: '人数',
      smooth: true,
      lineStyle: {
        width: 1,
        color: 'rgba(247, 214, 72, 1)'
      },
      showSymbol: true,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'top', //在上方显示
            textStyle: {     //数值样式
              color: '#FFFFFF',
              fontSize: 16
            }
          },
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(29, 223, 201, 1)'
            },
            {
              offset: 1,
              color: 'rgba(126, 255, 240, 1)'
            }
          ])
        }
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(247, 214, 72, 0)'
          },
          {
            offset: 1,
            color: 'rgba(247, 214, 72, 0.2)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
    }
    const getVehicleTypeSeries = (series) => {
      const newSeries = series?.map((item) => ({
        ...seriesItem,
        ...item,
      }))
      return newSeries
    }
    // 获取legend值
    const getLegendData = () => {
      return subject?.legendData
    }
    // 动态切换图例
    changeEChartsLegendLine(myChart, changeLegendLineTimer, 5000)
    option = {
      color: ['#F7D648'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: getLegendData(),
        left: "3%",
        textStyle: {
          color: '#ccc'
        },
        selectedMode: "single", // 只显示一条 线
        icon: 'bar',
        itemWidth: 20,
        itemHeight: 10,
        itemGap: 20,
        padding: 15, // legend 边距
        // inactiveColor: "#49e8d6",         //选中状态的颜色
      },
      grid: {
        top: "15%",
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true, // 距离刻度线距离
          data: subject?.xAxis?.data,
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#ffffff'
            }
          }
        }
      ],
      series: getVehicleTypeSeries(subject?.series)
    }
    option && myChart.setOption(option)
  }

  const getExaminationMiddleVehicleData = () => {
    dispatch({
      type: 'drivingDetails/loadSchoolDataAnalysisMiddleTop',
      payload: {
        // type: 3, // 年
        // type:period?.key,
        subject: subject?.key,
        exam: exam?.key,
        schId: id
      }
    }).then(res => {

      drawEachCarTypeNumber(res?.subject)

      drawExaminationInformationAnalysis(res?.exam)
    })
  }

  return ReactDOM.createPortal(
    <div id="driving_details" style={examineePortalContainer}>
      {/* 考生数据分析  头部*/}
      <div className="driving_details_title">
        <div className="driving_details_title_left">当前城市：周口市</div>
        <div className="driving_details_title_middle">{schoolName}</div>
        <div className="driving_details_title_right">
          <span className="driving_details_title_right_time"><TimerClock/></span>
          <FullScreen/>
        </div>
      </div>
      {/* 横隔线图片 */}
      <div className="driving_details_line">
        <img src={examineePortalLine}/>
      </div>
      <div className="swiper_box">
        <Swiper modules={[Autoplay]} spaceBetween={50} slidesPerView={4} autoplay={{delay: 3000}} loop>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">累计学员数</span>
                <span className="data">{studentAmount}</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">电子档案人数</span>
                <span className="data">{archivesAmount}</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">在考人数</span>
                <span className="data">{undocumentedStuAmount}</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">通过率</span>
                <span className="data">{examPassRate}</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">年新增报名量</span>
                <span className="data">{annualNewRegistrations}</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">年报名增长率</span>
                <span className="data">{yearlySignUpGrowthRate}</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="content">
              <div>
                <span className="title">持证人数</span>
                <span className="data">{certifiedStuAmount}</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="first">
        <ChartBorder className='eachCarTypeNumber' title="报考车型人数">
          <div id="eachCarTypeNumber" className="chart"></div>
        </ChartBorder>
        <ChartBorder className='situationAnalysis' title="考试情况分析">
          <div id="situationAnalysis" className="chart"></div>
        </ChartBorder>
      </div>
      <div className='swiper_box'>
        <Swiper className='chartSwiper' modules={[Autoplay]} spaceBetween={10} slidesPerView={3}
                autoplay={{delay: 3000}}>
          <SwiperSlide>
            <ChartBorder className='tong_ji' title="各科目考试人数统计">
              <div className="left">
                <div className="heng"></div>
                <div className="shu"></div>
                {
                  schStuExamPreasign && schStuExamPreasign.map(item => {
                    return (
                      <div className='ct'>
                        <div className='con_1'>{item.subject}</div>
                        <div className='con_2'>预约人数<span className='num'>{item.examStuNumber}</span>人</div>
                        <div className='con_2'>考试人数<span className='num'>{item.preasignStuNumber}</span>人</div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="right">
                <div id="pieChart" className='chart'></div>
              </div>
            </ChartBorder>
          </SwiperSlide>
          <SwiperSlide>
            <ChartBorder className='ren_shu' title="学员异常业务情况">
              <div>
                <span>驾校学员累计欠费</span>
                <span>{abnormalBusinessSituation?.stuAccumulatedArrears}<span>元</span></span>
              </div>
              <div>
                <span>驾校学员欠费人数</span>
                <span>{abnormalBusinessSituation?.stuArrearsNumber}<span>人</span></span>
              </div>
              <div>
                <span>电子档案异常</span>
                <span>{abnormalBusinessSituation?.abnormalArchivesNumber}</span>
              </div>
              <div>
                <span>电子档案缺失补录</span>
                <span>{abnormalBusinessSituation?.archivesMakeUpNumber}</span>
              </div>
              <div>
                <span>未签名成绩单数</span>
                <span>{abnormalBusinessSituation?.unsignedTranscriptNumber}</span>
              </div>
              <div>
                <span>人相对比异常数</span>
                <span>{abnormalBusinessSituation?.portraitContrastAbnormalNumber}</span>
              </div>
            </ChartBorder>
          </SwiperSlide>
          <SwiperSlide>
            <ChartBorder title="近7日报名情况">
              <div id="sevenDay" className='chart'></div>
            </ChartBorder>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>,
    document.getElementById('root')
  )
}
export default connect(({drivingDetails}) => ({
  area: drivingDetails?.area,
  contrast: drivingDetails?.contrast,
  detailTop: drivingDetails?.detailTop,
  detailBottom: drivingDetails?.detailBottom,
}))(DrivingDetails)
