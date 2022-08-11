import {
  loadOrderListApi,
  deleteOrderApi,
  addArrangementApi,
  addExaminerInfoApi,
  updateExaminerInfoApi,
  updateArrangementApi,
  loadExaminerListApi,
  deleteExaminerApi
} from "@/api/examiner"
import { message } from "antd"

export const STATE = {
  orderList: [],
  searchOrderForm: {
    pageNum: 1,
    pageSize: 10
  },
  isCheckorderModalVisible: false,
  isShowExaminerModal: false, // 是否显示考官列表modal
  cuOrderModalForm: {
    pageNum: 1,
    pageSize: 10
  },
  isShowAddModal: false,
  isShowAddOrEditExaminerModal: false,// 是否显示新增考官modal
  isHasDisable: false
}
export default {
  namespace: "order",
  state: STATE,
  effects: {
    // 考官日程/排期列表
    * loadOrderList({ payload }, { select, call, put }) {
      const state = yield select(state => state.order)
      const res = yield call(loadOrderListApi, { ...state.searchOrderForm, status: 0 })
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save",
          payload: {
            orderList: list,
            searchOrderForm: { ...state.searchOrderForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 排期内 (本场考官)考官列表
    * loadExaminerList({ payload }, { select, call, put }) {
      const res = yield call(loadExaminerListApi, { ...payload })
      if (res.code === 0) {
        const { list } = res.data
        yield put({
          type: "save",
          payload: {
            examinerList: list
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 删除排期
    * deleteOrder({ payload }, { selected, call, put }) {
      try {
        const res = yield call(deleteOrderApi, payload)
        if (res && res.code === 0) {
          message.success("删除考官日程成功!")
          yield put({
            type: "order/loadOrderList"
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 新增或编辑考官排期
    * addArrangement({ payload }, { selected, call, put }) {
      try {
        let callbackApi = payload.data.id ? updateArrangementApi : addArrangementApi,
          text = payload.data.id ? "修改" : "新增"
        const res = yield call(callbackApi, payload.data)
        if (res && res.code === 0) {
          message.success(text + "成功")
          payload.parentForm.resetFields()
          yield put({
            type: "save",
            payload: {
              isShowAddModal: false,
              searchOrderForm: { ...STATE.searchOrderForm }

            }
          })
          yield put({
            type: "loadOrderList"
          })
          return res
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 新增/修改 排期内考官
    * addExaminerInfo({ payload }, { selected, call, put }) {
      try {
        let callbackApi = payload?.title === "新增" ? addExaminerInfoApi : updateExaminerInfoApi,
          text = payload?.title
        const res = yield call(callbackApi, payload)
        if (res && res.code === 0) {
          message.success(text + "成功")
          yield put({
            type: "loadExaminerList"
          })
          yield put({
            type: "save",
            payload: {
              isShowExaminerModal: false
            }
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 删除排期内 考官
    * deleteExaminer({ payload }, { selected, call, put }) {
      try {
        return yield call(deleteExaminerApi, payload)
      } catch (err) {
        console.log(err)
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
