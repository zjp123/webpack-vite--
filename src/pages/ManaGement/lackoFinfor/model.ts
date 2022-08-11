import { lackofinforList } from '@/api/management'
export  const STATE= {
    lackofinforList: [],
    searchLackofinforForm: {
        pageNum: 1,
        pageSize: 10,
    },
}
export default {
    namespace: 'lackoFinfor',
    state: STATE,
    effects: {
        //获取角色列表
        *loadLackofinforList({ payload }, { select, call, put }) {
            const state = yield select(state => state.lackoFinfor)
            const res = yield call(lackofinforList, state.searchLackofinforForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        lackofinforList: list,
                        searchLackofinforForm: { ...state.searchLackofinforForm, ...pagination }
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
