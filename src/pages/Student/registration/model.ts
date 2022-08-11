import { saveAndNextApi } from "@/api/student"
import { message } from "antd"

export default {
  namespace: "registration",
  state: {
    medicalList: [],
    searchMedicalForm: {
      pageNum: 1,
      pageSize: 10
    },
    checkedKeys: [],
    isShowShootIDCard: true, // 展示高拍仪
    isShowInputForm: false // 录入
  },
  effects: {
    //保存 下一步
    * saveAndNext({ payload }, { select, call, put }) {
      const state = yield select(state => state.medical)
      const res = yield call(saveAndNextApi, payload)
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save",
          payload: {
            medicalList: list
          }
        })
        return res
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
