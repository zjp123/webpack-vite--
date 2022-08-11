import { loadScheduleListApi, loadScheduleCardListApi, loadDetailsApi } from "@/api/examiner"
// import { message } from "antd"

export const STATE = {
  scheduleCardList: [],
  scheduleList: [], // 预约列表
  searchScheduleForm: {
    pageNum: 1,
    pageSize: 10
  },
  isCheckInformationModalVisible: false,
  detailsInfo: {} // 详情

}

export default {
  namespace: "schedule",
  state: STATE,
  effects: {
    // 看板
    * loadScheduleCardList({ payload }, { select, call, put }) {
      const res = yield call(loadScheduleCardListApi, payload)
      if (res && res.code === 0) {
        const { data: { list } } = res
        yield put({
          type: "save",
          payload: {
            scheduleCardList: list
          }
        })
      }
    },

    // 看板列表
    * loadScheduleList({ payload }, { select, call, put }) {
      const state = yield select(state => state.schedule)
      const res = yield call(loadScheduleListApi, { ...payload, ...state.searchScheduleForm })
      if (res?.code === 0) {
        const { data: { pagination, list } } = res
        yield put({
          type: "save",
          payload: {
            scheduleList: list,
            searchScheduleForm: { ...state.searchScheduleForm, ...pagination }
          }
        })
      }
    },
    // 考试预约详情
    * details({ payload }, { select, call, put }) {
      const res = yield call(loadDetailsApi, payload)
      if (res?.code === 0) {
        const { data } = res
        yield put({
          type: "save",
          payload: {
            detailsInfo: data
          }
        })
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
