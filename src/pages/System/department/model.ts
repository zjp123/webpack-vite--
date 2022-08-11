/*
 * @Author: your name
 * @Date: 2022-02-19 14:08:57
 * @LastEditTime: 2022-03-31 17:43:01
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/System/department/model.ts
 */
import { departmentList, updateAddDepartment, addDepartment, deleteDepartment } from '@/api/system'
import { message } from 'antd'
export const STATE= {
    departmentList: [],
    searchDepartmentForm: {
    },
    isDepartmentVisible: false,
    treeSelectList: []
}
export default {
    namespace: 'department',
    state: {...STATE},
    effects: {
        //获取部门管理列表
        *loadDepartmentList({ payload }, { select, call, put }) {
            const state = yield select(state => state.department)
            const res = yield call(departmentList, state.searchDepartmentForm)
            if (res.code === 0) {
                yield put({
                    type: 'save', payload: {
                        departmentList: res.data,
                        searchDepartmentForm: { ...state.searchDepartmentForm }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
        /* 编辑部门 */
        * addDepartment({ payload }, { select, call, put }) {
            try {
                let sOrU = payload.res.deptId ? updateAddDepartment : addDepartment,
                    text = payload.res.deptId ? '修改' : '新增';
                const res = yield call(sOrU, payload.res)
                if (res && res.code === 0) {
                    message.success(text + '部门成功');
                    payload.parentForm.resetFields()
                    yield put({
                        type: 'save',
                        payload: {
                            isDepartmentVisible: false,
                            searchDepartmentForm: { ...STATE.searchDepartmentForm }
                        }
                    })
                    yield put({
                        type: 'loadDepartmentList'
                    })
                }
            } catch (err) {
            }
        },
        /* 删除部门用户 */
        * deleteDepartment({ payload }, { select, call, put }) {
            try {
                const res = yield call(deleteDepartment, payload)
                if (res && res.code === 0) {
                    message.success('删除部门成功');
                    yield put({
                        type: 'loadDepartmentList'
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
