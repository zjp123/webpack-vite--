import React, {useEffect, useState} from 'react'
import {connect} from 'dva'
import ReactDOM from 'react-dom'
import SwiperCore, {Autoplay} from 'swiper' 
// import {Autoplay} from 'swiper' 

import examineePortalBg from '@/assets/img/leader_cap_bg.png'
import examineePortalLine from '@/assets/img/leader_cap_top_line.png'
// import {Swiper, SwiperSlide} from 'swiper/react/swiper-react'
// import '~swiper/swiper-bundle.css'
// import 'swiper/swiper.min.css'

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import * as echarts from 'echarts'
import {ChartBorder, TimerClock} from "@/components";
import FullScreen from "@/pages/LeaderScock/FullScreen";
import { isBigScreen } from "@/utils"
import './index.less'

SwiperCore.use([Autoplay])

const examineePortalContainer = {
  backgroundImage: `url(${examineePortalBg})`,
  backgroundClip: 'content-box' // 背景图片只展示content-box区域
}
// let num = 0
let kcycChartInstance: any, kctglChartInstance: any, kttglChartInstance: any,
kcartglChartInstance: any, aqytglChartInstance: any, ksrsChartInstance: any = null

const ExaminationRoomInformationAnalysis = ({dispatch, examSiteBasicData}: any) => {
  let [subjectType,setSubjectType] = useState({key:0,value:"理论"}) // 0理论,1科二，2科三
  // console.log(examSiteBasicData, 'examSiteBasicDataexamSiteBasicData')
  // useEffect(() => {
  //   getExamSiteBasicData()
  //   getLeaderboardInfoData()
  //   getExamSiteAdvancedData()
  //   // 画图
  //   return () => {
  //   }
  // }, [])
  // useEffect(() => {
  //   drawCharts(leaderboardInfoData, examSiteAdvancedData)
  // }, [leaderboardInfoData, examSiteAdvancedData])

  useEffect(() => {
    // 获取第二行5个图表数据
    getLeaderboardInfoData()
    
  }, [])

  useEffect(() => {
    getExamSiteBasicData()
    // 底部大图表
    getExamSiteAdvancedData() // 这个是借用了 swiper的 loop
  }, [subjectType])

  const getExamSiteBasicData = () => { // 获取科二科三等数据
    dispatch({
      type: 'examinationRoomInformationAnalysis/loadExamSiteBasicData',
      payload: {
        type: subjectType?.key
      }
    })
  }

  const getLeaderboardInfoData = () => {// 获取第二行图表5个数据
    dispatch({
      type: 'examinationRoomInformationAnalysis/loadLeaderboardInfoData',
      payload: {
        type: subjectType?.key
      }
    }).then(res => {
        examLimitChart(res?.leaderboardInfoData?.examLimitList)
        examSiteChart(res?.leaderboardInfoData?.examSiteList)
        examDeskChart(res?.leaderboardInfoData?.examDeskList)
    })
  }

  const getExamSiteAdvancedData = () => { // 最后一个大图表数据
    dispatch({
      type: 'examinationRoomInformationAnalysis/loadExamSiteAdvancedData',
      payload: {
        type: subjectType?.key
      }
    }).then(res => {
      ksrsChartInstance && ksrsChartInstance.dispose()
      examSiteAdvancedChart(res?.examSiteAdvancedData?.examStuNumberStatistics)

    })
  }

  // const drawCharts = (leaderboardInfoData, examSiteAdvancedData) => {
  //   const {examLimitList, examSiteList, examDeskList, examCarList, examSafetyList} = leaderboardInfoData
  //   examLimitChart(examLimitList)
  //   examSiteChart(examSiteList)
  //   examDeskChart(examDeskList)
  //   // examCarChart(examCarList)
  //   // examSafeChart(examSafetyList)
  //   examSiteAdvancedChart(examSiteAdvancedData.examStuNumberStatistics)
  // }

  // 考场异常考试数据
  const examLimitChart = (data, objDom?) => {
    // let chartDom = document.getElementById('examLimitChart')
    const chartDom = objDom || document.getElementById('examLimitChart')
    kcycChartInstance = echarts.init(chartDom)
    // let myChart = echarts.init(chartDom)
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
      barMaxWidth:20,
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
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"], // 假数据
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12
          }
        }
      },
      series: [
        {
          type: 'bar',
          // data: data && data.map(item => item.source),
          data: [10, 20, 30, 40, 50], // 假数据
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            // formatter:(data) => {
            //   return data.value + '%'
            // },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#4C3AFF'
                },
                {
                  offset: 1,
                  color: '#8174FF'
                }
              ])
            }
          }
        }
      ]
    }

    option && kcycChartInstance.setOption(option)
  }

  // 考场
  const examSiteChart = (data, objDom?) => {
    // let chartDom = document.getElementById('examSiteChart')
    const chartDom = objDom || document.getElementById('examSiteChart')
    // let myChart = echarts.init(chartDom)
    kctglChartInstance = echarts.init(chartDom)
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
      barMaxWidth:20,
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
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"], // 假数据
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12

          }
        }
      },
      series: [
        {
          type: 'bar',
          // data: data && data.map(item => item.source),
          data: [10, 20, 30, 40, 50], // 假数据
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              return data.value + '%'
            },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#CAA600'
                },
                {
                  offset: 1,
                  color: '#FFEA89'
                }
              ])
            }
          }
        }
      ]
    }

    option && kctglChartInstance.setOption(option)
  }

  // 考台
  const examDeskChart = (data, objDom?) => {
    // let chartDom = document.getElementById('examDeskChart')
    const chartDom = objDom || document.getElementById('examDeskChart')
    kttglChartInstance = echarts.init(chartDom)
    // let myChart = echarts.init(chartDom)
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
      barMaxWidth:20,
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
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"], // 假数据
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12

          }
        }
      },
      series: [
        {
          type: 'bar',
          // data: data && data.map(item => item.source),
          data: [10, 20, 30, 40, 50], // 假数据
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              return data.value + '%'
            },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#0099BA'
                },
                {
                  offset: 1,
                  color: '#66FFEE'
                }
              ])
            }
          }
        }
      ]
    }

    option && kttglChartInstance.setOption(option)
  }

  // 考车
  const examCarChart = (data, objDom?) => {
    // let chartDom = document.getElementById('examCarChart')
    // let myChart = echarts.init(chartDom)
    const chartDom = objDom || document.getElementById('examCarChart')
    kcartglChartInstance = echarts.init(chartDom)
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
      barMaxWidth:20,
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
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"], // 假数据
        // data: (num === 5 || num === 8) ? ['看看', '来了'] : ['品牌'],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12
          }
        }
      },
      series: [
        {
          type: 'bar',
          // data: data && data.map(item => item.source),
          data: [10, 20, 30, 40, 50], // 假数据
          // data: (num === 5 || num === 8) ? [50, 100] : [100],
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              return data.value + '%'
            },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#7DE842'
                },
                {
                  offset: 1,
                  color: '#D7FFC1'
                }
              ])
            }
          }
        }
      ]
    }

    option && kcartglChartInstance.setOption(option)
  }

  // 安全员
  const examSafeChart = (data, objDom?) => {
    // let chartDom = document.getElementById('examSafeChart')
    // let myChart = echarts.init(chartDom)
    const chartDom = objDom || document.getElementById('examSafeChart')
    aqytglChartInstance = echarts.init(chartDom)
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
      barMaxWidth:20,
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
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"], // 假数据
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12
          }
        }
      },
      series: [
        {
          type: 'bar',
          // data: data && data.map(item => item.source),
          data: [10, 20, 30, 40, 50], // 假数据
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              return data.value + '%'
            },
            color: '#fff'
          },
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#3DD3FF'
                },
                {
                  offset: 1,
                  color: '#84E3FF'
                }
              ])
            }
          }
        }
      ]
    }

    option && aqytglChartInstance.setOption(option)
  }

  // 人数
  const examSiteAdvancedChart = (data) => {
    let chartDom = document.getElementById('examSiteAdvancedChart')
    // let myChart = echarts.init(chartDom)
    ksrsChartInstance = echarts.init(chartDom)
    let option

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        textStyle:{
          color:"#ffffff",
          fontSize: isBigScreen() ? 15 : 14
        }
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true
      },
      barMaxWidth:20,
      xAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(186, 223, 255, 1)',  //更改坐标轴文字颜色
            fontSize: isBigScreen() ? 15 : 14
            // fontSize : 14      //更改坐标轴文字大小
          }
        },
        axisLine:{
          lineStyle:{
            color:'rgba(0, 59, 138, 1)' //更改坐标轴颜色
          }
        },
        axisTick: {
          // show: false,
          alignWithLabel: true
        },
        boundaryGap: true,
        // data: data && data.map(item => item.date)
        data: ['2012', '2013', '2014', '2015', '2016']
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle:{
            color: ['rgba(0, 59, 138, 1)'],
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(186, 223, 255, 1)',  //更改坐标轴文字颜色
            fontSize: isBigScreen() ? 15 : 14
            // fontSize : 14      //更改坐标轴文字大小
          }
        },
        axisLine:{
          lineStyle:{
            color:'rgba(0, 59, 138, 1)' //更改坐标轴颜色
          }
        },
      },
      series: [
        {
          name: '考试人数',
          // data: data && data.map(item => item.testedStuNumber),
          data: [220, 182, 191, 234, 1000],
          type: 'bar',
          barWidth : isBigScreen() ? 15 : 10,
          itemStyle: {
            normal: {
              barBorderRadius: isBigScreen() ? [8, 8, 0, 0] :[5, 5, 0, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#93E7FF'
                },
                {
                  offset: 1,
                  color: '#2CD0FF'
                }
              ])
            }
          }
        },
        {
          name: '考试预约申请人数',
          // data: data && data.map(item => item.examReserveStuNumber),
          data: [150, 232, 201, 154, 190],
          type: 'bar',
          barWidth : isBigScreen() ? 15 : 10,
          itemStyle: {
            normal: {
              barBorderRadius: isBigScreen() ? [8, 8, 0, 0] :[5, 5, 0, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#AAFFA2'
                },
                {
                  offset: 1,
                  color: '#63C75A'
                }
              ])
            }
          }
        },
        {
          name: '考试计划人数',
          // data: data && data.map(item => item.examReserveStuNumber),
          data: [150, 232, 201, 154, 190],
          type: 'bar',
          barWidth : isBigScreen() ? 15 : 10,
          itemStyle: {
            normal: {
              barBorderRadius: isBigScreen() ? [8, 8, 0, 0] :[5, 5, 0, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFDE96'
                },
                {
                  offset: 1,
                  color: '#F3C152'
                }
              ])
            }
          }
        }
      ]
    }

    option && ksrsChartInstance.setOption(option)
  }
  return ReactDOM.createPortal(
    <div id="examination_room_information_analysis" style={examineePortalContainer}>
      <div className='flex-box'>

        {/* 考生数据分析  头部*/}
        <div className="examination_room_information_analysis_title">
          <div className="examination_room_information_analysis_title_left">当前城市：周口市</div>
          <div className="examination_room_information_analysis_title_middle">智慧驾考-考场数据分析</div>
          <div className="examination_room_information_analysis_title_right">
            <span className="examination_room_information_analysis_title_right_time"><TimerClock/></span>
            <FullScreen  onFullScreenFn={() => {
              // setTimeout(() => {
              //   const ele = document.getElementById('examSiteAdvancedChart')
              //   console.log(ksrsChartInstance, ele.offsetHeight, '..........PPPPP')
              //   ksrsChartInstance.resize()
              // }, 1000)
              // ksrsChartInstance.resize()
              kcycChartInstance && kcycChartInstance.resize()
              ksrsChartInstance && ksrsChartInstance.resize()
              kctglChartInstance && kctglChartInstance.resize()
              kttglChartInstance && kttglChartInstance.resize()
              kcartglChartInstance && kcartglChartInstance.resize()
              aqytglChartInstance && aqytglChartInstance.resize()
            }}/>
          </div>
        </div>
        {/* 横隔线图片 */}
        <div className="examination_room_information_analysis_line">
          <img src={examineePortalLine}/>
        </div>
        <div className="swiper_box">
          <Swiper 
            // modules={[Autoplay]} // modules是7以上才有的
            spaceBetween={10} 
            slidesPerView={1} 
            autoplay={{delay: 8000}} 
            loop
            onSlideChange={(swiper) => {
              // console.log(swiper.activeIndex, 'pppppp')
              // console.log('slide change', swiper, swiper.activeIndex)

              if (swiper.activeIndex === 2) {
                setSubjectType({key:1,value:"科二"})
                // getExamSiteBasicData()

              }
              if (swiper.activeIndex === 3) {
                setSubjectType({key:2,value:"科三"})
                // getExamSiteBasicData()
    
              }
              if (swiper.activeIndex === 4) {
                setSubjectType({key:0,value:"理论"})
                // getExamSiteBasicData()
              }
    
    
            }}
            >
            {/* {examSiteBasicData && examSiteBasicData.map((item: any, index) => { */}
            {[1, 2, 3].map((item: any, index) => {
              return (
                <SwiperSlide key={item}>
                  <div className="desc-box">
                    <div className="examSiteType">{index === 0 ? '理论考场' : index === 1 ? '科二考场' : index === 2 ? '科三考场' : ''}</div>
                    <div className="content">
                      <div className="examSiteAmount">
                        <span className="title">考试数量</span>
                        <span className="data">{(100 + index) || examSiteBasicData[index]?.examSiteAmount}</span>
                      </div>
                      <div className="siteDeviceCount">
                        <span className="title">考台数量</span>
                        <span className="data">{(100 + index) || examSiteBasicData[index]?.siteDeviceCount || 0}</span>
                      </div>
                      <div className="stuPassRate">
                        <span className="title">考生通过率</span>
                        <span className="data">{'90%' || examSiteBasicData[index]?.stuPassRate || 0}</span>
                      </div>
                      <div className="avgExamTime">
                        <span className="title">平均考试时长</span>
                        <span className="data">{(100 + index) || examSiteBasicData[index]?.avgExamTime || 0}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
              {/* <SwiperSlide>
                  <div className="desc-box">
                    <div className="examSiteType">理论考场</div>
                    <div className="content">
                      <div className="examSiteAmount">
                        <span className="title">考试数量</span>
                        <span className="data">100</span>
                      </div>
                      <div className="siteDeviceCount">
                        <span className="title">考台数量</span>
                        <span className="data">100</span>
                      </div>
                      <div className="stuPassRate">
                        <span className="title">考生通过率</span>
                        <span className="data">100</span>
                      </div>
                      <div className="avgExamTime">
                        <span className="title">平均考试时长</span>
                        <span className="data">100</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="desc-box">
                    <div className="examSiteType">科二考场</div>
                    <div className="content">
                      <div className="examSiteAmount">
                        <span className="title">考试数量</span>
                        <span className="data">102</span>
                      </div>
                      <div className="siteDeviceCount">
                        <span className="title">考台数量</span>
                        <span className="data">102</span>
                      </div>
                      <div className="stuPassRate">
                        <span className="title">考生通过率</span>
                        <span className="data">102</span>
                      </div>
                      <div className="avgExamTime">
                        <span className="title">平均考试时长</span>
                        <span className="data">102</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="desc-box">
                    <div className="examSiteType">科三考场</div>
                    <div className="content">
                      <div className="examSiteAmount">
                        <span className="title">考试数量</span>
                        <span className="data">103</span>
                      </div>
                      <div className="siteDeviceCount">
                        <span className="title">考台数量</span>
                        <span className="data">103</span>
                      </div>
                      <div className="stuPassRate">
                        <span className="title">考生通过率</span>
                        <span className="data">103</span>
                      </div>
                      <div className="avgExamTime">
                        <span className="title">平均考试时长</span>
                        <span className="data">103</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide> */}
          </Swiper>

        </div>
        {/* <div className='reset-space'> */}
        <div className="row2">
          <Swiper 
          // modules={[Autoplay]} 
          spaceBetween={50} 
          slidesPerView={1}
          // className="swiper_wrap" 
          autoplay={{delay: 8000}}
          loop
          onSlideChange={(swiper) => {
              // num ++ 
              // console.log(swiper.activeIndex, 'pppppp')
              if (swiper.activeIndex === 3) { // 第三行
                // 
                let activeSwiperEchartBox = swiper.$el[0]
                let nextSwipeBox: any = activeSwiperEchartBox.getElementsByClassName('swiper-slide-next')[0]
                // let objDom = null
                let kcycDom = nextSwipeBox.getElementsByClassName('kcyc-chart')[0]
                let kctglDom = nextSwipeBox.getElementsByClassName('kctgl-chart')[0]
                let kttglDom = nextSwipeBox.getElementsByClassName('kttgl-chart')[0]
                kcycChartInstance && kcycChartInstance.dispose()
                kctglChartInstance && kctglChartInstance.dispose()
                kttglChartInstance && kttglChartInstance.dispose()
                dispatch({
                  type: 'examinationRoomInformationAnalysis/loadLeaderboardInfoData'
                }).then(res => {
                  
                  examLimitChart(res?.leaderboardInfoData?.examLimitList, kcycDom)
                  examSiteChart(res?.leaderboardInfoData?.examSiteList, kctglDom)
                  examDeskChart(res?.leaderboardInfoData?.examDeskList, kttglDom)
                
                })
              } 
              if (swiper.activeIndex === 2) {
                kcartglChartInstance && kcartglChartInstance.dispose()
                aqytglChartInstance && aqytglChartInstance.dispose()

                let activeSwiperEchartBox = swiper.$el[0]
                let nextSwipeBox: any = activeSwiperEchartBox.getElementsByClassName('swiper-slide-next')[0]
                let kcartglDom = nextSwipeBox.getElementsByClassName('kcartgl-chart')[0]
                let aqytglDom = nextSwipeBox.getElementsByClassName('aqytgl-chart')[0]
                // console.log(kcartglChartInstance, aqytglChartInstance, 'swiperswiperswiper')
                // debugger

                dispatch({
                  type: 'examinationRoomInformationAnalysis/loadLeaderboardInfoData'
                }).then(res => {
                  // console.log(res, num, 'lkklllllll')
                  examCarChart(res?.leaderboardInfoData?.examCarList, kcartglDom)
                  examSafeChart(res?.leaderboardInfoData?.examSafetyList, aqytglDom)
                
                })
              }
          } }
          >
            <SwiperSlide>
              <div className='bottom-container'>
                <ChartBorder title="考场异常考试数据" className='kcyc-border'>
                  <div className='flex-reset'>
                    <div id='examLimitChart' className="chart kcyc-chart"></div>
                  </div>
                </ChartBorder>
                <ChartBorder title="考场通过率排行榜" className='kctgl-border'>
                  <div className='flex-reset'>
                    <div id="examSiteChart" className="chart kctgl-chart"></div>
                  </div>
                </ChartBorder>
                <ChartBorder title="考台通过率排行榜" className='kttgl-border'>
                  <div className='flex-reset'>
                    <div id="examDeskChart" className="chart kttgl-chart"></div>
                  </div>
                </ChartBorder>
              </div>
            </SwiperSlide>
            {/* <SwiperSlide className="second">
              
            </SwiperSlide>
            <SwiperSlide className="second">
              
            </SwiperSlide> */}
            <SwiperSlide>
              <div className='bottom-container'>
                <ChartBorder title="考车通过率排行榜" className='kcartgl-border'>
                    <div className='flex-reset'>
                      <div id="examCarChart" className="chart kcartgl-chart"></div>
                    </div>
                </ChartBorder>
                <ChartBorder title="安全员通过率排行榜" className='aqytgl-border'>
                    <div className='flex-reset'>
                      <div id="examSafeChart" className="chart aqytgl-chart"></div>
                    </div>
                </ChartBorder>
              </div>
            </SwiperSlide>
            {/* <SwiperSlide className="second">
              
            </SwiperSlide> */}
          </Swiper>
        </div>
        <div className="third">
          <ChartBorder className='examSiteAdvancedChart-class' title='考试人数'>
            <div className='flex-reset'>
              <div id="examSiteAdvancedChart"></div>
            </div>
          </ChartBorder>
        </div>
        {/* </div> */}
      </div>
    </div>,
    document.getElementById('root')
  )
}

export default connect(({examinationRoomInformationAnalysis}) => ({
  examSiteBasicData: examinationRoomInformationAnalysis.examSiteBasicData,
  // leaderboardInfoData: examinationRoomInformationAnalysis.leaderboardInfoData,
  // examSiteAdvancedData: examinationRoomInformationAnalysis.examSiteAdvancedData
}))(ExaminationRoomInformationAnalysis)
