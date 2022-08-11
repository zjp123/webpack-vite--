import {TheoperationList, ThelogList, RequestlogList, ThesecurityList, operlogExport} from '@/api/system'
import {message} from 'antd'

export const STATE = {
  // 操作日志
  theoperationList: [],
  searchTheoperationForm: {
    pageNum: 1,
    pageSize: 10,
  },
  //登录日志
  thelogList: [],
  searchThelogForm: {
    pageNum: 1,
    pageSize: 10,
  },
  //请求日志
  requestlogList: [],
  searchRequestlogForm: {
    pageNum: 1,
    pageSize: 10,
  },
  //安全日志
  securityList: [],
  searchSecurityForm: {
    pageNum: 1,
    pageSize: 10,
  }
};
export default {
  namespace: 'gement',
  state: STATE,
  effects: {
    // 登录日志
    * loadThelogList({payload}, {select, call, put}) {
      const state = yield select(state => state.gement)
      const res = yield call(ThelogList, state.searchThelogForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save', payload: {
            thelogList: list,
            searchThelogForm: {...state.searchThelogForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 操作日志
    * loadTheoperationList({payload}, {select, call, put}) {
      const state = yield select(state => state.gement)
      const res = yield call(TheoperationList, state.searchTheoperationForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save', payload: {
            theoperationList: list,
            searchTheoperationForm: {...state.searchTheoperationForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 安全日志
    * loadSecurityList({payload}, {select, call, put}) {
      const state = yield select(state => state.gement)
      const res = yield call(ThesecurityList, state.searchSecurityForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save', payload: {
            securityList: list,
            searchSecurityForm: {...state.searchSecurityForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    // 请求日志
    * loadRequestlogList({payload}, {select, call, put}) {
      const state = yield select(state => state.gement)
      const res = yield call(RequestlogList, state.searchRequestlogForm)
      if (res.code === 0) {
        const {list, pagination} = res.data
        yield put({
          type: 'save', payload: {
            requestlogList: list,
            searchRequestlogForm: {...state.searchRequestlogForm, ...pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    /* 导出 */
    * export({payload}, {select, call, put}) {
      try {
        const res = yield call(operlogExport, payload)
        const link = document.createElement('a')
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        let num = ''
        for (let i = 0; i < 10; i++) {
          num += Math.ceil(Math.random() * 10)
        }
        link.setAttribute('download', '' + num + '.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

      } catch (err) {
        console.error(err, 'err');
      }
    },
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    },
  },
}
