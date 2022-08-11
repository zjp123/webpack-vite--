import { getExaminerInfoCardDataApi, getExaminerListDataApi, examinerInformationListApi, getStudentListDataApi, addOrUpdateExaminerApi } from '@/api/drivingTest'
import {message} from 'antd'

export const STATE = {
  examinerInformList: [],
  searchExaminerInformationForm: {
    pageNum: 1,
    pageSize: 10,
    limit: 10,
  },
  examinerInfoCardData:{},
  examinerModalVisible: false,
  // 考官详情里 监考列表form
  examinerDetailForm:{
    pageNum: 1,
    pageSize: 10,
    limit: 10,
  },
  examinerDetailList:[], // 考官详情 list
  examinerInvigilateForm:{
    pageNum: 1,
    pageSize: 10,
    limit: 10,
  },
  // 考官管理 考生名单form
  searchExaminerStudentForm:{
    pageNum: 1,
    pageSize: 10,
    limit: 10,
  },
  // 考官管理 考生名单列表
  examinerStudentList:[],
}
export default {
  namespace: 'examinerInformation',
  state: STATE,
  effects: {
    //考官管理信息列表
    * loadExaminerInformationList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.examinerInformation)
        const res = yield call(examinerInformationListApi, state.searchExaminerInformationForm)
        if (res.code === 0) {
          const {list, pagination} = res.data
          yield put({
            type: 'save', payload: {
              examinerInformList: list || [],
              searchExaminerInformationForm: {...state.searchExaminerInformationForm, ...pagination}
            }
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },
    // 考官信息管理 详情
    * getInfoCardData({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.examinerInformation)
        const res = yield call(getExaminerInfoCardDataApi, {...payload})
        if (res?.code === 0) {
          yield put({
            type: 'save',
            payload: {
              examinerInfoCardData: res?.data,
            }
          })
          return res
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },

    // 修改考官信息
    * addOrUpdateExaminer({payload}, {select, call, put}) {
      try {
        let sOrU = payload.id ? ()=>{} : addOrUpdateExaminerApi,
          text = payload.id ? '修改' : '新增';
        const res = yield call(sOrU, {...payload, phone: payload?.tel})
        if (res?.code === 0) {
          message.success(text + '考官修改成功');
        }
        return res
      } catch (err) {
        console.log(err)
      }
    },

    // 获取考官排期列表
    * getExaminerListData({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.examinerInformation)
        const res = yield call(getExaminerListDataApi, {...state.examinerDetailForm,...payload})
        if (res?.code === 0) {
          const {list, pagination} = res.data
          yield put({
            type: 'save',
            payload: {
              examinerDetailList: list || [],
              examinerDetailForm: {...state.examinerDetailForm, ...pagination}
            }
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },

    // 考生名单列表
    *getStudentListData({ payload }, { select, call, put }) {
      try {
        const state = yield select(state => state.examinerInformation)
        const res = yield call(getStudentListDataApi, {...state.searchExaminerStudentForm,...payload})
        if ( res?.code === 0) {
          const { list, pagination } = res?.data
          yield put({
            type: 'save',
            payload: {
              examinerStudentList: list,
              searchExaminerStudentForm: { ...state.searchExaminerStudentForm, ...pagination }
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
