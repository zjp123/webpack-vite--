import { preliList,getanquanyuanList } from '@/api/student'
import { message } from 'antd'
export const STATE ={
        preliList: [],
        searchPreliminaryForm: {
            pageNum: 1,
            pageSize: 10,
            name:"",
            perdritype:"",
            businessType:""
        },
        keepaliveSearchForm: null,
        isCuRoleModalVisible: false,
        checkedKeys: [],
        halfCheckedKeys: [],
        menuList: []
}
export default {
    namespace: 'preliminary',
    state:STATE,
    effects: {
        //获取角色列表
        *loadPreliList({ payload }, { select, call, put }) {
            const state = yield select(state => state.preliminary)
            const res = yield call(preliList, state.searchPreliminaryForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        preliList: list,
                        searchPreliminaryForm: { ...state.searchPreliminaryForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }

        },
        *loadgetanquanyuanList({ payload }, { select, call, put }) {
            const state = yield select(state => state.preliminary)
            const res = yield call(getanquanyuanList, state.searchPreliminaryForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        getanquanyuanList: list,
                        searchPreliminaryForm: { ...state.searchPreliminaryForm, ...pagination }
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
