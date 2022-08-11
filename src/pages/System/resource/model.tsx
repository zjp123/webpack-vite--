/*
 * @Author: your name
 * @Date: 2022-01-11 17:08:58
 * @LastEditTime: 2022-03-31 17:47:05
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /jxt-paperless/src/pages/System/resource/model.tsx
 */
import { resourceList, addResource, updateResource, deleteResource } from '@/api/system'
import { formatParameters } from '@/utils'
import { message } from 'antd'
export const STATE= {
    resourceList: [],
        isCuResourceModalVisible: false,
        checkedKeys: [],
        halfCheckedKeys: [],
        searchResourceForm: {
            pageNum: 1
        },
}
export default {
    namespace: 'resource',
    state: {...STATE },
    effects: {
        //获取菜单列表
        *loadResourceList({ payload }, { select, call, put }) {
            const state = yield select(state => state.resource)
            const res = yield call(resourceList, state.searchResourceForm)
            if (res.code === 0) {
                yield put({
                    type: 'save', payload: {
                        resourceList: res.data,
                    }
                })
            } else {
                message.warn(res.msg)
            }
        },
        /* 编辑菜单 */
        * addResource({ payload }, { select, call, put }) {
            try {
                let sOrU = payload.postData.menuId ? updateResource : addResource,
                    text = payload.postData.menuId ? '修改' : '新增';
                const date = formatParameters(payload.postData, {
                    numTrunBoole: ['deptCheckStrictly', 'menuCheckStrictly']
                })
                const res = yield call(sOrU, date)
                if (res && res.code === 0) {
                    message.success(text + '菜单成功');
                    payload.parentForm.resetFields()

                    yield put({
                        type: "save",
                        payload: {
                            isCuResourceModalVisible: false,
                            searchResourceForm:{...STATE.searchResourceForm}

                        }
                    })
                    yield put({
                        type: 'loadResourceList'
                    })
                } else {
                    message.warn(res.msg)
                }
            } catch (err) {
            }
        },

        /* 删除菜单用户 */
        * deleteResource({ payload }, { select, call, put }) {
            try {
                const res = yield call(deleteResource, payload)
                if (res && res.code === 0) {
                    message.success('删除菜单成功');
                    yield put({
                        type: 'loadResourceList'
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
