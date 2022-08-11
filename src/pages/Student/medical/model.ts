import { medicalList,  } from '@/api/student'
import { message } from 'antd'
export const STATE={
        medicalList: [],
        searchMedicalForm: {
            pageNum: 1,
            pageSize: 10,
            seach:"",
            roleName:"",
            startTime:"",
            healthResult:""
        },
        isCuRoleModalVisible: false,
};
export default {
    namespace: 'medical',
    state: STATE,
    effects: {
        //获取角色列表
        *loadMedicalList({ payload }, { select, call, put }) {
            const state = yield select(state => state.medical)
            const res = yield call(medicalList, state.searchMedicalForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        medicalList: list,
                        searchMedicalForm: { ...state.searchMedicalForm, ...pagination }
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
