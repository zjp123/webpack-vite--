import {
  recordingList,
  upDateformation,
  getInformationInfo,
  updateInformationInfo,
  getFlowList,
  getStudentInfoApi
} from '@/api/electronic'
import {message} from 'antd'
import {ELECTRONIC_ARCHIVE_MANAGE_STEPS} from "@/utils/constants";

export const STATE = {
  recordingList: [],
  searchRecordingForm: {
    pageNum: 1,
    pageSize: 10,
    archivesStatus: "1"
  },
  isCheckRecordingModalVisible: false,
  currentStep: [],
  userInfo: {}
}
export default {
  namespace: 'recording',
  state: STATE,
  effects: {
    //获取角色列表x
    * loadRecordingList({payload}, {select, call, put}) {
      const state = yield select(state => state.recording)
      const res = yield call(getFlowList, state.searchRecordingForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save', payload: {
            recordingList: list || [],
            searchRecordingForm: {...state.searchRecordingForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    /* 修改电子档案 */
    *addModification({ payload }, { select, call, put }) {
      try {
        let sOrU = updateInformationInfo,
          text = '修改'
        const res = yield call(sOrU, payload)
        if (res && res.code === 0) {
          message.success(text + '电子档案修改成功')
          yield put({
            type: 'save',
            payload: {
              isCoachModalVisible: false
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 加载电子档案 */
    * loadModification({payload}, {select, call, put}) {
      try {
        const res = yield call(getInformationInfo, payload)
        const state = yield select(state => state.global)
        if (res && res.code === 0) {
          let currentStepItem = ELECTRONIC_ARCHIVE_MANAGE_STEPS.find((item) => {
            return item.steps.includes(res?.data?.stage) // 根据 stage 获取当前进度项
          })
          const registrationTime = res?.data?.registrationTime
          const str = registrationTime && +registrationTime.substring(0, 4) + 3
          const time = registrationTime ? registrationTime.substring(4, registrationTime.length) : ""
          yield put({
            type: 'save',
            payload: {
              userInfo: {
                ...res?.data,
                businessType: (state.bizTypeList.find(item => item.value === res?.data?.businessType) || {}).label,
                effectiveDate: registrationTime && registrationTime + "-" + (str + time)
              },
              currentStep: currentStepItem?.currentStep
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    *loadStudentInfo({ payload }, { select, call, put }) {
      try {
        const res = yield call(getStudentInfoApi, payload)
        const state = yield select(state => state.global)
        if (res && res.code === 0) {
          const registrationTime = res?.data?.registrationTime
          const str = registrationTime && +registrationTime.substring(0, 4) + 3
          const time = registrationTime ? registrationTime.substring(4, registrationTime.length) : ""
          yield put({
            type: 'save',
            payload: {
              userInfo: {
                ...res?.data,
                businessType: (state.bizTypeList.find(item => item.value === res?.data?.businessType) || {}).label,
                effectiveDate: registrationTime && registrationTime + "-" + (str + time)
              }
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    }

  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
