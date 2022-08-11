import { loadManageListApi, saveSignedApi, checkFaceApi, checkPwdApi, startOrCloseExaminationApi } from "@/api/examiner"
import { message } from "antd"

const STATE = {
  manageList: [], // 考试管理列表
  searchmanageForm: { // 考生管理form
    pageNum: 1,
    pageSize: 10
  },
  isShowCurrentContent: true, // 考官管理表格列表
  isShowFaceRecognition: false, // 是否显示人脸识别框
  isShowSignature: false, // 是否显示签字框
  isShowFailedModal: false, // 是否显示认证失败对话框
  isShowSignModal: false, // 密码验证成功后,显示签名板
  isShowSuccessModal: false, // 认证成功对话框

  startType: undefined, // 考试开启方式 0人像，1密码  考试状态为 true时必传
  isCheckRecordingModalVisible: false,
  startOrCloseData: { // 开启或关闭考试参数
    id: undefined,
    examStatus: undefined, // 考试开启状态 1开启，0关闭
    startType: undefined // 考试开启方式 0人像，1密码
  },
  examinationSiteList: [], // 认证成功考场列表
  signId: undefined // 人脸对比识别返回的 signId
}
export default {
  namespace: "manage",
  state: STATE,
  effects: {
    // 获取考试管理列表
    * loadManageList({ payload }, { select, call, put }) {
      const state = yield select(state => state.manage)
      const res = yield call(loadManageListApi, state.searchmanageForm)
      if (res.code === 0) {
        const { list, pagination } = res.data
        yield put({
          type: "save",
          payload: {
            manageList: list,
            searchmanageForm: { ...state.searchmanageForm, ...pagination }
          }
        })
      } else {
        message.warn(res.msg)
      }
    },

    // 拍照比对照片
    * checkFace({ payload }, { select, call, put }) {
      try {
        const res = yield call(checkFaceApi, { ...payload, lastTime: 1 })
        return res
      } catch (e) {
        console.log(e)
      }
    },
    // 输入密码, 比对密码
    * checkPwd({ payload }, { select, call, put }) {
      try {
        const res = yield call(checkPwdApi, { ...payload, lastTime: 1 })
        return res
      } catch (e) {
        console.log(e)
      }
    },

    // 签字保存
    * saveSigned({ payload }, { select, call, put }) {
      // const state = yield select(state => state.manage)
      console.log("签字保存 -->>", payload)
      return yield call(saveSignedApi, { ...payload })
    },

    // 开启或关闭考试
    * startOrCloseExamination({ payload }, { select, call, put }) {
      const state = yield select(state => state.manage)
      const res = yield call(startOrCloseExaminationApi, {
        ...state.startOrCloseData,
        signId: state.signId, ...payload
      })
      if (res?.code === 0) {
        yield put({ // 开启关闭都重载列表
          type: "loadManageList"
        })
        return res
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
