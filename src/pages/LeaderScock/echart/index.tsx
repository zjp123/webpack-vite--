import React, { Fragment, useEffect, useState } from 'react'
import { connect } from 'dva'
import ReactDOM from 'react-dom'
import './style.less'
import * as echarts from 'echarts'


const EchartTest: React.FC<any> = ({ dispatch,area,contrast,arrears }) => {

  useEffect(() => {
    drawEachCarTypeNumber()
  }, [])
  // 1. 各车型各科目预约人数
  const drawEachCarTypeNumber = () => {
    // const chartDom = document.getElementById('eachCarTypeNumber')
    // const myChart = echarts.init(chartDom)
    // let option
    // series 的 每一项对象
    // const seriesItem = {
    //   stack: '人数',
    //   smooth: true,
    //   lineStyle: {
    //     width: 1
    //   },
    //   showSymbol: true,
    //   itemStyle: {
    //     normal: {
    //       label : {
    //         show: true,
    //         position: 'top', //在上方显示
    //         textStyle: {     //数值样式
    //           color: '#FFFFFF',
    //           fontSize: 16
    //         }
    //       },
    //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //         {
    //           offset: 0,
    //           color: 'rgba(29, 223, 201, 1)'
    //         },
    //         {
    //           offset: 1,
    //           color: 'rgba(126, 255, 240, 1)'
    //         }
    //       ])
    //     }
    //   },
    //   areaStyle: {
    //     opacity: 0.8,
    //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //       {
    //         offset: 0,
    //         color: 'rgba(247, 214, 72, 0)'
    //       },
    //       {
    //         offset: 1,
    //         color: 'rgba(247, 214, 72, 0.2)'
    //       }
    //     ])
    //   },
    //   emphasis: {
    //     focus: 'series'
    //   },
    // }
    // const getVehicleTypeSeries = (series)=>{
    //   const newSeries = series?.map((item)=>({
    //     ...seriesItem,
    //     ...item,
    //   }))
    //   return newSeries
    // }
    // // 获取legend值
    // const getLegendData= ()=>{
    //   return subject?.legendData
    // }
    // // 动态切换图例
    // changeEChartsLegendLine(myChart,changeLegendLineTimer,delayDuration)
    // option = {
    //   color: ['#F7D648'],
    //   tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //       type: 'cross',
    //       label: {
    //         backgroundColor: '#6a7985'
    //       }
    //     }
    //   },
    //   legend: {
    //     data:  getLegendData(),
    //     left:"3%",
    //     textStyle: {
    //       color: '#ccc'
    //     },
    //     selectedMode: "single", // 只显示一条 线
    //     icon:'bar',
    //     itemWidth:20,
    //     itemHeight:10,
    //     itemGap: 20,
    //     padding: 15, // legend 边距
    //     // inactiveColor: "#49e8d6",         //选中状态的颜色
    //   },
    //   grid: {
    //     top:"15%",
    //     left: '3%',
    //     right: '4%',
    //     bottom: '10%',
    //     containLabel: true
    //   },
    //   xAxis: [
    //     {
    //       type: 'category',
    //       boundaryGap: true, // 距离刻度线距离
    //       data: subject?.xAxis?.data,
    //       axisLabel: {
    //         textStyle: {
    //           color: '#ffffff'
    //         }
    //       }
    //     }
    //   ],
    //   yAxis: [
    //     {
    //       type: 'value',
    //       splitLine: {
    //         show: false
    //       },
    //       axisLabel: {
    //         textStyle: {
    //           color: '#ffffff'
    //         }
    //       }
    //     }
    //   ],
    //   series: getVehicleTypeSeries(subject?.series)
    // }
    // console.log('什么情况')
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
    // option && myChart.setOption(option)
    var chartDom = document.getElementById('echart-test-line');
    var myChart = echarts.init(chartDom);
    console.log('走了吗')
    var option;
    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }
      ]
    };

    option && myChart.setOption(option);
  }
  return (
    <div id='echart-test-line'>

    </div>
  )
}

export default EchartTest