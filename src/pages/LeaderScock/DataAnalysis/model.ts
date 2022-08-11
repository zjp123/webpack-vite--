import { loadExamineeDataApi} from '@/api/leaderscock'
import { message } from 'antd'

export default {
    namespace: "dataAnalysis",
    state: {
      numberDescData:{},
      stuTrainingCycleStatistics:{ // 考生培训证周期
      },
      perdritypeStatistics:{}, // 报考车型人数统计
    },
    effects: {
      // 考生数据分析接口
      * loadExamineeData({payload}, {select, call, put}) {
        const state = yield select(state => state.dataAnalysis)
        // console.log("state ==>>",state);
        const res = yield call(loadExamineeDataApi)
        // console.log("res ===>>",res);
        if (res?.code === 0) {
          const payload = {
            numberDescData: { // 头部数字描述部分
              stuAmount:res?.data?.stuAmount, // 本地区累计考生人数
              issuanceAmount:res?.data?.issuanceAmount, // 本地区持证发证数量
              stuPassRate:res?.data?.stuPassRate, // 考生通过率
              averageLicensingPeriod:res?.data?.averageLicensingPeriod, // 平均领证周期
            },
            stuTrainingCycleStatistics:formatStuTrainingCycleStatistics(res?.data?.stuTrainingCycleStatistics),
            perdritypeStatistics:formatPerdritypeStatistics(res?.data?.perdritypeStatistics),
            schNewStuNumberLeaderboard:formatSchNewStuNumberLeaderboard(res?.data?.schNewStuNumberLeaderboard),
            ageStatistics:formatAgeStatistics(res?.data?.ageStatistics),
            thisMonthStatistics:formatThisMonthStatistics(res?.data?.thisMonthStatistics), // 新增考生数量
          }
          yield put({
            type: "save",
            payload,
          })
          return payload
        } else {
          message.warn(res.msg)
        }
      },

    },
    reducers: {
      save(state, {payload}) {
        return {...state, ...payload}
      },
    },
  }


// 1. 格式化考生培训周期数据
const formatStuTrainingCycleStatistics = (stuTrainingCycleStatistics)=>{
  let xData =[]
  let ySeries=[]
  stuTrainingCycleStatistics?.forEach((item)=>{
    xData.push(item?.trainingCycle)
    ySeries.push(item?.cycleStuNumber)
    // ySeries.push(Math.floor(Math.random() * (50 - 1 + 1) + 1)) // todo 给的假数据, 后期改过来
  })
  return {xData,ySeries}
}

// 2. 格式化报考车型人数统计
const formatPerdritypeStatistics =(perdritypeStatistics)=>{
  let xData =[]
  let data=[]
  perdritypeStatistics?.forEach((item)=>{
    xData.push(item?.perdritype)
    data.push(item?.perdritypeStudentNumber)
  })
  return {xData,data}
}

// 3. 驾校新增考生量排名
const formatSchNewStuNumberLeaderboard=(schNewStuNumberLeaderboard)=>{
  // let xData =[58,67,35,78,99,123,34]
  // let ySeries=["长安驾校","腾飞驾校","阳关驾校","通校驾校","昌平驾校","海淀驾校","马池口驾校"]
  let xData =[]
  let ySeries=[]
  schNewStuNumberLeaderboard?.forEach((item)=>{
    xData.push(item?.schNewStuNumber)
    ySeries.push(item?.schName)
  })
  return {xData,ySeries}
}
//4. 年龄分布数据统计格式化
const formatAgeStatistics = (ageStatistics)=>{
  const newAgeStatistics = ageStatistics?.map((item)=>({
    name:item?.ageRange,
    value:item?.ageStudentNumber
  }))
  return newAgeStatistics
}

//5. 新增考生数量格式化
const formatThisMonthStatistics = (thisMonthStatistics)=>{
  let xData =[]
  let ySeries=[]
  thisMonthStatistics?.forEach((item)=>{
    xData.push(item?.date)
    ySeries.push(item?.dayNewStudentNumber)
  })
  return {xData,ySeries}
}
