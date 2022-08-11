/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-03-30 14:27:45
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/Student/doctormanagement/model.ts
 */
import { doctormanagementList, addoctorman, addctorman, updatectorman } from '@/api/student'
import { message } from 'antd'
export const STATE = {
    doctormanagementList: [],
    searchMedicalForm: {
        pageNum: 1,
        pageSize: 10,
        doctorName: '',
        startTime: '',
        hospitalName: '',
    },
    isCuRoleModalVisible: false,
};
export default {
    namespace: 'doctormanagement',
    state: STATE,
    effects: {
        //获取角色列表
        *loadDoctormanagementList({ payload }, { select, call, put }) {
            const state = yield select(state => state.doctormanagement)
            delete state.searchMedicalForm.startTime
            const res = yield call(doctormanagementList, state.searchMedicalForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        doctormanagementList: list,
                        searchMedicalForm: { ...state.searchMedicalForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
        // 删除医生管理
        * addoctorman({ payload }, { select, call, put }) {
            try {
                const res = yield call(addoctorman, payload)
                if (res && res.code === 0) {
                    message.success('删除角色成功');
                    yield put({
                        type: 'loadDoctormanagementList'
                    })
                } else {
                    message.warn(res.msg)
                }
            } catch (err) {
            }
        },
        //  新增医生
        * addctorman({ payload }, { select, call, put }) {
            try {
                let sOrU = payload.postData.userId ? updatectorman : addctorman,
                    text = payload.postData.userId ? '修改' : '新增';
                const res = yield call(sOrU, payload.postData)
                if (res && res.code === 0) {
                    message.success(text + '医生成功');
                    payload.parentForm.resetFields()
                    yield put({
                        type: 'save',
                        payload: {
                            ishospitalModalVisible: false,
                            searchMedicalForm: { ...STATE.searchMedicalForm }
                        }
                    })
                    yield put({
                        type: 'loadDoctormanagementList'
                    })
                }
            } catch (err) {
                console.log(err)
            }
        },
    },
    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload }
        },
    },
}
