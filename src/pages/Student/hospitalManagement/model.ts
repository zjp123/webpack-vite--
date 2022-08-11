import {
  getHospitalManagementDataListApi,
  updateHospitalApi,
  addHospitalApi,
  deleteHospitalApi,
  resetHospitalPasswordApi,
  createDoctorAccountApi
} from '@/api/student'
import { message } from 'antd'
import { openNotification } from "@/components/OpenNotification"
export const STATE = {
  hospitalManagementDataList: [], // 医院管理列表
  isCuRoleModalVisible: false,
  examinerSelect: [],
  searchHospitalManagementForm: {
    pageNum: 1,
    pageSize: 10,
    name: '',
    startTime: '',
    course: ''
  }
}
export default {
  namespace: 'hospitalManagement',
  state: STATE,
  effects: {
    // 医院管理列表
    *getHospitalManagementDataList({ payload }, { select, call, put }) {
      const state = yield select(state => state.hospitalManagement)
      const res = yield call(getHospitalManagementDataListApi, state.searchHospitalManagementForm)
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: 'save',
          payload: {
            hospitalManagementDataList: list,
            searchHospitalManagementForm: { ...state.searchHospitalManagementForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 删除医院
    *deleteHospital({ payload }, { call, put }) {
      try {
        const res = yield call(deleteHospitalApi, payload)
        if (res?.code === 0) {
          openNotification({message:"删除医院成功"}, "success")
          // 删除成功之后重新更新 列表
          yield put({
            type: 'getHospitalManagementDataList'
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {}
    },

    // 医院管理 重置密码
    *resetHospitalPassword({ payload }, { select, call, put }) {
      try {
        const res = yield call(resetHospitalPasswordApi, payload)
        if (res?.code === 0) {
          openNotification({message:"密码已成功重置为 123456"},"success")
        } else {
          message.warn(res.msg)
        }
      } catch (err) {}
    },

    /* 新增医院 */
    *addOrUpdateHospital({ payload }, { select, call, put }) {
      try {
        let sOrU = payload.res.id ? updateHospitalApi : addHospitalApi,
          text = payload.res.id ? '修改' : '新增'
        const res = yield call(sOrU, payload.res)
        if (res?.code === 0) {
          message.success(text + '医院成功')
          payload?.parentForm?.resetFields()
          yield put({
            type: 'save',
            payload: {
              searchHospitalManagementForm: { ...STATE.searchHospitalManagementForm }
            }
          })
          // 新增或修改成功后, 执行 getHospitalManagementDataList effect, 更新列表
          yield put({
            type: 'getHospitalManagementDataList'
          })
        }
        return res
      } catch (err) {
        console.log(err)
      }
    },

    /* 开通医院账号 */
    *createDoctorAccount({ payload }, { call, put }) {
      try {
        const res = yield call(createDoctorAccountApi, payload.res)
        if ( res?.code === 0) {
          openNotification({message:"开通医生账号成功"}, "success")
          payload?.parentForm?.resetFields()
          yield put({
            type: 'save',
            payload: {
              searchHospitalManagementForm: { ...STATE.searchHospitalManagementForm }
            }
          })
          // yield put({
          //   type: 'getHospitalManagementDataList'
          // })
        }
        return res
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
