export const getModels = menu => {
  switch (menu) {
    case '/index':
      return {
        component: () => import('@/pages/index'),
        models: () => [import('@/pages/IndexPage/model')],
        type: ''
      }
    case '/drivingTest/drivingSchool':
      return {
        component: () => import('@/pages/DrivingTest/drivingSchool'),
        models: () => [import('@/pages/DrivingTest/drivingSchool/model')]
      }
    case '/drivingTest/drivingSchool/coachCarinformation/:id':
      return {
        component: () => import('@/pages/DrivingTest/drivingSchool/coachCarinformation'),
        models: () => [import('@/pages/DrivingTest/drivingSchool/coachCarinformation/model')]
      }
    case '/drivingTest/examinationRoom':
      return {
        component: () => import('@/pages/DrivingTest/examinationRoom'),
        models: () => [import('@/pages/DrivingTest/examinationRoom/model')]
      }
    case '/drivingTest/examinationRoom/examinationPage/:id':
      return {
        component: () => import('@/pages/DrivingTest/examinationRoom/examinationPage'),
        models: () => [import('@/pages/DrivingTest/examinationRoom/model')]
      }
    case '/drivingTest/examinerInformation':
      return {
        component: () => import('@/pages/DrivingTest/examinerInformation'),
        models: () => [import('@/pages/DrivingTest/examinerInformation/model')]
      }
    case '/drivingTest/examinerInformation/examinerDetail/:id':
      return {
        component: () => import('@/pages/DrivingTest/examinerInformation/examinerDetail'),
        models: () => [import('@/pages/DrivingTest/examinerInformation/model')]
      }
    case '/drivingTest/safetyoFficerin':
      return {
        component: () => import('@/pages/DrivingTest/safetyoFficerin'),
        models: () => [import('@/pages/DrivingTest/safetyoFficerin/model')]
      }
    case '/drivingTest/safetyoFficerin/checkSafetyoPage/:safetyOfficerId':
      return {
        component: () => import('@/pages/DrivingTest/safetyoFficerin/checkSafetyoPage'),
        models: () => [import('@/pages/DrivingTest/safetyoFficerin/model')]
      }
    case '/drivingTest/vehicleInformation':
      return {
        component: () => import('@/pages/DrivingTest/vehicleInformation'),
        models: () => [import('@/pages/DrivingTest/vehicleInformation/model')]
      }
    case '/drivingTest/electronicSignature':
      return {
        component: () => import('@/pages/DrivingTest/electronicSignature'),
        models: () => [import('@/pages/DrivingTest/electronicSignature/model')]
      }
    case '/management/checkthe':
      return {
        component: () => import('@/pages/ManaGement/cheCkthe'),
        models: () => [import('@/pages/ManaGement/cheCkthe/model')]
      }
    case '/management/lackofinfor':
      return {
        component: () => import('@/pages/ManaGement/lackoFinfor'),
        models: () => [import('@/pages/ManaGement/lackoFinfor/model')]
      }
    case '/automatically/sheet':
      return {
        component: () => import('@/pages/Automatically/sheet'),
        models: () => [import('@/pages/Automatically/sheet/model')]
      }
    case '/automatically/examineeVerify':
      return {
        component: () => import('@/pages/Automatically/examineeVerify'),
        models: () => [import('@/pages/Automatically/examineeVerify/model')]
      }
    case '/automatically/verification':
      return {
        component: () => import('@/pages/Automatically/verification'),
        models: () => [import('@/pages/Automatically/verification/model')]
      }
    case '/automatically/assignTestCar':
      return {
        component: () => import('@/pages/Automatically/assignTestCar'),
        models: () => [import('@/pages/Automatically/assignTestCar/model')]
      }
    case '/automatically/safetyofficer':
      return {
        component: () => import('@/pages/Automatically/safetyofficer'),
        models: () => [import('@/pages/Automatically/safetyofficer/model')]
      }
    case '/faceRecognition/collection':
      return {
        component: () => import('@/pages/FaceRecognition/collection'),
        models: () => [import('@/pages/FaceRecognition/collection/model')]
      }
    case '/faceRecognition/comparison':
      return {
        component: () => import('@/pages/FaceRecognition/comparison'),
        models: () => [import('@/pages/FaceRecognition/comparison/model')]
      }
    case '/faceRecognition/comparison/checkComparisonPage/:id':
      return {
        component: () => import('@/pages/FaceRecognition/comparison/checkComparisonPage'),
        models: () => [import('@/pages/FaceRecognition/comparison/model')]
      }
    case '/faceRecognition/limitRecord':
      return {
        component: () => import('@/pages/FaceRecognition/limitRecord'),
        models: () => [import('@/pages/FaceRecognition/limitRecord/model')]
      }
    case '/electronic/information':
      return {
        component: () => import('@/pages/Electronic/information'),
        models: () => [import('@/pages/Electronic/information/model')]
      }
    case '/electronic/information/informationPage/:personId/:fileNum':
      return {
        component: () => import('@/pages/Electronic/information/InformationPage'),
        models: () => [import('@/pages/Electronic/information/model')]
      }
    case '/electronic/information/checkInforMationPage/:id/:stage/:studentId/:fileNum/:personId':
      return {
        component: () => import('@/pages/Electronic/information/checkInforMationPage'),
        models: () => [import('@/pages/Electronic/information/model')]
      }
    case '/electronic/recording':
      return {
        component: () => import('@/pages/Electronic/recording'),
        models: () => [import('@/pages/Electronic/recording/model')]
      }
    case '/electronic/recording/checkInRecordingPage/:id/:stage/:studentId/:fileNum/:personId':
      return {
        component: () => import('@/pages/Electronic/recording/checkInRecordingPage'),
        models: () => [import('@/pages/Electronic/recording/model')]
      }
    case '/electronic/recording/checkToviewPage/:id/:archivesType/:studentId/:personId':
      return {
        component: () => import('@/pages/Electronic/recording/checkToviewPage'),
        models: () => [import('@/pages/Electronic/recording/model')]
      }
    case '/electronic/information/checkToviewPage/:id/:archivesType/:studentId/:personId':
      return {
        component: () => import('@/pages/Electronic/recording/checkToviewPage'),
        models: () => [import('@/pages/Electronic/recording/model')]
      }
    case '/electronic/spotCheck':
      return {
        component: () => import('@/pages/Electronic/spotCheck'),
        models: () => [import('@/pages/Electronic/spotCheck/model')]
      }
    case '/electronic/spotCheck/checkspotCheckPage/:id':
      return {
        component: () => import('@/pages/Electronic/spotCheck/checkspotCheckPage'),
        models: () => [import('@/pages/Electronic/spotCheck/model')]
      }
    case '/electronic/autoAccept':
      return {
        component: () => import('@/pages/Electronic/autoAccept'),
        models: () => [import('@/pages/Electronic/autoAccept/model')]
      }
    case '/student/medical':
      return {
        component: () => import('@/pages/Student/medical'),
        models: () => [import('@/pages/Student/medical/model')]
      }
    case '/student/preliminary':
      return {
        component: () => import('@/pages/Student/preliminary'),
        models: () => [import('@/pages/Student/preliminary/model')]
      }
    case '/student/registration':
      return {
        component: () => import('@/pages/Student/registration'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/info':
      return {
        component: () => import('@/pages/Student/registration/Step1'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/info':
      return {
        component: () => import('@/pages/Student/registration/Step1'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/photo-input/:id':
      return {
        component: () => import('@/pages/Student/registration/Step2'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/health-input/:id':
      return {
        component: () => import('@/pages/Student/registration/Step3'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/vehicle/:id':
      return {
        component: () => import('@/pages/Student/registration/Step4'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/result/:resultId':
      return {
        component: () => import('@/pages/Student/registration/Step5Result'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/system/user':
      return {
        component: () => import('@/pages/System/user'),
        models: () => [import('@/pages/System/user/model')]
      }
    case '/system/archiveConfig':
      return {
        component: () => import('@/pages/System/archiveConfig'),
        models: () => [import('@/pages/System/archiveConfig/model')]
      }
    case '/system/notification':
      return {
        component: () => import('@/pages/System/notification'),
        models: () => [import('@/pages/System/notification/model')]
      }
    // case '/student/physical/checkSafetyoPage':
    //   return {
    //     component: () => import('@/pages/Student/physical/checkSafetyoPage'),
    //     models: () => [import('@/pages/Student/physical/model')]
    //   }
    case '/student/medical/checkmedicalPage':
      return {
        component: () => import('@/pages/Student/medical/checkmedicalPage'),
        models: () => [import('@/pages/Student/medical/model')]
      }
    case '/system/role':
      return {
        component: () => import('@/pages/System/role'),
        models: () => [import('@/pages/System/role/model')]
      }
    case '/system/resource':
      return {
        component: () => import('@/pages/System/resource'),
        models: () => [import('@/pages/System/resource/model')]
      }
    case '/system/department':
      return {
        component: () => import('@/pages/System/department'),
        models: () => [import('@/pages/System/department/model')]
      }
    case '/system/management':
      return {
        component: () => import('@/pages/System/management'),
        models: () => [import('@/pages/System/management/model')]
      }
    case '/system/management/managementPage/:id/:name':
      return {
        component: () => import('@/pages/System/management/managementPage'),
        models: () => [import('@/pages/System/management/model')]
      }
    case '/system/gement':
      return {
        component: () => import('@/pages/System/gement'),
        models: () => [import('@/pages/System/gement/model')]
      }
    case '/system/investigate':
      return {
        component: () => import('@/pages/System/Investigate'),
        models: () => [import('@/pages/System/Investigate/model')]
      }
    case '/system/databaseConfig':
      return {
        component: () => import('@/pages/System/databaseConfig'),
        models: () => [import('@/pages/System/databaseConfig/model')]
      }
    case '/examiner/schedule':
      return {
        component: () => import('@/pages/Examiner/schedule'),
        models: () => [import('@/pages/Examiner/schedule/model')]
      }
    case '/examiner/schedule/checkSchedule/:id':
      return {
        component: () => import('@/pages/Examiner/schedule/checkScheduleModal'),
        models: () => [import('@/pages/Examiner/schedule/model')]
      }
    case '/examiner/schedule/checkSchedule/checkDetail/:id':
      return {
        component: () => import('@/pages/Examiner/schedule/checkDetailModal'),
        models: () => [import('@/pages/Examiner/schedule/model')]
      }
    case '/examiner/order':
      return {
        component: () => import('@/pages/Examiner/order'),
        models: () => [import('@/pages/Examiner/order/model')]
      }
    case '/examiner/order/manage/:id':
      return {
        component: () => import('@/pages/Examiner/order/manege'),
        models: () => [import('@/pages/Examiner/order/manege/model')]
      }
    case '/examiner/autograph':
      return {
        component: () => import('@/pages/Examiner/autograph'),
        models: () => [import('@/pages/Examiner/autograph/model')]
      }
    case '/examiner/manage':
      return {
        component: () => import('@/pages/Examiner/manage'),
        models: () => [import('@/pages/Examiner/manage/model')]
      }
    case '/examiner/sign':
      return {
        component: () => import('@/pages/Examiner/manage/cuSignModal'),
        models: () => [import('@/pages/Examiner/manage/model')]
      }
    case '/examinee/sign':
      return {
        component: () => import('@/pages/Examinee/sign'),
        models: () => [import('@/pages/Examinee/sign/model')]
      }
    case '/examinee/resign':
      return {
        component: () => import('@/pages/Examinee/resign'),
        models: () => [import('@/pages/Examinee/resign/model')]
      }

    case '/student/registration':
      return {
        component: () => import('@/pages/Student/registration'),
        models: () => [import('@/pages/Student/registration/model')]
      }
    case '/student/physical':
      return {
        component: () => import('@/pages/Student/physical'),
        models: () => [import('@/pages/Student/physical/model')]
      }
    case '/student/preliminary/checkPreliminaryPage/:id/:acceptStatus/:serialNum':
      return {
        component: () => import('@/pages/Student/preliminary/checkPreliminaryPage'),
        models: () => [import('@/pages/Student/preliminary/model')]
      }
    // case '/student/physical/checkSafetyoPage':
    //   return {
    //     component: () => import('@/pages/Student/physical/checkSafetyoPage'),
    //     models: () => [import('@/pages/Student/physical/model')]
    //   }
    case '/student/doctormanagement' /** 医生管理 */
    :
      return {
        component: () => import('@/pages/Student/doctormanagement'),
        models: () => [import('@/pages/Student/doctormanagement/model')]
      }
    /** 医院管理  */
    case '/student/hospitalManagement':
      return {
        component: () => import('@/pages/Student/hospitalManagement'),
        models: () => [import('@/pages/Student/hospitalManagement/model')]
      }
    /** 医院管理  查看详情 */
    case '/student/hospitalManagement/hospitalDetail/:id':
      return {
        component: () => import('@/pages/Student/hospitalManagement/hospitalDetail'),
        models: () => [import('@/pages/Student/hospitalManagement/model')]
      }

    case '/student/physical/medicalPage/:userId':
      return {
        component: () => import('@/pages/Student/physical/medicalPage'),
        models: () => [import('@/pages/Student/physical/model')]
      }
    case '/student/physical/medicalExaminationReport/:id':
      return {
        component: () => import('@/pages/Student/physical/medicalExaminationReport'),
        models: () => [import('@/pages/Student/physical/model')]
      }
    case '/student/physical/successfulPage':
      return {
        component: () => import('@/pages/Student/physical/successfulPage'),
        models: () => [import('@/pages/Student/physical/model')]
      }

    case '/system/initConfig':
      return {
        component: () => import('@/pages/System/initConfig'),
        models: () => [import('@/pages/System/initConfig/model')]
      }

    case '/system/security':
      return {
        component: () => import('@/pages/System/security'),
        models: () => [import('@/pages/System/security/model')]
      }

    case '/system/timingtask':
      return {
        component: () => import('@/pages/System/timingtask'),
        models: () => [import('@/pages/System/timingtask/model')]
      }

    case '/system/timingtask/timingtaskPage/:jobId':
      return {
        component: () => import('@/pages/System/timingtask/timingtaskPage'),
        models: () => [import('@/pages/System/timingtask/model')]
      }
    case '/system/account/:userid':
      return {
        component: () => import('@/pages/System/account'),
        models: () => [import('@/pages/System/account/model')]
      }
    case '/system/test':
      return {
        component: () => import('@/pages/System/test'),
        models: () => [import('@/pages/System/account/model')]
      }
    case '/system/interface':
      return {
        component: () => import('@/pages/System/interface'),
        models: () => [import('@/pages/System/interface/model')]
      }

    case '/system/interface/interfacePage/:id':
      return {
        component: () => import('@/pages/System/interface/checkInterfacePage'),
        models: () => [import('@/pages/System/interface/model')]
      }

    case '/system/barrier':
      return {
        component: () => import('@/pages/System/barrier'),
        models: () => [import('@/pages/System/barrier/model')]
      }

    case '/system/signMachine':
      return {
        component: () => import('@/pages/System/signMachine'),
        models: () => [import('@/pages/System/signMachine/model')]
      }

    //领导人驾驶仓---考生数据分析
    case '/leaderscock/dataanalysis':
      return {
        component: () => import('@/pages/LeaderScock/DataAnalysis'),
        models: () => [import('@/pages/LeaderScock/DataAnalysis/model')]
      }
    case '/leaderscock/informationanalysis':
      return {
        component: () => import('@/pages/LeaderScock/InformationAnalysis'),
        models: () => [import('@/pages/LeaderScock/InformationAnalysis/model')]
      }
    case '/leaderscock/examinationroominformationanalysis':
      return {
        component: () => import('@/pages/LeaderScock/ExaminationRoomInformationAnalysis'),
        models: () => [import('@/pages/LeaderScock/ExaminationRoomInformationAnalysis/model')]
      }
    case '/leaderscock/drivingdetails/:id/:schoolName':
      return {
        component: () => import('@/pages/LeaderScock/DrivingDetails'),
        models: () => [import('@/pages/LeaderScock/DrivingDetails/model')]
      }
    case '/leaderscock/ExaminationAnalysis':
      return {
        component: () => import('@/pages/LeaderScock/ExaminationAnalysis'),
        models: () => [import('@/pages/LeaderScock/ExaminationAnalysis/model')]
      }
    case '/electronic/iframe':
      return {
        component: () => import('@/pages/Electronic/iframe'),
        models: () => []
      }
    case '/leaderscock/echart':
      return {
        component: () => import('@/pages/LeaderScock/echart'),
        models: () => []
      }
  }
}

/**
 * 把带有children、path的属性树形结构数组重新整理path路径。
 * @param {array} array // 待整理的树形结构数组
 * @return {array} 整理后的数组
 */
export default function formatterMenusGetModels(array = []) {
  return (
    array &&
    array.length &&
    array.map(item => {
      let {path} = item
      const result = {
        ...item,
        exact: true,
        ...getModels(path)
        // name: item.name,
      }
      if (item.children && item.children.length) {
        result.children = formatterMenusGetModels(item.children)
      }
      return result
    })
  )
}
