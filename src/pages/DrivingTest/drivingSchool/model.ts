import  {schoolInfoList, deleteGuan, addDrivingSchool, updateDrivingSchool,
  schoolConfigInfo, saveSchoolConfig, updateSchoolConfigStatus, schoolListExport
} from '@/api/drivingTest'
import {message} from 'antd'

export const STATE = {
  schoolInfoList: [],
  searDrivingSchoolForm: {
    pageNum: 1,
    pageSize: 10,
    name: "",
    schoolStatus: "",
    perdritypes: "",
  },
  isGuanModalVisible: false,
  isEditModalVisible: false,
  id: '',
  schoolConfigInfo: {},
  downloadUrl: '',
};
export default {
  namespace: 'drivingSchool',
  state: STATE,
  effects: {
    //获取考场列表
    * loadDrivingSchoolList({payload}, {select, call, put}) {
      try {
        const state = yield select(state => state.drivingSchool)
        const res = yield call(schoolInfoList, state.searDrivingSchoolForm)
        const {list, pagination} = res.data
        if (res.code === 0) {
          yield put({
            type: 'save', payload: {
              schoolInfoList: list,
              searDrivingSchoolForm: {...state.searDrivingSchoolForm, ...pagination}
            }
          })
        }
      } catch (err) {
      }
    },
    * deleteGuan({payload}, {select, call, put}) {
      try {
        const res = yield call(deleteGuan, payload)
        if (res && res.code === 0) {
          message.success('删除用户成功');
          yield put({
            type: 'loadDrivingSchoolList'
          })
        }
      } catch (err) {
      }
    },
    // 预录入配置详情
    * loadSchoolConfigInfo({payload}, {select, call, put}) {
      try {
        const res = yield call(schoolConfigInfo, payload)
        if (res && res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              schoolConfigInfo: res.data
            }
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
      }
    },
    // 保存驾校预录入配置
    * saveSchoolConfig({payload}, {select, call, put}) {
      try {
        const res = yield call(saveSchoolConfig, payload)
        if (res && res.code === 0) {
          message.success(res.msg);
          yield put({
            type: 'save',
            payload: {
              isEditModalVisible: false,
              searDrivingSchoolForm: {...STATE.searDrivingSchoolForm},
              id: ''
            }
          })
          yield put({
            type: 'loadDrivingSchoolList'
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
      }
    },
    // 更新驾校预录入配置状态
    * renewSchoolConfigStatus({payload}, {select, call, put}) {
      try {
        const res = yield call(updateSchoolConfigStatus, payload)
        if (res && res.code === 0) {
          message.success(res.msg);
          yield put({
            type: 'loadDrivingSchoolList'
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
      }
    },
    // 驾校列表-导出
    * exportDrivingSchoolList({payload}, {select, call, put}) {
      try {
        const res = yield call(schoolListExport, {...STATE.searDrivingSchoolForm})
        if (res && res.code === 0) {
          yield put({
            type: 'save',
            payload: {
              downloadUrl: res.data.url
            }
          })
        } else {
          message.error(res.msg)
        }
      } catch (err) {
      }
    },
    /* 新增用户 */
    * addDrivingSchool({payload}, {select, call, put}) {
      try {
        let sOrU = payload.id ? updateDrivingSchool : addDrivingSchool,
          text = payload.id ? '修改' : '新增';
        const res = yield call(sOrU, payload)
        if (res && res.code === 0) {
          message.success(text + '驾校信息成功');
          yield put({
            type: 'save',
            payload: {
              isGuanModalVisible: false
            }
          })
          yield put({
            type: 'loadDrivingSchoolList'
          })

        }
      } catch (err) {
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
