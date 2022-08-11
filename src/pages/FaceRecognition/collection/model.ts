import { collectionList } from '@/api/faceRecognition'
import { message } from 'antd'
export const STATE = {
    collectionList: [],
    searchCollectionForm: {
        pageNum: 1,
        pageSize: 10,
    },
    isCheckCollectionModalVisible: false
};
export default {
    namespace: 'collection',
    state: STATE,
    effects: {
        //获取考场人像比对结果监控列表
        *loadCollectionList({ payload }, { select, call, put }) {
            const state = yield select(state => state.collection)
            const res = yield call(collectionList, state.searchCollectionForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        collectionList: list,
                        searchCollectionForm: { ...state.searchCollectionForm, ...pagination }
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
