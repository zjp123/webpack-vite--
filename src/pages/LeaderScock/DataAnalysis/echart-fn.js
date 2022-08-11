
import * as echarts from 'echarts'
import { isBigScreen } from "@/utils"
import { ECHARTS_COMMON_CONFIG } from "@/utils/constants"

let examineeTrainChartInstance, waterFallChartInstance, rankBarChartInstance, agePieChartInstance, newExamineeLineChartInstance = null

// 1. 考生培训周期图
const drawExamineeTrainingPeriod = (stuTrainingCycleStatistics) => {

    examineeTrainChartInstance && examineeTrainChartInstance.clear()
    examineeTrainChartInstance = echarts.getInstanceByDom(document.getElementById('examineeTrainingPeriod')); //有的话就获取已有echarts实例的DOM节点。
    if (examineeTrainChartInstance == null) { // 如果不存在，就进行初始化。
        examineeTrainChartInstance = echarts.init(document.getElementById('examineeTrainingPeriod'))
    }
   
    let option
    option = {
      // title: {
      //   show: !(stuTrainingCycleStatistics?.xData.length), // 无数据时展示 title
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 26
      //   },
      //   text: '暂无数据',
      //   left: 'center',
      //   top: 'center'
      // },
      color: ['#6600FF'],
      ...ECHARTS_COMMON_CONFIG,
      grid: {
        top: '10%',
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true
      },
      tooltip:{
        ...ECHARTS_COMMON_CONFIG.TOOL_TIP,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        // data: stuTrainingCycleStatistics?.xData,
        data: ['1-3个月', '3-6个月', '6-12个月', '2-24个月', '24-36个月'],
        ...ECHARTS_COMMON_CONFIG.X_AXIS,
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: isBigScreen() ? 15 : 12           
          }
        },
      },
      yAxis: {
        type: 'value',
        ...ECHARTS_COMMON_CONFIG.Y_AXIS,
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: isBigScreen() ? 15 : 12           
          }
        },
      },
      series: [
        {
          symbol: 'circle',
          // data: stuTrainingCycleStatistics?.ySeries,
          data: [517, 621, 2013, 202, 0],
          type: 'line',
          lineStyle: {
            width: 1
          },
          symbolSize: 6,
          itemStyle : { 
            normal: {
              borderColor: '#f58f23',
              borderWidth: 1,
              label : {
                show: true,
                fontSize: isBigScreen() ? 15 : 12,
                formatter:function(data){ // 不能是箭头函数
                  return data.value + '人';
                },
                color:"#FFFFFF"
              }
            }
          },
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

    examineeTrainChartInstance.setOption(option)
    // myChart.hideLoading()

  }

  // 2. 报考车型人数
  const drawWaterFallChart = (perdritypeStatistics) => {
    // let chartDom = document.getElementById('waterFallChart')
    // waterFallChartInstance = echarts.init(chartDom)
    // myChart.showLoading()
    waterFallChartInstance && waterFallChartInstance.clear()
    waterFallChartInstance = echarts.getInstanceByDom(document.getElementById('waterFallChart')); //有的话就获取已有echarts实例的DOM节点。
    if (waterFallChartInstance == null) { // 如果不存在，就进行初始化。
        waterFallChartInstance = echarts.init(document.getElementById('waterFallChart'))
    }
    // const perdritypeStatistics = formatPerdritypeStatistics(data)

    let option
    option = {
      // title: {
      //   show: !(perdritypeStatistics?.xData.length), // 无数据时展示 title
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 26
      //   },
      //   text: '暂无数据',
      //   left: 'center',
      //   top: 'center'
      // },
      tooltip: {
        ...ECHARTS_COMMON_CONFIG.TOOL_TIP,
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          let tar
          if (params[1].value !== '-') {
            tar = params[1]
          } else {
            tar = params[0]
          }
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
        }
      },
      ...ECHARTS_COMMON_CONFIG,
      grid: {
        top: '10%',
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true
      },
      // barMaxWidth: 20,
      xAxis: {
        type: 'category',
        // data: perdritypeStatistics?.xData,
        data: ['C1', 'C2', 'B1', 'B2', 'A1', 'A2', 'D/E', '其他'],
        ...ECHARTS_COMMON_CONFIG.X_AXIS,
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: isBigScreen() ? 15 : 12         
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: 'rgba(0, 59, 138, .4)', //左边线的颜色
            width: '2' //坐标线的宽度
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0, 59, 138, .4)'],
            width: 1,
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'value',
        ...ECHARTS_COMMON_CONFIG.Y_AXIS,
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: isBigScreen() ? 15 : 12         
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: 'rgba(0, 59, 138, .4)', //左边线的颜色
            width: '2' //坐标线的宽度
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0, 59, 138, .4)'],
            width: 1,
            type: 'solid'
          }
        }
      },
      series: [
        {
          name: '总人数1',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              // color: 'transparent'
              color: '#fff'
            }
          },
          data: [300, 900, 1245, 1530, 1376, 1376, 1511, 1689]
          // data: perdritypeStatistics?.data,
        },
        {
          name: '总人数2',
          type: 'bar',
          stack: 'Total',
          itemStyle:{
            color:"#60CBB9"
            // color:"red"
          },
          label: {
            show: true,
            position: 'inside',
            fontSize: isBigScreen() ? 15 : 12,
            color:"#fff"

          },
          data: [920, 345, 393, '-', '-', 135, 178, 286]
        },
        {
          name: '总人数3',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside',
            fontSize: isBigScreen() ? 15 : 12,
            color:"#fff"
          },
          itemStyle:{
            color:"#006DFF"
            // color:"green"
          },
          data: ['-', '-', '-', 108, 154, '-', '-', '-']
        }
      ]
    }

    waterFallChartInstance.setOption(option)
    // myChart.hideLoading()

  }

  // 3. 驾校新增考生量排名
  const drawRankBarChart = (schNewStuNumberLeaderboard) => {
    // let chartDom = document.getElementById('rankBarChart')
    // rankBarChartInstance = echarts.init(chartDom)
    rankBarChartInstance && rankBarChartInstance.clear()
    rankBarChartInstance = echarts.getInstanceByDom(document.getElementById('rankBarChart')); //有的话就获取已有echarts实例的DOM节点。
    if (rankBarChartInstance == null) { // 如果不存在，就进行初始化。
        rankBarChartInstance = echarts.init(document.getElementById('rankBarChart'))
    }


    let option
    option = {
      // title: {
      //   show: !(schNewStuNumberLeaderboard?.xData.length), // 无数据时展示 title
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 26
      //   },
      //   text: '暂无数据',
      //   left: 'center',
      //   top: 'center'
      // },
      ...ECHARTS_COMMON_CONFIG,
      tooltip: {
        axisPointer: {
          type: 'shadow'
        }
      },
      // grid: {
      //   top: '3%',
      //   left:"20%"
      // },
      grid: {
        top: '10%',
        left: '3%',
        right: '5%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.1],
        show: false,
        ...ECHARTS_COMMON_CONFIG.X_AXIS,
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: isBigScreen() ? 15 : 12         
          }
        },
      },
      yAxis: {
        type: 'category',
        // data: schNewStuNumberLeaderboard?.ySeries,
        data: ['濮阳市浦豫驾驶员培训学校', '濮阳市八方汽车驾驶员培训学校', '濮阳市华龙区豫龙技工汽车驾驶员培训学校', '濮阳市荣达驾驶员培训有限公司',
            '濮阳市安驰机动车驾驶员培训学校', '台前县诚信机动车驾驶员培训学校', '范县中信驾驶员培训学校', '濮阳县顺安驾驶员培训有限公司'
          ],
        axisTick: {
          show: false
        },
        ...ECHARTS_COMMON_CONFIG.Y_AXIS,
        axisLabel: {
          textStyle: {
            color: '#fff',
            fontSize: isBigScreen() ? 15 : 12         
          }
        },
      },
      series: [
        {
          type: 'bar',
          // data: schNewStuNumberLeaderboard?.xData,
          data: [1, 1, 19, 4, 1, 81, 6, 3],
          barWidth:"11",
          itemStyle: {
            normal: {
              barBorderRadius: [0, 15, 15, 0], // 圆角
              label : {
                show: true,
                position: 'right', //在上方显示
                textStyle: {     //数值样式
                  color: '#FFFFFF',
                  fontSize: isBigScreen() ? 15 : 12
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
        }
      ]
    }

    rankBarChartInstance.setOption(option)
  }

  // 4. 考生年龄分布饼图
  const drawAgePieChart = (ageStatistics) => {
    // let chartDom = document.getElementById('examineePieChart')
    // agePieChartInstance = echarts.init(chartDom)
    agePieChartInstance && agePieChartInstance.clear()
    agePieChartInstance = echarts.getInstanceByDom(document.getElementById('examineePieChart')); //有的话就获取已有echarts实例的DOM节点。
    if (agePieChartInstance == null) { // 如果不存在，就进行初始化。
        agePieChartInstance = echarts.init(document.getElementById('examineePieChart'))
    }

    let option
    option = {
      ...ECHARTS_COMMON_CONFIG,
      tooltip: {
        trigger: 'item'
      },
      // title: {
      //   show: !(ageStatistics.length), // 无数据时展示 title
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 26
      //   },
      //   text: '暂无数据',
      //   left: 'center',
      //   top: 'center'
      // },
      legend: {
        orient: 'horizontal',
        top: '5%',
        // bottom: '5%',
        left: 'center',
        textStyle:{
          color:"#ffffff",
          fontSize: isBigScreen() ? 15 : 12         
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          label: {
            fontSize: isBigScreen() ? 15 : 12
          },
          data: [{ value: 1048, name: 'Search Engine' }, { value: 735, name: 'Direct' }, { value: 580, name: 'Email' }, { value: 484, name: 'Union Ads' }, { value: 300, name: 'Video Ads' }],
          // data:ageStatistics,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          top: '10%',
        }
      ]
    }

    agePieChartInstance.setOption(option)
  }

  // 5. 新增考生数量图
  const drawNewExamineeLineChart = (thisMonthStatistics) => {
    // let chartDom = document.getElementById('newExamineeLineChart')
    // newExamineeLineChartInstance = echarts.init(chartDom)

    newExamineeLineChartInstance && newExamineeLineChartInstance.clear()
    newExamineeLineChartInstance = echarts.getInstanceByDom(document.getElementById('newExamineeLineChart')); //有的话就获取已有echarts实例的DOM节点。
    if (newExamineeLineChartInstance == null) { // 如果不存在，就进行初始化。
        newExamineeLineChartInstance = echarts.init(document.getElementById('newExamineeLineChart'))
    }

    // const thisMonthStatistics = formatThisMonthStatistics(data)

    let option
    option = {
      color: ['#23B1FF'],
      ...ECHARTS_COMMON_CONFIG,
      tooltip: {
        ...ECHARTS_COMMON_CONFIG.TOOL_TIP,
      },
      // title: {
      //   show: !(thisMonthStatistics?.xData.length), // 无数据时展示 title
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 26
      //   },
      //   text: '暂无数据',
      //   left: 'center',
      //   top: 'center'
      // },
      legend: {
        data: []
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '3%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          // data: thisMonthStatistics?.xData,
          data: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6'],
          ...ECHARTS_COMMON_CONFIG.X_AXIS,
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: isBigScreen() ? 15 : 12         
            }
          },
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          ...ECHARTS_COMMON_CONFIG.Y_AXIS,
          axisLabel: {
            textStyle: {
              color: '#fff',
              fontSize: isBigScreen() ? 15 : 12         
            }
          },
        }
      ],
      series: [
        {
          name: "考生数量",
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 1
          },
          showSymbol: true,
          label : {
            show: true,
            position: 'top', //在上方显示
            textStyle: {     //数值样式
              color: '#FFFFFF',
              fontSize: 16
            }
          },
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(11, 206, 255, 0.2)'
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          // data: thisMonthStatistics?.ySeries
          data: [5, 6, 7, 8, 9, 10]
        }
      ]
    }

    newExamineeLineChartInstance.setOption(option)
  }

  export {
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
  }