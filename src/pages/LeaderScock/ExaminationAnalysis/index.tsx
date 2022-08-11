import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'dva'
import ReactDOM from 'react-dom'
import './index.less'
import { TimerClock,DirectionTriangle } from '@/components'
import examineePortalBg from '@/assets/img/leader_cap_bg.png'
import examineePortalLine from '@/assets/img/leader_cap_top_line.png'
// import '~swiper/swiper-bundle.css'
// import 'swiper/swiper.min.css'
// import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import * as echarts from 'echarts'
import { changeEChartsLegendLine, changeExamEChartsLegendLine } from "@/utils/publicFunc"
import { isBigScreen } from "@/utils"
// import { Autoplay} from "swiper"
import SwiperCore, {Autoplay} from 'swiper' 
import FullScreen from "@/pages/LeaderScock/FullScreen";

SwiperCore.use([Autoplay])


const examineePortalContainer = {
  backgroundImage: `url(${examineePortalBg})`,
  backgroundClip: 'content-box' // 背景图片只展示content-box区域
}

let examinationStageNumberChartInstance, arrearageInformationChartInstance, examinationFullScoreNumberChartInstance,
    jxtglChartInstance, kctglChartInstance = null

let ksqkfxChartInstance, gcxgkmChartInstance = null

// 定时器指针
let loadDataTimer
let changeLegendLineTimer
let changeExamLegendTimer
const delayDuration = 8000 // swiper播放 时间延迟, 要与数据接口保持一致

