import {
  informationList,
  appoiNtmentList,
  compAredList,
  upDateformation,
  getInformationInfo,
  electronicList,
  lackFormationList,
  businessLogListApi,
  batchDownload,
  generateStuArchivesApi,
  getFlowList, updateInformationInfo, getStudentInfoApi
} from '@/api/electronic'
import { message } from 'antd'
import {ELECTRONIC_ARCHIVE_MANAGE_STEPS} from "@/utils/constants";
export const STATE = {
  informationList: [],
  flowList: [],
  searchFlowForm: {
    pageNum: 1,
    pageSize: 10
  },
  keepaliveSearchForm: null,
  startTime: '',
  searchInformationForm: {
    pageNum: 1,
    pageSize: 10
  },
  //档案清单
  electronicList: [],
  searchElectronicForm: {
    pageNum: 1,
    pageSize: 10
  },
  //人像
  compAredList: [],
  searchCompAredForm: {
    pageNum: 1,
    pageSize: 10
  },
  //预约
  appoiNtmentList: [],
  searchAppoiNtmentForm: {
    pageNum: 1,
    pageSize: 10
  },
  //欠费
  lackFormationList: [],
  searchLackFormationForm: {
    pageNum: 1,
    pageSize: 10
  },
  // 业务日志
  businessLogList: [],
  searchBusinessLogForm: {
    pageNum: 1,
    pageSize: 10
  },
  isCuInformationModalVisible: false,
  isShowInformation: false,
  userInfo: {},
  params: {},
  currentStep: []
}
export default {
  namespace: 'information',
  state: STATE,
  effects: {
    //获取角色列表
    *loadInformationList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(informationList, state.searchInformationForm)
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: 'save',
          payload: {
            informationList: list || [],
            searchInformationForm: { ...state.searchInformationForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取预约信息列表
    *loadAppoiNtmentList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(appoiNtmentList, { ...state.searchAppoiNtmentForm, ...payload })
      if (res.code === 0) {
        const { list, pagination } = res.data

        yield put({
          type: 'save',
          payload: {
            appoiNtmentList: list || [],
            searchAppoiNtmentForm: { ...state.searchAppoiNtmentForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取人像对比信息列表
    *loadCompAredList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(compAredList, { ...state.searchCompAredForm, ...payload })
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: 'save',
          payload: {
            compAredList: list || [],
            searchCompAredForm: { ...state.searchCompAredForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取业务日志列表
    *loadBusinessLogList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(businessLogListApi, { ...state.searchBusinessLogForm, ...payload })
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: 'save',
          payload: {
            businessLogList: list || [],
            searchBusinessLogForm: { ...state.searchBusinessLogForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取档案清单信息列表
    *loadElectronicList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(electronicList, { ...payload })
      const { list, pagination } = res.data
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            electronicList: list || [],
            searchElectronicForm: { ...state.searchElectronicForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 获取学员流水列表
    *loadFlowList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(getFlowList, { ...payload })
      const { list, pagination } = res.data
      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            flowList: list || [],
            searchFlowForm: { ...state.searchFlowForm, ...pagination },

          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    //获取欠费信息列表
    *loadLackFormationList({ payload }, { select, call, put }) {
      const state = yield select(state => state.information)
      const res = yield call(lackFormationList, { ...state.searchLackFormationForm, ...payload })
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: 'save',
          payload: {
            lackFormationList: list || [],
            searchLackFormationForm: { ...state.searchLackFormationForm, ...pagination }
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
    *loadModification({ payload }, { select, call, put }) {
      try {
        const res = yield call(getInformationInfo, payload)
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
    },
    //生成指定学员电子档案
    *generateStuArchives({ payload }, { select, call, put }) {
      const res = yield call(generateStuArchivesApi, payload)
      if (res.code === 0) {
        message.info(res.msg)
      } else {
        message.warn(res.msg)
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
