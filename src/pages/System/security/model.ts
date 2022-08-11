import { SecurityPolicyList,policysmodified} from '@/api/system'
import { message } from 'antd'
export const STATE={
    SecurityPolicyList: [],
   // 安全策略
   searchTheoperationForm: {
    pageNum: 1,
    pageSize: 10,
    configName:""
},
}

export default {
    namespace: 'security',
    state: {...STATE},
    effects: {
        // 安全策略列表
        *loadsSecurityPolicyList({ payload }, { select, call, put }) {
            const state = yield select(state => state.security)
            const res = yield call(SecurityPolicyList, state.searchTheoperationForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        SecurityPolicyList: list,
                        searchTheoperationForm: { ...state.searchTheoperationForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },

        //修改安全策略
        * addDepartment({ payload }, { select, call, put }) {
        try {
            let sOrU = payload.id ? policysmodified : policysmodified,
                text = payload.id ? ' ' : '修改';
            const res = yield call(sOrU, payload)
            if (res && res.code === 0) {
                message.success(text + '修改成功');
                yield put({
                    type: 'save',
                    payload: {
                        isDepartmentVisible: false
                    }
                })
                yield put({
                    type: 'loadsSecurityPolicyList'
                })
            }
        } catch (err) {
        }
    },

    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        },
    },
}
