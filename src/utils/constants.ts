/**
 * 日期格式化
 */
export const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * 日期时分秒格式化
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

/**
 * 时分秒格式化
 */
export const TIME_FORMAT = 'HH:mm:ss'

/**
 * 搜索表单布局
 * @type {Object}
 */
export const FORM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
}

export const WRAPPER_COl = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 3 }
}

export const FORMITEM_LAYOUT = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}
export const FORMITEM_LAYOUTr = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 16
  }
}
export const FORMITEM_LAYOUT_NOWRAP = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
}

/**
 * 状态值枚举值
 * @type {{UNABLE: number, ENABLE: number}}
 */
export const STATUS = {
  unable: 0,
  enable: 1
}

/**
 * 常用颜色
 */
export const [ENABLED_COLOR, DISABLED_COLOR, BLUE_COLOR, WARING_COLOR, PURPLE_COLOR, CYAN_COLOR, MAGENTA_COLOR] = ['#87d068', '#f50', '#2db7f5', 'orange', 'purple', 'cyan', 'magenta']

/**
 * 状态
 * @type {*[]}
 */
// 任务状态
export const Taskstatus = [
  {
    value: '0',
    label: '成功', //1
    color: ENABLED_COLOR
  },
  {
    value: '1',
    label: '失败', //0
    color: DISABLED_COLOR
  }
]
//操作日志业务类型
export const Signuptreviewvt = [
  {
    value: '0',
    label: '其它', //0
    color: ENABLED_COLOR
  },
  {
    value: '1',
    label: '新增', //1
    color: ENABLED_COLOR
  },
  {
    value: '2',
    label: '修改', //2
    color: ENABLED_COLOR
  },
  {
    value: '3',
    label: '删除', //2
    color: ENABLED_COLOR
  },
  {
    value: '4',
    label: '授权', //2
    color: ENABLED_COLOR
  },
  {
    value: '5',
    label: '导出', //2
    color: ENABLED_COLOR
  },
  {
    value: '6',
    label: '导入', //2
    color: ENABLED_COLOR
  },
  {
    value: '7',
    label: '强退', //2
    color: ENABLED_COLOR
  },
  {
    value: '8',
    label: '生成代码', //2
    color: ENABLED_COLOR
  },
  {
    value: '9',
    label: '清空数据', //2
    color: ENABLED_COLOR
  }
]
//
export const Signuptreviewv = [
  {
    value: '0',
    label: '策略', //0
    color: ENABLED_COLOR
  },
  {
    value: '1',
    label: '限制', //1
    color: ENABLED_COLOR
  },
  {
    value: '2',
    label: '业务', //2
    color: ENABLED_COLOR
  }
]
//报名审核
export const Signuptreview = [
  {
    value: '0',
    label: '未完成', //1
    color: ENABLED_COLOR
  },
  {
    value: '1',
    label: '完成', //1
    color: ENABLED_COLOR
  },
  {
    value: '2',
    label: '失败', //1
    color: ENABLED_COLOR
  }
]

//受理状态
export const AcceptStatus = [
  {
    value: '0',
    label: '未受理'
  },
  {
    value: '1',
    label: '已受理'
  }
]

export const STATUS_TYPE = [
  {
    value: STATUS.enable,
    color: ENABLED_COLOR,
    yes_no_label: '是',
    useds_label: '启动',
    have_no: '有',
    compareResult: '通过'
  },
  {
    value: STATUS.unable,
    color: DISABLED_COLOR,
    yes_no_label: '否',
    useds_label: '关闭',
    have_no: '无',
    compareResult: '未通过'
  }
]

export const COMPARISON_RESULTS = [
  {
    value: STATUS.unable,
    color: 'black',
    yes_no_label: '是',
    useds_label: '启动',
    have_no: '有',
    compareResult: '通过'
  },
  {
    value: STATUS.enable,
    color: 'red',
    yes_no_label: '否',
    useds_label: '关闭',
    have_no: '无',
    compareResult: '未通过'
  }
]

//状态
export const STATUS_STRING = [
  {
    value: '0',
    used_label: '启用',
    color: ENABLED_COLOR
  },
  {
    value: '1',
    used_label: '禁用',
    color: DISABLED_COLOR
  }
]
// 体检结果
export const AMEDICAL = [
  {
    value: '0',
    used_label: '不合格',
    color: DISABLED_COLOR
  },
  {
    value: '1',
    used_label: '合格',
    color: DISABLED_COLOR
  }
]

// 性别枚举 类型
export const SEX_NUMBER_ENUM = [
  {
    id: 1,
    value: 1,
    label: '女',
    sex: '女',
    color: ENABLED_COLOR
  },
  {
    id: 0,
    value: 0,
    label: '男',
    sex: '男',
    color: DISABLED_COLOR
  }
]