/** ================= 考试数据分析 =============== */
const ExaminationAnalysis = ({ dispatch,area,contrast,arrears }) => {
  // const periodMap = [{key:0,value:"本日"},{key:1,value:"本周"},{key:2,value:"本月"},{key:3,value:"本年"}]
  // const subjectMap = [{key:0,value:"全部"},{key:1,value:"科目一"},{key:2,value:"科目二"},{key:3,value:"科目三"},{key:4,value:"科目三理论"},{key:5,value:"各车型约考总人数"}]
  // const sxamMap = [{key:0,value:"全部"},{key:1,value:"未通过人数"},{key:2,value:"通过未签字人数"},{key:3,value:"满分人数"},{key:4,value:"通过人数"},{key:5,value:"参加考试人数"}]
  let [period,setPeriod] = useState({key:0,value:"本日"}) // 0本日,1本周,2本月,3本年
  // let [period,setPeriod] = useState(0) // 0本日,1本周,2本月,3本年
  // let [subject,setSubject] = useState({key:0,value:"全部"}) // 0全部 1 科目一 2 科目二 3 科目三 4 科目三理论 5 各车型约考总人数
  // let [exam,setExam] = useState({key:0,value:"全部"}) // 考试情况数据类型 0 全部 1 未通过人数 2 通过未签字人数 3 满分人数 4 通过人数 5 参加考试人数

  // let itemIndex=0
  useEffect(() => {
    // loadDataTimer && clearInterval(loadDataTimer)
    // loadDataTimer = setInterval(()=>{
    //   getExaminationMiddleVehicleData()
    // },delayDuration)
    // getData()
    // 获取中部 各车型数据
    getExaminationMiddleVehicleData()
    // 获取底部排行榜数据
    getExaminationBottomRankingData()
    return () => {
      clearInterval(loadDataTimer)
      clearInterval(changeLegendLineTimer)
      clearInterval(changeExamLegendTimer)
    }
  }, [])

  useEffect(() => {
    getData()
  }, [period])

  const getData = ()=>{
    getExaminationTopCompareData(period)
  }

  // 1. 获取考试信息分析数据 顶部对比数据
  const getExaminationTopCompareData = (period) => {
    dispatch({
      type: 'examinationAnalysis/loadTopCompareData',
      payload: {
        type: period?.key
      }
    })
  }

  // 2. 中部各车型接口
  const getExaminationMiddleVehicleData = () => {
    dispatch({
      type: 'examinationAnalysis/loadMiddleVehicleData',
      payload: {
        type:3, // 年
        // subject:subject?.key,
        subject:0,
        // exam:exam?.key,
        exam:0,
      }
    }).then(res => {
      // 各车型各科目预约人数 ---第二行
      drawEachCarTypeNumber(res?.subject)
      // 考试情况分析--第二行
      drawExaminationInformationAnalysis(res?.exam)
    })
  }

  // 3. 底部排行榜数据
  const getExaminationBottomRankingData = ()=>{
    // dispatch({
    //   type: 'examinationAnalysis/loadBottomRankingData',
    //   payload: {
    //     type:period?.key,
    //   }
    // }).then(res => {
    //   drawExaminationStageNumber(res?.subject) // --第三行 考试阶段
    //   drawArrearageInformation(res?.arrears) // --第三行 欠费情况
    //   drawExaminationFullScoreNumber(res?.fullScore)// 考场满分人数占比--第三行
    // })
    drawExaminationStageNumber({}) // --第三行 考试阶段
    drawArrearageInformation({}) // --第三行 欠费情况
    drawExaminationFullScoreNumber({})// 考场满分人数占比--第三行
  }

  // 1. 各车型各科目预约人数
  const drawEachCarTypeNumber = (subject) => {
    const chartDom = document.getElementById('eachCarTypeNumber')
    gcxgkmChartInstance = echarts.init(chartDom)
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
          label : {
            show: true,
            position: isBigScreen() ? 'top' : 'insideTop', //在上方显示
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
    const getVehicleTypeSeries = (series)=>{
      const newSeries = series?.map((item)=>({
        ...seriesItem,
        ...item,
        data: new Array(17).fill(100), // 造假数据
        type: item.name === '各车型约考总人数' ? 'line' : 'bar'

      }))
      return newSeries
    }
    // 获取legend值
    const getLegendData= ()=>{
      return subject?.legendData
    }
    // 动态切换图例
    changeEChartsLegendLine(gcxgkmChartInstance,changeLegendLineTimer,delayDuration)
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
        data:  getLegendData(),
        left:"3%",
        textStyle: {
          color: '#ccc',
          fontSize: isBigScreen() ? 15 : 14,

        },
        selectedMode: "single", // 只显示一条 线
        // icon:'bar',
        itemWidth:20,
        itemHeight:10,
        itemGap: isBigScreen() ? 10 : 5,
        padding: isBigScreen() ? 10 : 5, // legend 边距
        // inactiveColor: "#49e8d6",         //选中状态的颜色
      },
      grid: {
        top:"20%",
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true, // 距离刻度线距离
          data: subject?.xAxis?.data,
          axisLabel: {
            textStyle: {
              color: '#ffffff',
              fontSize: isBigScreen() ? 15 : 12
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
              color: '#ffffff',
              fontSize: isBigScreen() ? 15 : 12
            }
          }
        }
      ],
      series: getVehicleTypeSeries(subject?.series)
    }
    option && gcxgkmChartInstance.setOption(option)
    
  }

  // 2. 考试情况分析
  const drawExaminationInformationAnalysis = (exam) => {
    const chartDom = document.getElementById('examinationInformationAnalysis')
    ksqkfxChartInstance = echarts.init(chartDom)
    let option
    // series 的 每一项对象
    const seriesItem = {
      stack: '人数',
      smooth: true,
      // type: 'line',
      lineStyle: {
        width: 1
      },
      showSymbol: true,
      itemStyle: {
        normal: {
          label : {
            show: true,
            position: isBigScreen() ? 'top' : 'insideTop', //在上方显示
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
    const getVehicleTypeSeries = (series)=>{
      const newSeries = series?.map((item)=>{
          // console.log(item, 'itemitem')
          return {
            ...seriesItem,
            ...item,
            data: new Array(17).fill(100), // 造假数据
            type: item.name === '参加考试人数' ? 'line' : 'bar'
          }
      })
      return newSeries
    }
    // 获取legend值
    const getLegendData= ()=>{
      return exam?.legendData
    }
    // 动态切换图例
    changeExamEChartsLegendLine(ksqkfxChartInstance,changeExamLegendTimer,delayDuration)
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
        left:"3%",
        textStyle: {
          color: '#ccc',
          fontSize: isBigScreen() ? 15 : 14,
        },
        selectedMode: "single", // 只显示一条 线
        // icon:'bar',
        itemWidth:20,
        itemHeight:10,
        itemGap: isBigScreen() ? 10 : 5,
        padding: isBigScreen() ? 10 : 5, // legend 边距
        // inactiveColor: "#49e8d6",  //选中状态的颜色
      },
      grid: {
        top:"20%",
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true, // 距离坐标轴距离
          data: exam?.xAxis?.data,
          axisLabel: {
            textStyle: {
              color: '#ffffff',
              fontSize: isBigScreen() ? 15 : 12
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
              fontSize: isBigScreen() ? 15 : 12,
              color: '#ffffff'
            }
          }
        }
      ],
      series: getVehicleTypeSeries(exam?.series)
    }
    option && ksqkfxChartInstance.setOption(option)
  }

  // 3. 考试阶段学员数
  const drawExaminationStageNumber = (subject, objDom?) => {
    const chartDom = objDom || document.getElementById('examinationStageNumber')
    examinationStageNumberChartInstance = echarts.init(chartDom)
    let option
    // console.log('走了吗')
    // option = {
    //   xAxis: {
    //     type: 'category',
    //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [
    //     {
    //       data: [820, 932, 901, 934, 1290, 1330, 1320],
    //       type: 'line',
    //       smooth: true
    //     }
    //   ]
    // };
    // let newData = [1, 2, 6, 4, 5]
    // option && myChart.setOption(option);
    option = {
      color: ['#6c00f9'],
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
        data: []
      },
      grid: {
        top: '9%',
        left: '3%',
        right: '4%',
        bottom: '13%',
        containLabel: true
      },
      // barMaxWidth: 20, // 柱状图宽度
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          // data: subject?.xAxis?.data,
          data: ['未考试', '科目一', '科目二', '科目三', '科目四'],
          axisLabel: {
            textStyle: {
              color: '#309EFE',
              fontSize: isBigScreen() ? 15 : 12
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
              fontSize: isBigScreen() ? 15 : 12,
              color: '#ffffff'
            }
          }
        }
      ],
      series: [
        {
          name: '学员数',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 1
          },
          endLabel: {
            show: true
          },
          symbol: 'circle',
          itemStyle: {
            normal: {
                // color: "#fff",
                borderColor: '#f58f23',
                borderWidth: 1,
                formatter: 'uu',
                label : {
                  color: "#fff",
                  formatter:function(data){ // 不能是箭头函数
                    return data.value + '人';
                  },
                  show: true // 在折线拐点上显示数据
                }
            }
          },  
          symbolSize: 6,
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
          },
          // data: subject?.series && subject?.series[0]?.data
          data: [10, 20, 60, 80, 100]
          // data: newData
        }
      ]
    }

    option && examinationStageNumberChartInstance.setOption(option)
  }

  // 4. 欠费情况
  const drawArrearageInformation = (arrears, objDom?) => {
    const chartDom = objDom || document.getElementById('arrearageInformation')
    arrearageInformationChartInstance = echarts.init(chartDom)
    let option
    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      barMaxWidth: 20, // 柱状图宽度
      grid: {
        top: '1%',
        left: '3%',
        right: '3%',
        bottom: '1%',
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
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"],
        // data: arrears?.yAxis?.data,
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
          data: [10, 20, 30, 40, 50],
          label: {
            show: true,
            position: 'right',
            fontSize: 16,
            formatter:(data) => {
              return data.value + '%'
            },
            color: '#fff'
          },
          // data: arrears?.series && arrears?.series[0]?.data,
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#348BFF'
                  // color: 'red'
                },
                {
                  offset: 1,
                  color: '#74B0FF'
                  // color: 'yellow'
                }
              ])
              // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              //   {
              //     offset: 0.5,
              //     // color: '#3F8CF7'
              //     color: 'red'
              //   },
              //   {
              //     offset: 0.5,
              //     // color: '#72ADF9'
              //     color: 'yellow'
              //   }
              // ])
            }
          }
        }
      ]
    }

    option && arrearageInformationChartInstance.setOption(option)
  }

  // 5. 考场满分人数占比
  const drawExaminationFullScoreNumber = (fullScore, objDom?) => {
    const chartDom = objDom || document.getElementById('examinationFullScoreNumber')
    examinationFullScoreNumberChartInstance = echarts.init(chartDom)
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
      barMaxWidth: 20, // 柱状图宽度
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
        // data: fullScore?.yAxis?.data,
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12

          },
          formatter:(value) => {
            if (value.length > 6) {
              return value.substring(0, 6) + "...";
            } else {
              return value;
            }

            return value;
          },
        }
      },
      series: [
        {
          type: 'bar',
          // data: fullScore?.series && fullScore?.series[0]?.data,
          data: [10, 20, 30, 40, 50],
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
                  color: '#FF7883'
                },
                {
                  offset: 1,
                  color: '#FE949D'
                }
              ])
            }
          }
        }
      ]
    }
    option && examinationFullScoreNumberChartInstance.setOption(option)
  }

  // 6. 驾校通过率排行榜
  const drawDrivingSchoolPassingRate = (schoolPass, objDom?) => {
    // let chartDom = document.getElementById('drivingSchoolPassingRate')
    const chartDom = objDom || document.getElementById('drivingSchoolPassingRate')
    jxtglChartInstance = echarts.init(chartDom)
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
      barMaxWidth: 20, // 柱状图宽度
      yAxis: {
        type: 'category',
        // data: schoolPass?.yAxis?.data,
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12

          },
          formatter:(value) => {
            // console.log("y轴文字 ===>>",value);
            if (value.length > 6) {
              return value.substring(0, 6) + "...";
            } else {
              return value;
            }

            return value;
          },
        }
      },
      series: [
        {
          type: 'bar',
          // data: schoolPass?.series && schoolPass?.series[0]?.data,
          data: [10, 20, 30, 40, 50],
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
                  color: '#1DDFC9'
                },
                {
                  offset: 1,
                  color: '#7EFFF0'
                }
              ])
            }
          }
        }
      ]
    }

    option && jxtglChartInstance.setOption(option)
  }

  // 7. 考场通过率排行
  const drawExaminationRoomPassingRate = (examSitePass, objDom?) => {
    // let chartDom = document.getElementById('examinationRoomPassingRate')
    const chartDom = objDom || document.getElementById('examinationRoomPassingRate')
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
        // data: examSitePass?.yAxis?.data,
        data: ["海淀驾校","顺义驾校","阳光驾校","腾飞驾校","马池口驾校"],
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#ffffff',
            fontSize: isBigScreen() ? 15 : 12
          },
          formatter:(value) => {
            // console.log("y轴文字 ===>>",value);
            if (value.length > 6) {
              return value.substring(0, 6) + "...";
            } 
            return value;
          },
        },
      },
      barMaxWidth: 20, // 柱状图宽度
      series: [
        {
          type: 'bar',
          // data: examSitePass?.series && examSitePass?.series[0]?.data,
          data: [10, 20, 30, 40, 50],
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
                  color: '#2428E9'
                },
                {
                  offset: 1,
                  color: '#5D60FF'
                }
              ])
            }
          }
        }
      ]
    }

    option && kctglChartInstance.setOption(option)
  }

  //1. 考生数据分析  头部
  const renderBanner = () => {
    return (
      <Fragment>
        <div className="examinee_portal_title">
          <div className="left">当前城市: {area}</div>
          <div className="center">智慧驾考 - 考试数据分析</div>
          <div className="right">
            <TimerClock /><FullScreen onFullScreenFn={() => {
                // console.log(ksqkfxChartInstance.resize, '..........PPPPP')
                ksqkfxChartInstance.resize()
                gcxgkmChartInstance.resize()
                examinationStageNumberChartInstance && examinationStageNumberChartInstance.resize()
                arrearageInformationChartInstance && arrearageInformationChartInstance.resize()
                examinationFullScoreNumberChartInstance && examinationFullScoreNumberChartInstance.resize()
                jxtglChartInstance && jxtglChartInstance.resize()
                kctglChartInstance && kctglChartInstance.resize()
            }}/>
          </div>
          {/* <div className="examination_room_information_analysis_title_right">
            <span className="examination_room_information_analysis_title_right_time"><TimerClock/></span>
            <FullScreen />
          </div> */}
        </div>

        {/* 横隔线图片 */}
        <div className="examinee_portal_line">
          <img src={examineePortalLine} />
        </div>
      </Fragment>
    )
  }

  //2. 数字描述部分
  const renderNumberDesc = () => {
    return (
     <div className='swiper-box'>
       <Swiper
        // modules={[Autoplay]} 
        spaceBetween={50} 
        slidesPerView={1} 
        autoplay={{ delay: delayDuration }} 
        loop
        onSlideChange={(swiper) => {
          // console.log(swiper.activeIndex, 'pppppp')
          // console.log('slide change', swiper, swiper.activeIndex)
          if (swiper.activeIndex === 2) {
            setPeriod({key:1,value:"本周"})
          }
          if (swiper.activeIndex === 3) {
            setPeriod({key:2,value:"本月"})

          }
          if (swiper.activeIndex === 4) {
            setPeriod({key:3,value:"本年"})

          }
          if (swiper.activeIndex === 5) {
            setPeriod({key:0,value:"本日"})

          }


        }}
        >
         <SwiperSlide>
           <div className="number_desc_container">
             <div className="left">
               <div className="left_period">
                 <span>本日</span>
               </div>
               <div>
                 <div className="top">{contrast?.reservation?.title}(人)</div>
                 <div className="bottom">{200 || contrast?.reservation?.count}</div>
                 <div className="bottom_desc"> <DirectionTriangle type={contrast?.reservation?.type} /> {'5%' || contrast?.reservation?.previous} {contrast?.reservation?.msg}</div>
               </div>
             </div>
             <div className="second">
               <div className="top">{contrast?.pass?.title}(本)</div>
               <div className="bottom">{300 || contrast?.pass?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.pass?.type} /> {'6%' || contrast?.pass?.previous} {contrast?.pass?.msg}</div>
             </div>
             <div className="third">
               <div className="top">{contrast?.fail?.title}</div>
               <div className="bottom">{400 || contrast?.fail?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.fail?.type} /> {'7%' || contrast?.fail?.previous} {contrast?.fail?.msg}</div>
             </div>
             <div className="right">
               <div className="top">{contrast?.unSign?.title}</div>
               <div className="bottom">{500 || contrast?.unSign?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.unSign?.type} /> {'8%' || contrast?.unSign?.previous} {contrast?.unSign?.msg}</div>
             </div>
           </div>
         </SwiperSlide>
         <SwiperSlide>
           <div className="number_desc_container">
             <div className="left">
               <div className="left_period">
                 <span>本周</span>
               </div>
               <div>
                 <div className="top">{contrast?.reservation?.title}(人)</div>
                 <div className="bottom">{600 || contrast?.reservation?.count}</div>
                 <div className="bottom_desc"> <DirectionTriangle type={contrast?.reservation?.type} /> {'9%' || contrast?.reservation?.previous} {contrast?.reservation?.msg}</div>
               </div>
             </div>
             <div className="second">
               <div className="top">{contrast?.pass?.title}(本)</div>
               <div className="bottom">{700 || contrast?.pass?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.pass?.type} /> {'10%' || contrast?.pass?.previous} {contrast?.pass?.msg}</div>
             </div>
             <div className="third">
               <div className="top">{contrast?.fail?.title}</div>
               <div className="bottom">{800 || contrast?.fail?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.fail?.type} /> {'11%' || contrast?.fail?.previous} {contrast?.fail?.msg}</div>
             </div>
             <div className="right">
               <div className="top">{contrast?.unSign?.title}</div>
               <div className="bottom">{900 || contrast?.unSign?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.unSign?.type} /> {'8%' || contrast?.unSign?.previous} {contrast?.unSign?.msg}</div>
             </div>
           </div>
         </SwiperSlide>
         <SwiperSlide>
           <div className="number_desc_container">
             <div className="left">
               <div className="left_period">
                 <span>本月</span>
               </div>
               <div>
                 <div className="top">{contrast?.reservation?.title}(人)</div>
                 <div className="bottom">{1000 || contrast?.reservation?.count}</div>
                 <div className="bottom_desc"> <DirectionTriangle type={contrast?.reservation?.type} /> {'5%' || contrast?.reservation?.previous} {contrast?.reservation?.msg}</div>
               </div>
             </div>
             <div className="second">
               <div className="top">{contrast?.pass?.title}(本)</div>
               <div className="bottom">{1500 || contrast?.pass?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.pass?.type} /> {'6%' || contrast?.pass?.previous} {contrast?.pass?.msg}</div>
             </div>
             <div className="third">
               <div className="top">{contrast?.fail?.title}</div>
               <div className="bottom">{2000 || contrast?.fail?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.fail?.type} /> {'7%' || contrast?.fail?.previous} {contrast?.fail?.msg}</div>
             </div>
             <div className="right">
               <div className="top">{contrast?.unSign?.title}</div>
               <div className="bottom">{2500 || contrast?.unSign?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.unSign?.type} /> {'8%' || contrast?.unSign?.previous} {contrast?.unSign?.msg}</div>
             </div>
           </div>
         </SwiperSlide>
         <SwiperSlide>
           <div className="number_desc_container">
             <div className="left">
               <div className="left_period">
                 <span>本年</span>
               </div>
               <div>
                 <div className="top">{contrast?.reservation?.title}(人)</div>
                 <div className="bottom">{5000 || contrast?.reservation?.count}</div>
                 <div className="bottom_desc"> <DirectionTriangle type={contrast?.reservation?.type} /> {'2%' || contrast?.reservation?.previous} {contrast?.reservation?.msg}</div>
               </div>
             </div>
             <div className="second">
               <div className="top">{contrast?.pass?.title}(本)</div>
               <div className="bottom">{6000 || contrast?.pass?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.pass?.type} /> {'3%' || contrast?.pass?.previous} {contrast?.pass?.msg}</div>
             </div>
             <div className="third">
               <div className="top">{contrast?.fail?.title}</div>
               <div className="bottom">{7000 || contrast?.fail?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.fail?.type} /> {'5%' || contrast?.fail?.previous} {contrast?.fail?.msg}</div>
             </div>
             <div className="right">
               <div className="top">{contrast?.unSign?.title}</div>
               <div className="bottom">{8000 || contrast?.unSign?.count}</div>
               <div className="bottom_desc"><DirectionTriangle type={contrast?.unSign?.type} /> {'6%' || contrast?.unSign?.previous} {contrast?.unSign?.msg}</div>
             </div>
           </div>
         </SwiperSlide>
       </Swiper>
     </div>
    )
  }

  // 考生数据分析 图表部分
  const renderEchartsList = () => {
    return (
      <div className="examinee_charts_container">
        <div className="top_container">
          <div className="top_left">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="each_car_type_number_title">各车型各科目预约人数</div>
            <div className="each_car_type_number_line"></div>
            {/* 各车型各科目预约人数图表容器 */}
            <div className='flex-reset'>
              <div id="eachCarTypeNumber" className="each_car_type_number"></div>
            </div>
          </div>
          <div className="top_right">
            <div className="left_top"></div>
            <div className="right_top"></div>
            <div className="right_bottom"></div>
            <div className="left_bottom"></div>
            {/* 图表数据部分  */}
            <div className="examination_information_analysis_title">考试情况分析</div>
            <div className="examination_information_analysis_line"></div>
            {/* 考试情况分析 的容器 */}
            <div className='flex-reset'>
              <div id="examinationInformationAnalysis" className="examination_information_analysis"></div>
            </div>
          </div>
        </div>
        {/* autoplay={{ delay: delayDuration }} loop */}
      </div>
    )
  }

  const renderThreeRow = () => {
    return (
      <div className='threeRow'>
          <Swiper 
          // modules={[Autoplay]} 
          spaceBetween={50}
          slidesPerView={1} 
          autoplay={{ delay: delayDuration }} 
          loop
          onSlideChange={(swiper) => {
            // console.log(swiper.activeIndex, 'pppppp')
            if (swiper.activeIndex === 3) { // 第三行
              // 
              let activeSwiperEchartBox = swiper.$el[0]
              let nextSwipeBox: any = activeSwiperEchartBox.getElementsByClassName('swiper-slide-next')[0]
              // let objDom = null
              let ksjdDom = nextSwipeBox.getElementsByClassName('examineation_stage_number_chart')[0]
              let qfqkDom = nextSwipeBox.getElementsByClassName('arrearage_information_chart')[0]
              let kcmfDom = nextSwipeBox.getElementsByClassName('examination_full_score_number_chart')[0]
              // console.log(swiper, bb, objDom, 'swiperswiperswiper')

              examinationStageNumberChartInstance && examinationStageNumberChartInstance.dispose()
              arrearageInformationChartInstance && arrearageInformationChartInstance.dispose()
              examinationFullScoreNumberChartInstance && examinationFullScoreNumberChartInstance.dispose()
              // swiper.update()
              // debugger
              // dispatch({
              //   type: 'examinationAnalysis/loadBottomRankingData',
              //   payload: {
              //     type:period?.key,
              //   }
              // }).then(res => {
              //   drawExaminationStageNumber(res?.subject, ksjdDom) // --第三行  考试阶段学员数
              //   drawArrearageInformation(res?.arrears, qfqkDom) // --第三行   欠费情况
              //   drawExaminationFullScoreNumber(res?.fullScore, kcmfDom)// 考场满分人数占比--第三行
              //   // swiper.destroy()

              //   // drawDrivingSchoolPassingRate(res?.schoolPass) // 驾校通过率排行榜--第四行
              //   // drawExaminationRoomPassingRate(res?.examSitePass) // 考场通过率排行榜--第四行
              // })
              drawExaminationStageNumber({}, ksjdDom) // --第三行 考试阶段
              drawArrearageInformation({}, qfqkDom) // --第三行 欠费情况
              drawExaminationFullScoreNumber({}, kcmfDom)// 考场满分人数占比--第三行
            } 
            if (swiper.activeIndex === 2) {
              // swiper.update()
              // swiper.destroy()
              jxtglChartInstance && jxtglChartInstance.dispose()
              kctglChartInstance && kctglChartInstance.dispose()

              let activeSwiperEchartBox = swiper.$el[0]
              let nextSwipeBox: any = activeSwiperEchartBox.getElementsByClassName('swiper-slide-next')[0]
              let jxtglDom = nextSwipeBox.getElementsByClassName('driving_school_passing_rate_chart')[0]
              let kctglDom = nextSwipeBox.getElementsByClassName('examination_room_passing_rate_chart')[0]
              // console.log(swiper, nextSwipeBox, 'swiperswiperswiper')

              // dispatch({
              //   type: 'examinationAnalysis/loadBottomRankingData',
              //   payload: {
              //     type:period?.key,
              //   }
              // }).then(res => {
              //   drawDrivingSchoolPassingRate(res?.schoolPass, jxtglDom) // 驾校通过率排行榜--第四行
              //   drawExaminationRoomPassingRate(res?.examSitePass, kctglDom) // 考场通过率排行榜--第四行
              //   // swiper.destroy()

              // })

              drawDrivingSchoolPassingRate({}, jxtglDom) // 驾校通过率排行榜--第四行
              drawExaminationRoomPassingRate({}, kctglDom) // 考场通过率排行榜--第四行
            }
          } }
          // onLoopFix={(swiper) => console.log('loopfix', swiper) }
          // onSlideChange={() => console.log('slide change') }
        >
            <SwiperSlide>
              <div className="bottom_container">
                <div className="bottom_slide1_left">
                  <div className="left_top"></div>
                  <div className="right_top"></div>
                  <div className="right_bottom"></div>
                  <div className="left_bottom"></div>
                  {/* 图表数据部分  */}
                  <div className="examination_stage_number_title">
                    <span>考试阶段学员数</span>
                  </div>
                  {/* <div className="examination_stage_number_line"></div> */}
                  {/* 考试阶段图 的容器 */}
                  <div className='flex-reset'>
                    <div id="examinationStageNumber" className="examineation_stage_number_chart"></div>
                  </div>
                </div>
                <div className="bottom_slide1_center" >
                  <div className="left_top"></div>
                  <div className="right_top"></div>
                  <div className="right_bottom"></div>
                  <div className="left_bottom"></div>
                  {/* 图表数据部分  */}
                  <div className="arrearage_information_title">
                    <span>欠费情况</span>
                  </div>
                  {/* <div className="arrearage_information_line"></div> */}

                  {/* 欠费情况 的容器 */}
                  <div className="arrearage_information_container">
                    <div className="arrearage_information_desc">
                      {/* {arrears?.additional?.map((item,index)=>{
                        return   <div className="arrearage_total" key={index}>
                          <div className="number">{item?.data}</div>
                          <div className="desc">{item?.name}</div>
                        </div>
                      })} */}
                      {/* {[{data: 5, name: '欠费驾校'}, {data: 9, name: '欠费学员数'}].map((item,index)=>{
                        return   <div className="arrearage_total" key={index}>
                          <div className="number">{item?.data}</div>
                          <div className="desc">{item?.name}</div>
                        </div>
                      })} */}
                       <div className="arrearage_total">
                          <div className="number">88</div>
                          <div className="desc">欠费驾校</div>
                       </div>
                       <div className="sex_ratio_divider"></div>
                       <div className="arrearage_total">
                          <div className="number">100</div>
                          <div className="desc">欠费学员数</div>
                       </div>
                    </div>
                    <div className='flex-reset'>
                      <div id="arrearageInformation" className="arrearage_information_chart"></div>
                    </div>
                  </div>
                </div>
                <div className="bottom_slide1_right">
                  <div className="left_top"></div>
                  <div className="right_top"></div>
                  <div className="right_bottom"></div>
                  <div className="left_bottom"></div>
                  {/* 图表数据部分  */}
                  <div className="examination_full_score_number_title">
                    <span>考场满分人数占比</span>
                  </div>
                  {/* <div className="examination_full_score_number_line"></div> */}
                  <div className='flex-reset'>
                    <div id="examinationFullScoreNumber" className="examination_full_score_number_chart"></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bottom_container">
                <div className="bottom_slide2_left">
                  <div className="left_top"></div>
                  <div className="right_top"></div>
                  <div className="right_bottom"></div>
                  <div className="left_bottom"></div>
                  {/* 图表数据部分  */}
                  <div className="driving_school_passing_rate_title">驾校通过率排行榜</div>
                  <div className="driving_school_passing_rate_line"></div>
                  <div className='flex-reset'>
                    <div id="drivingSchoolPassingRate" className="driving_school_passing_rate_chart"></div>
                  </div>
                </div>
                <div className="bottom_slide2_right">
                  <div className="left_top"></div>
                  <div className="right_top"></div>
                  <div className="right_bottom"></div>
                  <div className="left_bottom"></div>
                  {/* 图表数据部分  */}
                  <div className="examination_room_passing_rate_title">考场通过率排行榜</div>
                  <div className="examination_room_passing_rate_line"></div>
                  <div className='flex-reset'>
                    <div id="examinationRoomPassingRate" className="examination_room_passing_rate_chart"></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
    )
  }

  return ReactDOM.createPortal(
    <section className='oneScreenContent'>
      <div style={examineePortalContainer} className="examinee_portal_container">
        {/* 头部*/}
        {renderBanner()}

        {/* 数字描述*/}
        {renderNumberDesc()}

        {/* 图表部分 */}
        {renderEchartsList()}

        {/* 拆分 */}
        {renderThreeRow()}
      </div>
    </section>,
    document.getElementById('root')
  )
}

export default connect(({ examinationAnalysis }) => ({
  area:examinationAnalysis?.area,
  contrast:examinationAnalysis?.contrast,
  arrears:examinationAnalysis?.arrears,
  // subject:examinationAnalysis?.subject,
  // schoolPass:examinationAnalysis?.schoolPass,
  // examSitePass:examinationAnalysis?.examSitePass,
  // fullScore:examinationAnalysis?.fullScore,
}))(ExaminationAnalysis)
