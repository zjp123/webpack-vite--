import { sheetList } from '@/api/automatically'
import { message } from "antd"

export const STATE = {
  sheetList: [],
  isCheckSpotCheckModalVisible: false,
  searcSheetForm: {
    pageNum: 1,
    pageSize: 10
  }
}
export default {
  namespace: "sheet",
  state: STATE,
  effects: {
    //获取考生分配列表
    * loadsheetList({ payload }, { select, call, put }) {
      const state = yield select(state => state.sheet)
      const res = yield call(sheetList, state.searcSheetForm)
      if (res && res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: 'save',
          payload: {
            sheetList: list,
            searcSheetForm: { ...state.searcSheetForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