// 听力
export const HEARING = [
  {
    id: 0,
    value: '0',
    label: '不合格'
  },
  {
    id: 1,
    value: '1',
    label: '合格'
  },
  {
    id: 2,
    value: '2',
    label: '需戴助听器'
  }
]
// 左下肢
export const LEFT_LOWERLIMB = [
  {
    id: 0,
    value: '0',
    label: '不合格'
  },
  {
    id: 1,
    value: '1',
    label: '合格'
  }
]
// 右下肢
export const RIGHT_LOWERLIMB = [
  {
    id: 0,
    value: '0',
    label: '不合格'
  },
  {
    id: 1,
    value: '1',
    label: '合格'
  },
  {
    id: 2,
    value: '2',
    label: '不合格 但可自主坐立'
  }
]
// 上肢
export const UPPER_LIMB = [
  {
    id: 0,
    value: '0',
    label: '不合格'
  },
  {
    id: 1,
    value: '1',
    label: '合格'
  },
  {
    id: 2,
    value: '2',
    label: '手指末残缺'
  },
  {
    id: 2,
    value: '4',
    label: '左手三指健全，双手手掌完整'
  },
  {
    id: 2,
    value: '5',
    label: '合格申请C5条件'
  }
]

export const COLOR_VISION = [
  {
    id: 0,
    value: '0',
    label: '不合格'
  },
  {
    id: 1,
    value: '1',
    label: '合格'
  }
]
// 单眼视力障碍
export const VISUAL_DISTURBANCE = [
  {
    id: 0,
    value: '1',
    label: '是'
  },
  {
    id: 1,
    value: '2',
    label: '否'
  }
]
//申请方式
export const Application = [
  {
    id: 0,
    value: 0,
    label: '本人申请'
  },
  {
    id: 1,
    value: 1,
    label: '监护人申请'
  },
  {
    id: 2,
    value: 2,
    label: '委托代理申请'
  }
]

//是否本地
export const whether = [
  {
    value: 'A',
    label: '本地'
  },
  {
    value: 'B',
    label: '外地'
  }
]
// 电话号码验证 / 修改包括座机 座机格式 010-8801627    三位或四位-7或者8位
// /^(\d{3,4}-)?(\d{7,8}$)/  固定电话正则   (^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$)  手机号正则
export const TEL_REGEXP = /(?=(^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$))|(?=^(\d{3,4}-)?(\d{7,8}$))/

// 身份证验证
export const ID_REGEXP = /^(\d{6})(\d{4})(\d{2})(\d{2})\d{2}(\d)(\d|X)$/
// 验证真实姓名
export const NAME_REGEXP = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/
// 验证邮箱
export const EMAIL_REGEXP = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
// 密码验证规则 //密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
export const PASSWORD_REGEXP = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
// 账号创建规则正则  5-30位字符，以字母开头，只能包含 英文字母、数字、下划线,中划线
export const ACCOUNT_REGEXP = /^[a-zA-Z][a-zA-Z\d-_]{4,29}$/
// 匹配汉子和文字
export const CHINESE_NUM = /^[0-9\u4E00-\u9FA5]+$/
//身高正则
export const heightReg = /^([1,2][0-9]{2})$/
//视力
export const visionReg = /^([1-9]\d*|0)(\.\d*[1-9])?$/
/**
 * 抽查审查状态
 */
export const SPOTCHECK_STATUS = {
  0: { label: '待审查', color: '#6b798e' },
  1: { label: '已审查', color: '#87d068' },
  2: { label: '异常', color: '#f50' }
}

// 考场状态
export const ROMM_STATUS = [{ value: 'A', label: '正常' }, { value: 'B', label: '暂停业务' }, { value: 'C', label: '注销' }]

// 是否签字 状态
export const IS_SIG_STATUS = [{value:"0",label:"未签名"},{value:"1",label:"已签名"}]
// 人脸base64
export const FACE_BASE64_URL = 'data:image/jpgpng;base64,'

export const archivesTypeObj = {
  1: '身份证',
  2: '证件',
  3: '体检证明表',
  4: '预录入报名表',
  5: '学习证明',
  6: '科目一成绩单',
  7: '科目二成绩单',
  8: '科目三道路驾驶技能考试成绩单',
  9: '科目三安全文明驾驶常识考试成绩单'
}

// Antd CHART 通用 config
export const ANTD_CHART_BASE_CONFIG = {
  smooth: true,
  autoFit: true,
  height: 75,
  areaStyle: { fill: '#1890FF', opacity: 20 },
  line: {
    stroke: '#1890FF'
  },
  xAxis: {
    // y轴配置
    line: null,
    grid: {
      line: null // 去掉横向刻度线
    }
    // label: null // 去掉 x轴label
  },
  yAxis: {
    // y轴配置
    grid: {
      line: null // 去掉横向刻度线
    },
    label: null // 去掉 y轴label
  }
}

