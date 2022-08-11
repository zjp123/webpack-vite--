import { loadSchoolDataAnalysisApi} from '@/api/leaderscock'
import { message } from 'antd'
export default {
  namespace: "informationAnalysis",
  state: {
    loadSchoolData:{}
  },
  effects: {
    // 驾校总体数据分析
    * loadSchoolDataAnalysis({payload}, {select, call, put}) {
      const state = yield select(state => state.sysIndex)
      const res = yield call(loadSchoolDataAnalysisApi, {...payload})
      if (res?.code === 0) {
        yield put({
          type: "save",
          payload: {
            loadSchoolData: {
              ...res.data,
            },
          },
        })
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
