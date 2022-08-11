/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-26 15:33:08
 * @description: 系统首页数据处理
 */
import Mock from 'mockjs'
import request from '@/utils/request'

// 首页统计数据
export function loadSysIndexDataApi(data = {}) {
  return import.meta.env.REACT_APP_TEST === 'test' || import.meta.env.VITE_NODE_ENV === 'development'
    ? Promise.resolve(dataResult)
    // ? request.postJson<any>(`/index/statistics`, data)
    : import.meta.env.REACT_APP_GZIP==="gzip"
      ? request.postJson<any>(`/index/statistics`, data)
      // : request.postJson<any>(`/index/statistics`, data)
      : Promise.resolve(dataResult)
}

// 首页登录日志信息
export function loadLoginLogDataApi(data = {}) {
  return request.postJson<any>(`/index/userLoginInformation`, data)
}

Mock.mock({
  msg: '操作成功',
  code: 0,
  data: {}
})

var dataResult = {
  msg: '操作成功',
  code: 0,
  data: {
    id: 1, //数据编号
    schAmount: 654, //驾校总数
    schoolStuNumberLeaderboard: [
      {
        //驾校学员数排行榜
        schName: '济源市通达驾校', //驾校名称
        schShortName: '济源市阳光驾校',
        schStuNumber: 332812 //驾校学员数
      },
      {
        schName: '济源市阳光驾校',
        schShortName: '济源市腾飞驾校',
        schStuNumber: 288921
      },
      {
        schName: '东方时尚驾校',
        schShortName: '济源市光大驾校',
        schStuNumber: 199789
      }
    ],
    examinationRoomAmount: 3394, //考场总数
    stuAmount: 560850, //考生总数
    testedTimes: 6982, //已考场次
    testedStuNumber: 7861, //已考人数
    stuPassRate: [
      {"course": "1", "passRate": "100%"},
      {"course": "2", "passRate": "71.66%"},
      {"course": "3", "passRate": "0%"},
      {"course": "4", "passRate": "50%"},
      {"course": "5", "passRate": "0%"},
    ], //考生通过率
    averageLicensingPeriod: 62, //平均领证周期
    monthlyStatistics: [
      {
        //月度统计数据（12个月）
        month: 1, //月份
        stuNumber: 6025, //每月考生数量
        signupNumber: 1000, //报名人数
        examStuNumber: 200, //考试人数
        issuanceNumber: 500, //发证数量
        licensePeriod: 61 //每月平均领证天数
      },
      {
        month: 2,
        stuNumber: 6025,
        signupNumber: 1000,
        examStuNumber: 200,
        issuanceNumber: 500,
        licensePeriod: 62
      },
      {
        month: 3,
        stuNumber: 5892,
        signupNumber: 876,
        examStuNumber: 178,
        issuanceNumber: 455,
        licensePeriod: 53
      },
      {
        month: 4,
        stuNumber: 6891,
        signupNumber: 985,
        examStuNumber: 278,
        issuanceNumber: 155,
        licensePeriod: 124
      },
      {
        month: 5,
        stuNumber: 7231,
        signupNumber: 1256,
        examStuNumber: 384,
        issuanceNumber: 97,
        licensePeriod: 154
      },
      {
        month: 6,
        stuNumber: 8569,
        signupNumber: 2256,
        examStuNumber: 584,
        issuanceNumber: 129,
        licensePeriod: 254
      },
      {
        month: 7,
        stuNumber: 9811,
        signupNumber: 3344,
        examStuNumber: 675,
        issuanceNumber: 129,
        licensePeriod: 354
      },
      {
        month: 8,
        stuNumber: 6811,
        signupNumber: 4344,
        examStuNumber: 475,
        issuanceNumber: 329,
        licensePeriod: 154
      },
      {
        month: 9,
        stuNumber: 5811,
        signupNumber: 6344,
        examStuNumber: 275,
        issuanceNumber: 129,
        licensePeriod: 354
      },
      {
        month: 10,
        stuNumber: 7811,
        signupNumber: 4344,
        examStuNumber: 775,
        issuanceNumber: 329,
        licensePeriod: 154
      },
      {
        month: 11,
        stuNumber: 9811,
        signupNumber: 7344,
        examStuNumber: 575,
        issuanceNumber: 229,
        licensePeriod: 154
      },
      {
        month: 12,
        stuNumber: 6811,
        signupNumber: 3344,
        examStuNumber: 275,
        issuanceNumber: 729,
        licensePeriod: 354
      }
    ],
    ageStatistics: [
      {
        //考生年龄分布(5个区间)
        ageRange: '18-25', //年龄区间
        ageStudentNumber: 8638 //该区间考生数量
      },
      {
        ageRange: '25-35',
        ageStudentNumber: 6638
      },
      {
        ageRange: '35-60',
        ageStudentNumber: 8138
      },
      {
        ageRange: '60以上',
        ageStudentNumber: 338
      }
    ],
    sexStatistics: [
      {
        //考生性别分布（0—男，1—女）
        sex: 0, //考生性别
        sexStudentNumber: 8638, //该性别考生数量
        sexRatio: '45' //该性别占比
      },
      {
        sex: 1,
        sexStudentNumber: 6638,
        sexRatio: '55'
      },
      {
        sexStudentNumber: 7000,
        sexRatio: '50'
      }
    ],
    perdritypeStatistics: [
      {
        //报考车型统计
        perdritype: 'C1', //报考车型
        perdritypeStudentNumber: 71036 //该车型报考人数
      },
      {
        perdritype: 'C2',
        perdritypeStudentNumber: 51036
      },
      {
        perdritype: 'C3',
        perdritypeStudentNumber: 11036
      },
      {
        perdritype: 'A1',
        perdritypeStudentNumber: 12036
      },
      {
        perdritype: 'A2',
        perdritypeStudentNumber: 2836
      },
      {
        perdritype: 'B1',
        perdritypeStudentNumber: 1636
      },
      {
        perdritype: 'B2',
        perdritypeStudentNumber: 1736
      },
      {
        perdritype: 'D',
        perdritypeStudentNumber: 65467
      }
    ],
    businessTypeStatistics: [
      {
        //业务类型统计
        businessType: '初次申领', //业务类型
        businessTypeStudentNumber: 9638 //该业务类型人数
      },
      {
        //业务类型统计
        businessType: '增驾申请', //业务类型
        businessTypeStudentNumber: 9638 //该业务类型人数
      },
      {
        businessType: '增驾1',
        businessTypeStudentNumber: 1111
      },
      {
        businessType: '增驾2',
        businessTypeStudentNumber: 9638
      },
      {
        businessType: '增驾3',
        businessTypeStudentNumber: 8638
      },
      {
        businessType: '增驾4',
        businessTypeStudentNumber: 7638
      },
      {
        businessType: '增驾5',
        businessTypeStudentNumber: 6638
      },
      {
        businessType: '增驾6',
        businessTypeStudentNumber: 5638
      },
      {
        businessType: '增驾7',
        businessTypeStudentNumber: 4638
      },
      {
        businessType: '增驾8',
        businessTypeStudentNumber: 3638
      },
      {
        businessType: '增驾9',
        businessTypeStudentNumber: 2638
      },
      // {
      //   businessType: '增驾10',
      //   businessTypeStudentNumber: 1638
      // },
      // {
      //   businessType: '增驾11',
      //   businessTypeStudentNumber: 386
      // },
      // {
      //   businessType: '增驾12',
      //   businessTypeStudentNumber: 1963
      // },
      // {
      //   businessType: '增驾13',
      //   businessTypeStudentNumber: 938
      // },
      // {
      //   businessType: '增驾14',
      //   businessTypeStudentNumber: 968
      // },
      // {
      //   businessType: '增驾15',
      //   businessTypeStudentNumber: 638
      // }
    ],
    monthlyExamStudentNumber: [
      {
        //月度考试人数对比
        date: '2021-9-1', //日期
        thatDayStudentNumber: 43, //当日人数
        samePeriodStudentNumber: 65 //同期人数
      },
      {
        date: '2021-9-2',
        thatDayStudentNumber: 29,
        samePeriodStudentNumber: 67
      },
      {
        date: '2021-9-3',
        thatDayStudentNumber: 99,
        samePeriodStudentNumber: 123
      },
      {
        date: '2021-9-4',
        thatDayStudentNumber: 129,
        samePeriodStudentNumber: 254
      },
      {
        date: '2021-9-5',
        thatDayStudentNumber: 543,
        samePeriodStudentNumber: 354
      }
    ],
    examSubjectStudentNumber: [
      {
        //各科目考试人数统计
        examSubject: '科一', //考试科目
        subjectStuNumber: 3256 //该科目考生人数
      },
      {
        examSubject: '科二',
        subjectStuNumber: 3256
      },
      {
        examSubject: '科三',
        subjectStuNumber: 3256
      },
      {
        examSubject: '科四',
        subjectStuNumber: 3256
      },
      {
        examSubject: '科五',
        subjectStuNumber: 3256
      }
    ],
    schoolPassRateLeaderboard: [
      {
        //驾校通过率排行榜(前10名)
        schName: '济源市阳光驾校', //驾校名
        schShortName: '济源市阳光驾校',
        passRate: '2398' //通过率
      },
      {
        schName: '济源市腾达驾校',
        schShortName: '济源市腾飞驾校',
        passRate: '3218'
      },
      {
        schName: '济源通顺驾校',
        schShortName: '济源市光大驾校',
        passRate: '2218'
      }
    ],
    archivesStatistics: {
      //档案统计数据
      archivesAmount: 7348, //电子档案数
      thisYearArchivesAmount: 4348, //当年电子档案总数
      lastYearArchivesAmount: 5348, //去年电子档案总数
      yearBeforeLastArchivesAmount: 8348, //前年电子档案总数
      abnormalArchivesAmount: 4348, //异常档案数
      thisYearAbnormalArchivesAmount: 4348, //当年异常档案数
      lastYearAbnormalArchivesAmount: 6348, //去年异常档案数
      yearBeforeLastAbnormalArchivesAmount: 5348, //前年异常档案数
      makeupArchivesAmount: 4348, //档案补录数
      thisYearMakeupArchivesAmount: 8348, //当年档案补录数
      lastYearMakeupArchivesAmount: 7348, //去年档案补录数
      yearBeforeLastMakeupArchivesAmount: 6398, //前年档案补录数
      historicalAnomalyCertificatesNumber: 6343, //历史异常档案制证数
      existingAbnormalCertificatesNumber: 6349 //现存异常档案制证数
    },
    arrearsStatistics: {
      //欠费信息数据统计
      arrearsAmount: 1832.0, //当年本地区欠费总金额
      arrearsSchoolNumber: 282, //当年本地区存在学员欠费的驾校数量
      arrearsStudentNumber: 4416 //当年本地区欠费学员的数量
    }
  }
}
