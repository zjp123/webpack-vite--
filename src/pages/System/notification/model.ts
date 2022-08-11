import { message } from 'antd'
import { loadNoticeListApi, saveOrUpdateNoticeApi, loadNoticeDetailApi, revokeNoticeApi } from '@/api/system'

export const STATE = {
  noticeSearchForm: {
    pageNum: 1,
    pageSize: 10
  },
  noticeList: [],
  id: '',
  revokeNoticeId: '',
  visible: false,
  noticeType: [],
  noticeStatus: [],
  noticeFrequency: [],
  noticeUserLevel: [],
  noticeSchoolList: [],
  notice_content_template: [],
  initContent: '',
  currentContent: '',
  defaultFileList: [],
  noticeDetail: {}
}

export default {
  namespace: 'notification',
  state: { ...STATE },
  effects: {
    *loadNoticeList({ payload }, { select, call, put }) {
      const state = yield select(state => state.notification)
      const res = yield call(loadNoticeListApi, state.noticeSearchForm)

      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            noticeList: res.data.list,
            noticeSearchForm: {...state.noticeSearchForm, ...res.data.pagination}
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    *loadNoticeDetail({ payload }, { select, call, put }) {
      const state = yield select(state => state.notification)
      const res = yield call(loadNoticeDetailApi, { id: state.id })

      if (res.code === 0) {
        yield put({
          type: 'save',
          payload: {
            noticeDetail: res.data,
            defaultFileList: res.data?.annex || [],
          }
        })
      } else {
        message.warn(res.msg)
      }
    },
    *revokeNotice({ payload }, { select, call, put }) {
      const state = yield select(state => state.notification)
      const res = yield call(revokeNoticeApi, payload)

      if (res.code === 0) {
        message.success(res.msg)
        yield put({
          type: 'loadNoticeList'
        })
      } else {
        message.warn(res.msg)
      }
    },
    *saveOrUpdateNotice({ payload }, { select, call, put }) {
      const state = yield select(state => state.notification)
      const res = yield call(saveOrUpdateNoticeApi, payload)

      if (res.code === 0) {
        message.success(res.msg)
        yield put({
          type: 'loadNoticeList',
          payload: {
            ...state.noticeSearchForm,
            visible: false
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
    }
  }
}
