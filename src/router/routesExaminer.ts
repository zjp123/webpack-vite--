/**
 * 考官日程安排管理路由
 */
import KGRC from '@/assets/svg/KGRC.svg'
export default [
    {
        path: '/examiner',
        name: '考官日程安排管理',
        key: 'examiner',
        type: 'subMenu',
        iconfont: KGRC, //
        // icon: AuditOutlined,
        routes: [
            /**========== 考试预约管理 =========== */
            {
                path: '/examiner/schedule',
                name: '考试预约管理',
                exact: true,
                key: 'examiner:schedule',
                component: () => import('@/pages/Examiner/schedule'),
                models: () => [import('@/pages/Examiner/schedule/model')]
            },
            {
                path: '/examiner/schedule/checkSchedule/:id',
                name: '考试预约列表',
                exact: true,
                notMenu: true,
                key: 'examiner:schedule:checkSchedule',
                component: () => import('@/pages/Examiner/schedule/checkScheduleModal'),
                models: () => [import('@/pages/Examiner/schedule/model')]
            },
            {
                path: '/examiner/schedule/checkDetail/:id',
                name: '考试预约详情',
                exact: true,
                notMenu: true,
                key: 'examiner:schedule:checkSchedule',
                component: () => import('@/pages/Examiner/schedule/checkDetailModal'),
                models: () => [import('@/pages/Examiner/schedule/model')]
            },

            /** ======= 考官日程安排 ================ */
            {
                path: '/examiner/order',
                name: '考官日程安排',
                exact: true,
                key: 'examiner:order',
                component: () => import('@/pages/Examiner/order'),
                models: () => [import('@/pages/Examiner/order/model')]
            },

            {
                path: '/examiner/autograph',
                name: '考官签名管理',
                exact: true,
                key: 'examiner:autograph',
                component: () => import('@/pages/Examiner/autograph'),
                models: () => [import('@/pages/Examiner/autograph/model')]
            },

            {
                path: '/examiner/manage',
                name: '考试管理',
                exact: true,
                key: 'examiner:manage',
                component: () => import('@/pages/Examiner/manage'),
                models: () => [import('@/pages/Examiner/manage/model')]
            },
            {
                path: '/examiner/sign',
                name: '开启考试',
                notMenu: true,
                exact: true,
                key: 'examiner:manage',
                component: () => import('@/pages/Examiner/manage/cuSignModal'),
                models: () => [import('@/pages/Examiner/manage/model')]
            }
        ]
    }
]
