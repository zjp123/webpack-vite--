import {
  examinationList,
  getExaminationPlanListDataApi,
  getInfoCardDataApi,
  editExaminationRoomApi,
  addExaminationRoomApi,
  getStudentListDataApi
} from '@/api/drivingTest'
import { openNotification } from '@/components/OpenNotification'
export const STATE = {
  examinationList: [],
  siteStatus: '',
  searExaminationRoomForm: {
    pageNum: 1,
    pageSize: 10
  },
  // 考场考试计划 form
  searchExaminationPlanForm: {
    pageNum: 1,
    pageSize: 10
  },
  // 考生名单form
  searchExaminationStudentForm: {
    pageNum: 1,
    pageSize: 10
  },
  infoCardData: {},
  examinationPlanList: [], // 考试计划list
  examinationPlanStudentList: [] // 考生名单list
}
export default {
  namespace: 'examinationRoom',
  state: STATE,
  effects: {
    //考场列表
    *loadExaminationList({ payload }, { select, call, put }) {
      try {
        const state = yield select(state => state.examinationRoom)
        const res = yield call(examinationList, state.searExaminationRoomForm)
        const { list, pagination } = res.data
        if (res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              examinationList: list,
              searExaminationRoomForm: { ...state.searExaminationRoomForm, ...pagination }
            }
          })
        }
      } catch (err) {}
    },
    /* 修改考场详情 */
    *editExaminationRoom({ payload }, { select, call, put }) {
      try {
        let sOrU = payload.id ? editExaminationRoomApi : addExaminationRoomApi,
          text = payload.id ? '修改' : '新增'
        const res = yield call(sOrU, payload)
        if (res && res.code === 0) {
          openNotification({ message: '修改考场详情成功' }, 'success')
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
    *getInfoCardData({ payload }, { select, call, put }) {
      try {
        let id = payload.id
        const res = yield call(getInfoCardDataApi, { id })
        if (res && res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              infoCardData: res.data
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 获取考场排期列表
    *getExaminationPlanListData({ payload }, { select, call, put }) {
      try {
        let examSiteId = payload.examSiteId
        const state = yield select(state => state.examinationRoom)
        const res = yield call(getExaminationPlanListDataApi, { examSiteId })
        if (res && res.code === 0) {
          const { list, pagination } = res?.data
          yield put({
            type: 'save',
            payload: {
              examinationPlanList: list,
              searchExaminationPlanForm: { ...state.searchExaminationPlanForm, ...pagination }
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 考生名单列表
    *getStudentListData({ payload }, { select, call, put }) {
      try {
        const state = yield select(state => state.examinationRoom)
        const res = yield call(getStudentListDataApi, {...payload, ...state.searchExaminationStudentForm})
        if ( res?.code === 0) {
          const { list, pagination } = res?.data
          yield put({
            type: 'save',
            payload: {
              examinationPlanStudentList: list,
              searchExaminationStudentForm: { ...state.searchExaminationStudentForm, ...pagination }
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