// 不同用户登录时所要 指定 跳转的首页
export const USER_TYPE_ARR = [
  { userType: 0, path: '/', name: '系统用户' }, //车管所
  { userType: 1, path: '/', name: '考官' }, //车管所
  // {userType: 2, path: "", name: "安全员"},
  // {userType: 3, path: "", name: "考生"},
  { userType: 4, path: '/', name: '医院管理' }, //医院
  { userType: 5, path: '/', name: '驾校管理' }, //车管所
  { userType: 6, path: '/student/physical', name: '医生', isNeedComplete: true } //医生
]

// 字典接口常量
export const DICT_TYPES = [
  'course', // 考试科目
  'bizType', // 业务类型
  'perdritype', // 培训车型 考试车型
  'jobGroup', // 定时任务分组
  'jobStatus', // 定时任务状态
  'jobLogStatus', // 定时任务执行状态
  'sch', // 驾校下拉
  'inv', // 考官下拉
  'exs', // 考场下拉
  'hospital', // 医院下拉
  'timedTask', // 定时任务下拉
  'limitReason', //限制原因下拉
  'nation', //民族下拉
  'dept', // 部门下拉
  'dept', //部门下拉
  'examSession', // 考试场次
  'signUpReviewResults', //报名审核结果
  'siteStatus', //考场状态"
  'city', //城市
  'sch', //考场下拉
  'businessStatus', //业务状态
  'archivesStatus', //档案状态
  'acceptStatus', // 受理状态
  'examSite', //考场
  'carType', //车辆类型
  'carBrand', //车辆品牌
  'certifyingAuthority', //发证机关
  'school_config_clean_type', //	驾校预录入计数清零规则
  'sys_normal_disable', // 预录入管理状态
  'office_perdritypes', // 部门管理车型
  'archives_type', // 档案类型
  'sys_yes_no_num', // 是否是数字
  'student_way', // 驾驶人报名方式
  'gateControllerScheme', // 闸机控制方案
  'databaseDriver', // 驱动下拉
  'databaseName', // 别名下拉
  'examSession', // 场次下拉
  'saf', // 安全员下拉
  'examCar', // 考车下拉
  'eSginUserList', // 签到用户下拉
  'safManualAssignmentExs', // 考场模糊搜索
  'exsCode', // 考场模糊搜索
  'school', //驾校模糊搜索
]

/**
 * 前端文件下载不同后缀文件对应的 mime 类型
 */
export const EXTENSION_2_MIME = [
  { extension: 'doc', mime: 'application/msword' },
  { extension: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { extension: 'xls', mime: 'application/vnd.ms-excel application/x-excel' },
  { extension: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { extension: 'ppt', mime: 'application/vnd.ms-powerpoint' },
  { extension: 'pdf', mime: 'application/pdf' }
]

// 电子档案管理 进度条常量
export const ELECTRONIC_ARCHIVE_MANAGE_STEPS = [
  { title: '报名', steps: [1, 2], currentStep: 0 },
  { title: '科目一考试', steps: [3, 4], currentStep: 1 },
  { title: '科目二考试', steps: [5, 6], currentStep: 2 },
  { title: '科目三道路考试', steps: [7, 8], currentStep: 3 },
  { title: '科目三理论考试', steps: [9, 10], currentStep: 4 },
  { title: '已领证', steps: [11], currentStep: 5 }
]

// echarts common config
export const ECHARTS_COMMON_CONFIG = {
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  // 鼠标悬浮提示
  TOOL_TIP: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  X_AXIS: {
    // X 轴同用配置
    axisLabel: {
      textStyle: {
        color: '#ffffff'
      }
    }
  },
  Y_AXIS: {
    // y 轴同用配置
    splitLine: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#ffffff'
      }
    }
  }
}

// 考试日程管理/ 考试状态 颜色数组
export const COLORFUL_EXAMINATION_STATUS_ARR = [
  { examStatus: '0', label: '待考', color: '#FF8D49' }, // 未开考 #FF8D49
  { examStatus: '1', label: '考试中', color: '#00A70D' }, // 考试中 #00A70D
  { examStatus: '2', label: '考试结束', color: '#666666' } // 已结束 #666666
]

/**
 * 考试状态
 */
// export const EXAMINER_STATUS = [{ text: 0, rText: '待考', color: '#FF8D49' }, { text: 1, rText: '考试中', color: '#00A70D' }, { text: 2, rText: '考试结束', color: '#666666' }]
