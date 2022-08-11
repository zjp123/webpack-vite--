import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { List, Typography, Button } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import * as actions from '@/store/actions'
import { setUserInfo } from '@/utils/publicFunc'

const { Text } = Typography
const dataSource = [
  {
    code: 'auth:test:view',
    name: '查看权限测试页'
  },
  {
    code: 'faceRecognition',
    name: '考生人像识别管理'
  },
  {
    code: 'faceRecognition:collection',
    name: '人像信息采集'
  },
  {
    code: 'faceRecognition:comparison',
    name: '人像对比记录'
  },
  {
    code: 'drivingTest:drivingSchool:coachCarinformation',
    name: '教练车信息'
  },
  {
    code: 'drivingTest',
    name: '驾考基础信息管理'
  },
  {
    code: 'drivingTest:drivingSchool',
    name: '驾校信息管理'
  },
  {
    code: 'drivingTest:examinationRoom',
    name: '考场信息管理'
  },
  {
    code: 'drivingTest:examinationRoom:examinationPage',
    name: '考场信息管理查看详情'
  },
  {
    code: 'drivingTest:examinerinFormation',
    name: '考官信息管理'
  },
  {
    code: 'drivingTest:examinerinFormation:examinerfinPage',
    name: '考官信息管理详情页面'
  },
  {
    code: 'drivingTest:safetyoFficerin',
    name: '安全员信息管理'
  },
  {
    code: 'faceRecognition:comparison:checkComparisonPage',
    name: '查看'
  },
  {
    code: 'faceRecognition:limitRecord',
    name: '限制人员信息记录'
  },
  {
    code: 'drivingTest:safetyoFficerin:checkSafetyoPage',
    name: '查看'
  },
  {
    code: 'management:checkthe',
    name: '欠费信息查询'
  },
  {
    code: 'management:lackofinfor',
    name: '考前核验记录'
  },
  {
    code: 'system',
    name: '系统管理'
  },
  {
    code: 'system:user',
    name: '用户管理'
  },
  {
    code: 'system:role',
    name: '角色管理'
  },
  {
    code: 'system:department',
    name: '部门管理'
  },
  {
    code: 'electronic',
    name: '电子档案信息管理'
  },
  {
    code: 'electronic:information',
    name: '电子档案管理'
  },
  {
    code: 'electronic:recording',
    name: '电子档案补录（驾校）'
  },
  {
    code: 'electronic:integrity',
    name: '电子档案完整性核验'
  },
  {
    code: 'electronic:spotCheck',
    name: '电子档案抽查'
  },
  {
    code: 'examiner',
    name: '考官日程安排管理'
  },
  {
    code: 'examiner:schedule',
    name: '考官预约管理'
  },
  {
    code: 'examiner:order',
    name: '考官日程管理'
  },
  {
    code: 'examiner:schedule:checkSchedule',
    name: '考试预约列表'
  },
  {
    code: 'examiner:manage',
    name: '考官管理'
  },
  {
    code: 'examiner:autograph',
    name: '考官签名管理'
  },
  {
    code: 'leaderscock:dataanalysis',
    name: '领导人驾驶'
  },

]

interface Props extends ReduxProps { }

const AuthTest: FC<Props> = ({ storeData: { userInfo }, setStoreData }) => {
  const history = useHistory()
  const { userName, permission } = userInfo

  // 切换权限
  const changeAuth = () => {
    const newInfo = {
      ...userInfo,
      // 模拟权限
      permission:
        permission.length === 5
          ? dataSource
          : [
            {
              code: 'auth:test:view',
              name: '查看权限测试页'
            }, {
              code: 'auth:test:view',
              name: '查看权限测试页'
            }, {
              code: 'auth:test:view',
              name: '查看权限测试页'
            }, {
              code: 'auth:test:view',
              name: '查看权限测试页'
            }, {
              code: 'auth:test:view',
              name: '查看权限测试页'
            }
          ]
    }
    setUserInfo(newInfo, setStoreData)
  }

  return (
    <>
      <Text style={{ margin: 20 }}>
        当前用户：<Text code>{userName}</Text>
      </Text>
      <br />
      <Text style={{ margin: 20 }}>
        当前权限：
        <KeyOutlined />
      </Text>
      <List
        size="large"
        footer={
          <Button type="primary" onClick={changeAuth}>
            切换权限
          </Button>
        }
        bordered
        dataSource={permission}
        renderItem={(item: CommonObjectType<string>) => (
          <List.Item>
            {item.name} - {item.code}
          </List.Item>
        )}
        style={{ margin: 20 }}
      />
      <Button onClick={() => history.push('/role/list')} style={{ margin: 20 }}>
        切换权限后，点击这里，访问【角色列表】试试
      </Button>
    </>
  )
}

export default connect(
  (state) => state,
  actions
)(AuthTest)
