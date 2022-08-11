import { managementlistApi, deleteFirstLevelDictApi, deleteSecondDictApi, secondaryList, updateSecondeDictApi, updateFirstLevelDictApi, getdictionaryInfo, addSecondDictionaryApi, addFirstLevelDictApi } from "@/api/system"
import { message } from "antd"
import { formatParameters } from "@/utils"
import { openNotification } from "@/components/OpenNotification"

export const STATE = {
  managementlist: [],
  searchManagementForm: {
    pageNum: 1,
    pageSize: 10
  },
  secondaryList: [],
  searchsecondaryListForm: {
    pageNum: 1,
    pageSize: 10
  }
}
export default {
  namespace: "management",
  state: STATE,
  effects: {
    //获取角色列表
    * loadManagementList({ payload }, { select, call, put }) {
      const state = yield select(state => state.management)
      const res = yield call(managementlistApi, state.searchManagementForm)
      if (res?.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save",
          payload: {
            managementlist: list,
            searchManagementForm: { ...state.searchManagementForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },

    // 一级字典删除
    * deleteFirstLevelDict({ payload }, { select, call, put }) {
      try {
        const res = yield call(deleteFirstLevelDictApi, payload)
        if (res?.code === 0) {
          message.success("删除字典成功")
          yield put({
            type: "loadManagementList"
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    // 一级字典新增或编辑
    * addOrUpdateFirstLevelDict({ payload }, { select, call, put }) {
      try {
        let sOrU = payload.postData.id ? updateFirstLevelDictApi : addFirstLevelDictApi,
          text = payload.postData.id ? "新增" : "修改"
        const date = formatParameters(payload.postData, {
          numTrunBoole: ["dictName", "dictType"]
        })
        const res = yield call(sOrU, date)
        if (res?.code === 0) {
          openNotification({ message: res?.msg }, "success")
          payload.parentForm.resetFields()

          yield put({
            type: "save",
            payload: {
              isCuRoleModalVisible: false,
              searchManagementForm:{...STATE.searchManagementForm}
            }
          })
          yield put({
            type: "loadManagementList"
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    //字典二级列表
    * loadSecondaryList({ payload }, { select, call, put }) {
      const state = yield select(state => state.management)
      const res = yield call(secondaryList, { ...state.searchsecondaryListForm, ...payload })
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save", payload: {
            secondaryList: list,
            searchsecondaryListForm: { ...state.searchsecondaryListForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 二级字典删除
    * deleteSecondDict({ payload }, { select, call, put }) {
      try {
        const res = yield call(deleteSecondDictApi, payload)
        if (res?.code === 0) {
          message.success("删除字典成功")
        } else {
          message.warn(res.msg)
        }
        return res
      } catch (err) {
      }
    },

    // 二级字典新增或修改
    * addOrUpdateSecondLevelDict({ payload }, { select, call, put }) {
      try {
        let sOrU = payload.id ? updateSecondeDictApi : addSecondDictionaryApi,
          text = payload.id ? "修改" : "新增"
        const res = yield call(sOrU, payload)
        if (res && res.code === 0) {
          message.success(text + "修改字典成功")
          yield put({
            type: "save",
            payload: {
              isCuRoleModalVisibletop: false
            }
          })
          return res
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
