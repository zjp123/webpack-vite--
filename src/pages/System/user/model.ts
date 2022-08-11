/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-03-31 17:32:09
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/System/user/model.ts
 */
import {userList, addUser, updateUser, deleteUser, updateSixInOneUserApi, loadSixInOneUserDetailApi} from '@/api/system'
import {message} from 'antd'

export const STATE = {
  userList: [],
  searchUserForm: {
    pageNum: 1,
    pageSize: 10,
  },
  isCuUserModalVisible: false,
  isExtendwordlVisible: false,
  isSixInOneVisible: false,
  sixInOneUserDetail: {},
  associationStatus: undefined,
}
export default {
  namespace: 'user',
  state: {...STATE},
  effects: {
    //获取考场人像比对结果监控列表
    * loadUserList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.user)
        const res = yield call(userList, state.searchUserForm)
        if (res.code === 0) {
          const {list, pagination} = res.data
          yield put({
            type: 'save', payload: {
              userList: list,
              searchUserForm: {...state.searchUserForm, ...pagination}
            }
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    /* 新增用户 */
    * addUser({payload}, {select, call, put}) {
      try {
        let sOrU = payload.postData.userId ? updateUser : addUser,
          text = payload.postData.userId ? '修改' : '新增';
        const res = yield call(sOrU, payload.postData)
        if (res && res.code === 0) {
          message.success(text + '用户成功');
          payload.parentForm.resetFields()
          yield put({
            type: 'save',
            payload: {
              isCuUserModalVisible: false,
              searchUserForm: {...STATE.searchUserForm}
            }
          })
          yield put({
            type: 'loadUserList'
          })
        }
      } catch (err) {
      }
    },
    /* 删除用户 */
    * deleteUser({payload}, {select, call, put}) {
      try {
        const res = yield call(deleteUser, payload)
        if (res && res.code === 0) {
          message.success('删除用户成功');
          yield put({
            type: 'loadUserList'
          })
        }
      } catch (err) {
      }
    },
    * updateSixInOneUser({payload}, {select, call, put}) {
      const state = yield select(state => state.user)
      const res = yield call(updateSixInOneUserApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
        yield put({
          type: 'loadUserList',
        })
      } else {
        message.warn(res.msg)
      }
    },
    * loadSixInOneUserDetail({payload}, {select, call, put}) {
      const state = yield select(state => state.user)
      const res = yield call(loadSixInOneUserDetailApi, payload)
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            sixInOneUserDetail: res.data
          }
        })
      } else {
        message.warn(res.msg)
      }
    }
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
