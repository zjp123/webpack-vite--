import { spotCheckList, addCheck, checkStudentList } from '@/api/electronic'
import { message } from 'antd'
export const STATE={
    spotCheckList: [],
    searchSpotCheckForm
    : {
        pageNum: 1,
        pageSize: 10,
    },
    isCheckSpotCheckModalVisible: false,
    checkStudentList: [],
    searchCheckStudentForm: {
        pageNum: 1,
        pageSize: 10,
    },
}
export default {
    namespace: 'spotCheck',
    state: {...STATE},
    effects: {
        //获取角色列表
        *loadSpotCheckList({ payload }, { select, call, put }) {
            const state = yield select(state => state.spotCheck)
            const res = yield call(spotCheckList, { ...state.searchSpotCheckForm, ...payload })
            if (res.code === 0) {
                const { list, pagination } = res.data

                yield put({
                    type: 'save', payload: {
                        spotCheckList: list,
                        searchSpotCheckForm: { ...state.searchSpotCheckForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
        /* 新增*/
        * addCheck({ payload }, { select, call, put }) {
            try {
                const res = yield call(addCheck, { ...payload, count: 1 })
                if (res && res.code === 0) {
                    message.success('新增抽查任务成功');
                    yield put({
                        type: 'spotCheck/save',
                        payload: {
                            isGuanModalVisible: false
                        }
                    })
                    yield put({
                        type: 'spotCheck/loadSpotCheckList'
                    })

                }
            } catch (err) {
            }
        },
        //任务详情列表
        *loadCheckStudentList({ payload }, { select, call, put }) {
            const state = yield select(state => state.spotCheck)
            const res = yield call(checkStudentList, { ...state.searchCheckStudentForm, ...payload })
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        checkStudentList: list || [],
                        searchCheckStudentForm: { ...state.searchCheckStudentForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        },
    },
}
