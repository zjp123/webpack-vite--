/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-04-01 16:39:58
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/System/interface/model.ts
 */
import { interfaceList, addInterfaceList, upInterfaceList, delInterfaceList } from '@/api/system'
import { message } from "antd";
export const STATE = {
  interfaceList: [],
  searchInterfaceForm: {
    pageNum: 1,
    pageSize: 10,
  },
  isInterfaceVisible: false,
  id: 0,
  isInterfacePageVisible: false
}
export default {
  namespace: 'interfaceManagement',
  state: STATE,
  effects: {
    *loadInterfaceFormList({ payload }, { select, call, put }) {
      try {
        const state = yield select(state => state.interfaceManagement)
        const res = yield call(interfaceList, state.searchInterfaceForm)
        if (res.code === 0) {
          const { list, pagination } = res.data
          console.log({ ...state.searchInterfaceForm })
          yield put({
            type: 'save', payload: {
              interfaceList: list,
              searchInterfaceForm: { ...state.searchInterfaceForm, ...pagination }
            }
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 删除接口
    *deleteInterface({ payload }, { select, call, put }) {
      try {
        const res = yield call(delInterfaceList, payload)
        if (res && res.code === 0) {
          message.success('删除接口成功');
          yield put({
            type: 'loadInterfaceFormList'
          })
        }
      } catch (err) {
      }
    },
    // 新增接口
    *addInterface({ payload }, { select, call, put }) {
      try {
        let sOrU = payload.postData.id ? upInterfaceList : addInterfaceList,
          text = payload.postData.id ? '修改' : '新增';
        const res = yield call(sOrU, payload.postData)
        if (res && res.code === 0) {
          message.success(text + '接口信息成功');
          payload.parentForm.resetFields()

          yield put({
            type: 'save',
            payload: {
              isInterfaceVisible: false,
              searchInterfaceForm: { ...STATE.searchInterfaceForm }
            }
          })
          yield put({
            type: 'loadInterfaceFormList'
          })
        }
      } catch (err) {
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
