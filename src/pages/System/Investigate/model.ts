import { loadInvestigateListApi, ThelogList, RequestlogList } from "@/api/system"
import { message } from "antd"
import dataListRemoveLater from "./dataListRemoveLater"

export default {
  namespace: "investigate",
  state: {
    // 审计列表
    investigateList: [],
    searchInvestigateListForm: {
      pageNum: 1,
      pageSize: 10
    }
  },
  effects: {
    // 审计管理列表
    * loadInvestigateList({ payload }, { select, call, put }) {
      const state = yield select(state => state.investigate)
      const res = yield call(loadInvestigateListApi, state.searchInvestigateListForm)
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save",
          payload: {
            investigateList: dataListRemoveLater,
            searchInvestigateListForm: { ...state.searchInvestigateListForm, ...pagination }
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
