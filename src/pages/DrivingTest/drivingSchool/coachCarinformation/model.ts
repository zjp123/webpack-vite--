import {coachCarList, SouYList, getdrvingIofo, updateDrivingSchool, getDrivInfo} from '@/api/drivingTest'
import {message} from 'antd'

export const STATE = {
  coachCarList: [],
  searchCoachCarinformationForm: {
    pageNum: 1,
    pageSize: 10,
    limit: 10,
  },
  SouYList: [],
  searchSouYForm: {
    pageNum: 1,
    pageSize: 10,
    limit: 10,
  },
  isCoachModalVisible: false,
  drivInfo: {},
};
export default {
  namespace: 'coachCarinformation',
  state: {...STATE},
  effects: {
    //获取考场人像比对结果监控列表
    * loadCoachCarList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.coachCarinformation)
        const res = yield call(coachCarList, state.searchCoachCarinformationForm)
        const {list, pagination} = res.data
        if (res.code === 0) {
          yield put({
            type: 'save', payload: {
              coachCarList: list,
              searchCoachCarinformationForm: {...state.searchCoachCarinformationForm, ...pagination}
            }
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
      }

    },
    * loadSouYList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.coachCarinformation)
        const res = yield call(SouYList, state.searchSouYForm)
        const {list, pagination} = res.data
        if (res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              SouYList: list,
              searchSouYForm: {...state.searchSouYForm, ...pagination}
            }
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
      }
    },
    /* 修改驾校 */
    * addDrivingSchool({payload}, {select, call, put}) {
      try {
        let sOrU = payload.id ? updateDrivingSchool : getdrvingIofo,
          text = payload.id ? '修改' : '新增';
        const res = yield call(sOrU, payload)
        if (res && res.code === 0) {
          message.success(text + '驾校修改成功');
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
    * loadDrivInfo({payload}, {select, call, put}) {
      try {
        const res = yield call(getDrivInfo, payload)
        if (res && res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              drivInfo: res.data,
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 新增考场 */
    //       * addDrivingSchool({ payload }, { select, call, put }) {
    //       try {
    //           let sOrU = payload.id ? updateDrivingSchool : addDrivingSchool,
    //               text = payload.id ? '修改' : '新增';
    //           const res = yield call(sOrU, payload)
    //           if (res && res.code === 0) {
    //               message.success(text + '驾校信息成功');
    //               yield put({
    //                   type: 'coachCarinformation/save',
    //                   payload: {
    //                       isGuanModalVisible: false
    //                   }
    //               })
    //               yield put({
    //                   type: 'coachCarinformation/loadCoachCarList'
    //               })

    //           }
    //       } catch (err) {
    //           console.log(err)
    //       }
    //   },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
