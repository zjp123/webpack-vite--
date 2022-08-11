import {
  treeSelectList,
  getFileDomainApi,
  getRouter,
  getExaminationSiteApi,
  menuList,
  getDictApi,
  optionSelectApi,
  getDrivingSchoolApi
} from "@/api/common"
import {message} from "antd"
import {replaceKey} from "@/utils"
import {DICT_TYPES, ELECTRONIC_ARCHIVE_MANAGE_STEPS} from "@/utils/constants"
import {getStageList} from "@/api/electronic";

export default {
  namespace: "global",
  state: {
    departmentList: [],
    fileDomainUrl: "",
    getRouterList: [],
    isCuresetPasswordlVisible: false,
    drivingSchoolSelect: [], // 驾校下拉选
    examinerSelect: [], // 考官下拉选
    examinationSiteSelect: [], // 考场下拉选
    hospitalSelect: [], // 医院下拉选
    menuList: [],
    perdritypeList: [], //可培训车型
    courseList: [],// 科目
    bizTypeList: [],// 业务类型
    jobGroupList: [], // 定时任务分组
    jobStatusList: [], // 定时任务状态
    hospitalList: [],//医院下拉
    optionSelectList: [],//角色下拉
    limitReasonList: [], //限制人员下拉
    nationList: [], //民族下拉
    deptList: [], // 所属部门下拉
    signUpReviewResultsList: [],//报名审核结果
    siteStatusList: [],//考场状态
    cityList: [],//城市下拉
    schList: [],//驾校下拉
    jobLogStatusList: [],//定时任务执行状态
    exsList: [],//人像对比
    businessStatusList: [],//业务类型下拉
    archivesStatusList: [],// 档案状态
    acceptStatusList: [],// 受理状态下拉

    isImmediatelyPhoto: false,
    stageList: [],
    currentStep: {},

    examSiteList:[],//考场
    carTypeList:[],//车辆类型
    carBrandList:[],//车辆品牌
    certifyingAuthorityList:[],//发证机关
    checkedList: [], // 批量下载已选中列表
    indeterminate: true,
    checkAll: false, // 是否全选
    plainOptions: [], // 批量下载可选项列表
    school_config_clean_typeList: [], // 驾校预录入计数清零规则
    sys_normal_disableList: [], // 系统正常禁用规则
    office_perdritypesList: [], // 部门管理车型
    archives_typeList: [], // 档案类型
    sys_yes_no_numList: [], // 是否是数字
    student_wayList: [], // 驾驶人报名方式
    gateControllerSchemeList: [], // 闸控方案
    databaseDriverList: [], // 驱动下拉
    databaseName: [], // 别名下拉
    safList: [], // 安全员下拉
    examSessionList: [], // 场次下拉
    examCarList: [], // 考车下拉
    eSginUserListList: [], // 签到用户下拉
    exsCodeList: [], // 考场模糊搜索
    safManualAssignmentExsList: [],// 考场模糊搜索
    schoolList: [], // 驾校模糊搜索
  },
  effects: {
    /* 获取部门下拉树列表 */
    * treeSelectList({payload}, {call, put}) {
      try {
        const res = yield call(treeSelectList, {status: "0"})
        if (res && res.code === 0) {
          yield put({
            type: "save",
            payload: {
              treeSelectList: res.data
            }
          })
        }
      } catch (err) {
      }
    },
    //图片域名
    * getFileDomain({payload}, {call, put}) {
      try {
        const res = yield call(getFileDomainApi)
        if (res && res.code === 0) {
          yield put({
            type: "save",
            payload: {
              fileDomainUrl: res.data.fileDomain
            }
          })
        }
      } catch (err) {
      }
    },
    //路由
    * getRouterFn({payload}, {call, put}) {
      try {
        const res = yield call(getRouter)
        if (res && res.code === 0) {
          yield put({
            type: "save",
            payload: {
              getRouterList: res.data
            }
          })
        }
      } catch (err) {
      }
    },

    //  考场字典
    * getExaminationSite({payload}, {call, put}) {
      try {
        const res = yield call(getExaminationSiteApi, payload)
        if (res?.code === 0) {
          const list = res?.data?.list?.map((item) => ({
            id: item.code,
            value: item.code,
            label: item.name,
            ...item
          }))
          yield put({
            type: "save",
            payload: {
              examinationSiteSelect: res.data?.list
            }
          })
          return list
        }
      } catch (err) {
      }
    },

    //获取菜单列表
    * menuList({payload}, {select, call, put}) {
      try {
        const res = yield call(menuList)
        if (res.code === 0) {
          const menuList = replaceKey(replaceKey(res.data, "id", "key"), "label", "title")
          yield put({
            type: "save", payload: {
              menuList
            }
          })
        } else {
          message.warn(res.msg)
        }
      } catch (err) {
      }
    },

    * getDict({payload}, {select, call, put}) {
      const resultPayload = {}
      const type = payload.type
      const typeList = DICT_TYPES.find((item) => item === type) && `${DICT_TYPES.find((item) => item === type)}List`

      try {
        const res = yield call(getDictApi, payload)
        if (res?.code === 0) {
          const list = res?.data?.list?.map((item) => ({
            id: item.code,
            label: item.name,
            value: item.code,
            // photoUrl 考官照片独有字段
            photoUrl: item?.customData?.photoUrl,
            ...item
          }))
          resultPayload[typeList] = list
          yield put({
            type: "save",
            payload: {
              ...resultPayload
            }
          })
          return list
        }
      } catch (err) {
      }
    },

    // 获取角色下拉
    * getOptionSelectList({payload}, {call, put}) {
      try {
        const res = yield call(optionSelectApi, {status: "0"})
        if (res && res.code === 0) {
          yield put({
            type: "save",
            payload: {
              optionSelectList: payload ? res.data.unPoliceRoleList : res.data.policeRoleList
            }
          })
        }
      } catch (err) {
      }
    },

    // 驾校下拉
    * getDrivingSchoolSelectList({payload}, {call, put}) {
      try {
        const res = yield call(getDrivingSchoolApi, {})
        if (res && res.code === 0) {
          yield put({
            type: "save",
            payload: {
              schList: res.data.list
            }
          })
        }
      } catch (err) {
      }
    },

    // 批量下载重置
    * resetBatchDownload({payload}, {call, put}) {
      try {
        yield put({
          type: "save",
          payload: {
            checkedList: [], // 批量下载已选择列表
            indeterminate: true,
            checkAll: false, // 是否全选
            plainOptions: [] // 批量下载可选项列表
          }
        })
      } catch (err) {
      }
    },

    // 考生流水业务阶段列表
    * loadStageList({payload}, {call, put}) {
      try {
        const res = yield call(getStageList, payload)
        if (res && res.code === 0) {
          let currentStepItem = res.data.findIndex((item) => {
            return item.code === payload.stage
          })
          yield put({
            type: "save",
            payload: {
              currentStep: currentStepItem,
              stageList: res.data
            }
          })
        }
      } catch (err) {
      }
    },
  },


  reducers: {
    save(state, {payload}) {
      return {...state, ...payload}
    }
  }
}
