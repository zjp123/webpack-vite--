/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-03-31 17:39:22
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/System/role/model.ts
 */
import { roleList, addRole, updateRole, deleteRole } from '@/api/system'
import { formatParameters } from '@/utils'
import { message } from 'antd'
export const STATE= {
    roleList: [],
        searchRoleForm: {
            pageNum: 1,
            pageSize: 10,
        },
        isCuRoleModalVisible: false,
        checkedKeys: [],
        halfCheckedKeys: [],
}
export default {
    namespace: 'role',
    state: {...STATE},
    effects: {
        //获取角色列表
        *loadRoleList({ payload }, { select, call, put }) {
            const state = yield select(state => state.role)
            const res = yield call(roleList, state.searchRoleForm)
            if (res.code === 0) {
                const { list, pagination } = res.data
                yield put({
                    type: 'save', payload: {
                        roleList: list,
                        searchRoleForm: { ...state.searchRoleForm, ...pagination }
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
        /* 编辑角色 */
        * addRole({ payload }, { select, call, put }) {
            try {
                let sOrU = payload.res.roleId ? updateRole : addRole,
                    text = payload.res.roleId ? '修改' : '新增';
                let date = formatParameters(payload.res, {
                    numTrunBoole: ['deptCheckStrictly', 'menuCheckStrictly']
                })
                date = {remark: '', ...date}
                const res = yield call(sOrU, date)
                if (res && res.code === 0) {
                    message.success(text + '角色成功');
                    payload.parentForm.resetFields()

                    yield put({
                        type: 'save',
                        payload: {
                            isCuRoleModalVisible: false,
                            searchRoleForm: { ...STATE.searchRoleForm }
                        }
                    })
                    yield put({
                        type: 'loadRoleList'
                    })
                } else {
                    message.warn(res.msg)
                }
            } catch (err) {
            }
        },

        /* 删除角色用户 */
        * deleteRole({ payload }, { select, call, put }) {
            try {
                const res = yield call(deleteRole, payload)
                if (res && res.code === 0) {
                    message.success('删除角色成功');
                    yield put({
                        type: 'loadRoleList'
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
