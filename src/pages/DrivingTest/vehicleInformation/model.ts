/*
 * @Author: your name
 * @Date: 2022-03-21 16:43:59
 * @LastEditTime: 2022-03-30 14:23:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/DrivingTest/vehicleInformation/model.ts
 */
import { examSiteList, updateExamCar, addExamCar, deleteExamCar } from '@/api/drivingTest'
import { message } from 'antd'
export const STATE = {
    examSiteList: [{ id: 1 }],
    searchVehicleInformationForm: {
        pageNum: 1,
        pageSize: 10,
        examCode: '',
        licenseNum: '',
        perdritype: '',
        type: '',
    },
    isCuVehicleInformationVisible: false,
}
export default {
    namespace: 'vehicleInformation',
    state: { ...STATE },
    effects: {
        //获取部门管理列表
        *loadExamSiteList({ payload }, { select, call, put }) {
            const state = yield select(state => state.vehicleInformation)
            const res = yield call(examSiteList, state.searchVehicleInformationForm)
            if (res.code === 0) {
                yield put({
                    type: 'save', payload: {
                        examSiteList: res.data.list,
                        searchVehicleInformationForm: { ...state.searchVehicleInformationForm, ...res.data.pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
        /* 编辑部门 */
        * addExamCar({ payload }, { select, call, put }) {
            try {
                let sOrU = payload.postData.id ? updateExamCar : addExamCar,
                    text = payload.postData.id ? '修改' : '新增';
                const res = yield call(sOrU, payload.postData)
                if (res && res.code === 0) {
                    message.success(text + '车辆信息成功');
                    payload.parentForm.resetFields()
                    yield put({
                        type: 'save',
                        payload: {
                            isCuVehicleInformationVisible: false,
                            searchVehicleInformationForm: { ...STATE.searchVehicleInformationForm }
                        }
                    })
                    yield put({
                        type: 'loadExamSiteList'
                    })
                }
            } catch (err) {
            }
        },
        /* 删除部门用户 */
        * deleteExamCar({ payload }, { select, call, put }) {
            try {
                const res = yield call(deleteExamCar, payload)
                if (res && res.code === 0) {
                    message.success('删除车辆信息成功');
                    yield put({
                        type: 'loadExamSiteList'
                    })
                } else {
                    message.warn(res.msg)
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
