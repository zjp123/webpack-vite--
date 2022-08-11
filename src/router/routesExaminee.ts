/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-09-04 10:31:06
 * @description: 考生签名管理路由
 */

import KSQM from '@/assets/svg/KSQM.svg'
export default [
    {
        path: '/examinee',
        name: '考生签名管理',
        key: 'examinee',
        type: 'subMenu',
        iconfont: KSQM, //
        // icon: AuditOutlined,
        routes: [
            /**========== 考生签名 =========== */
            {
                path: '/examinee/sign',
                name: '考生签名管理',
                exact: true,
                key: 'examinee:sign',
                component: () => import('@/pages/Examinee/sign'),
                models: () => [import('@/pages/Examinee/sign/model')]
            },
            /** ======= 考生补签 ================ */
            {
                path: '/examinee/resign',
                name: '考生签名',
                exact: true,
                key: 'examinee:resign',
                component: () => import('@/pages/Examinee/resign'),
                models: () => [import('@/pages/Examinee/resign/model')]
            }
        ]
    }
]
