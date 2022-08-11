import { comparisonList, details } from '@/api/faceRecognition'
export const STATE = {
    comparisonList: [],
    keepaliveSearchForm: null,
    searchComparisonForm: {
        pageNum: 1,
        pageSize: 10,
        limit: 10
    },
    detailsInfo: {}
};

export default {
    namespace: 'comparison',
    state: STATE,
    effects: {
        //获取考场人像比对结果监控列表
        *loadComparisonList({ payload }, { select, call, put }) {
            const state = yield select(state => state.comparison)
            const res = yield call(comparisonList, state.searchComparisonForm)
            if (res.code === 0) {

                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        comparisonList: list,
                        searchComparisonForm: { ...state.searchComparisonForm, ...pagination }
                    }
                })
            }
        },
        ///详情接口
        *details({ payload }, { select, call, put }) {
            const res = yield call(details, payload)
            if (res.code === 0) {
                yield put({
                    type: 'save', payload: {
                        detailsInfo: res.data,
                    }
                })
            }
        },

    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        },
    },
}
