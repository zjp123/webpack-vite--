/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-04-01 16:34:21
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/System/timingtask/model.ts
 */
import { timingtaskList, deleteTolep, addtimingtask, updatiming, ScheduledList } from "@/api/system"
import { message } from "antd"
import { formatParameters } from "@/utils"
import { openNotification } from "@/components/OpenNotification"

export const STATE = {
  timingtaskList: [],
  searchtimingtaskForm: {
    pageNum: 1,
    pageSize: 10,
    jobName: ""
  }
}
export default {
  namespace: "timingtask",
  state: STATE,
  effects: {
    //获取定时任务列表
    * loadScheduledList({ payload }, { select, call, put }) {
      const state = yield select(state => state.timingtask)
      const res = yield call(ScheduledList, { ...state.searchtimingtaskForm, ...payload })
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save", payload: {
            ScheduledList: list,
            searchtimingtaskForm: { ...state.searchtimingtaskForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    //获取定时任务详情列表
    * loadtimingtaskList({ payload }, { select, call, put }) {
      const state = yield select(state => state.timingtask)
      const res = yield call(timingtaskList, state.searchtimingtaskForm)
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save", payload: {
            timingtaskList: list,
            searchtimingtaskForm: { ...state.searchtimingtaskForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },

    /* 删除 */
    * deleteTolep({ payload }, { select, call, put }) {
      try {
        const res = yield call(deleteTolep, payload)
        if (res && res.code === 0) {
          message.success("删除定时任务成功")
          yield put({
            type: "loadtimingtaskList"
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    //新增
    * addtimingtask({ payload }, { select, call, put }) {
      try {
        let sOrU = payload.postData.jobId ? updatiming : addtimingtask;
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
              searchtimingtaskForm: { ...STATE.searchtimingtaskForm }
            }
          })
          yield put({
            type: "loadtimingtaskList"
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
