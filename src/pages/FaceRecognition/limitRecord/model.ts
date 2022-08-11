import { limitRecordList, change } from '@/api/faceRecognition'
import { formatParameters } from '@/utils'
import { message } from 'antd'
export const STATE = {
    limitRecordList: [],
    searchLimitRecordForm: {
        pageNum: 1,
        pageSize: 10,
    },
}
export default {
    namespace: 'limitRecord',
    state: STATE,
    effects: {
        //修改状态
        * change({ payload }, { select, call, put }) {
            try {
                const res = yield call(change, payload)
                if (res && res.code === 0) {
                    message.success('操作完成');
                    yield put({
                        type: 'loadLimitRecordList'
                    })
                }
            } catch (err) {
            }
        },
        //获取考场人像比对结果监控列表
        *loadLimitRecordList({ payload }, { select, call, put }) {
            const state = yield select(state => state.limitRecord)
            const res = yield call(limitRecordList, state.searchLimitRecordForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        limitRecordList: list,
                        searchLimitRecordForm: { ...state.searchLimitRecordForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        }
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        },
    },
}
