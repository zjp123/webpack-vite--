import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import {InfoCard, TableView, WhiteCard} from '@/components'
import { getPagation } from '@/utils'
import { Button, Form, Input, Popover, Row } from 'antd'
import CuCoachCarinforModal from './cuCoachCarinforModal'
import { STATE } from './model'
import './index.less'

const CoachCarinformation = ({ dispatch, coachCarList, searchCoachCarinformationForm, match, isCoachModalVisible, drivInfo }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>({})
  const [edit] = useState('修改驾校信息')
  useEffect(() => {
    dispatch({
      type: 'coachCarinformation/loadDrivInfo',
      payload: {
        id: match.params.id
      }
    })
    return () => {
      dispatch({
        type: "coachCarinformation/save",
        payload: {
          drivInfo: {},
        }
      })
    }
  }, [])
  useEffect(() => {
    if (drivInfo.serialNum) {
      dispatch({
        type: 'coachCarinformation/save',
        payload: {
          searchCoachCarinformationForm: { ...STATE.searchCoachCarinformationForm, schNum: drivInfo.serialNum }
        },
      })
      getData()
    }
  }, [drivInfo.serialNum])

  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: 'coachCarinformation/loadCoachCarList'
    })
    setLoading(false)
  }
  // 翻页改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'coachCarinformation/save',
      payload: {
        searchCoachCarinformationForm: { ...searchCoachCarinformationForm, pageNum, pageSize }
      }
    })
    getData()
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNum',
      width: 50,
      render: (text, record, index) => {
        return <span>{(searchCoachCarinformationForm.pageNum - 1) * searchCoachCarinformationForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '车牌号码',
      dataIndex: 'licenseNum',
      width: 90
    },
    {
      title: '教练车序号',
      dataIndex: 'serialNum',
      width: 90
    },
    {
      title: '教练车状态',
      dataIndex: 'carStatus',
      width: 90
    },
    {
      title: '初次登记日期',
      dataIndex: 'fRegisterTime',
      width: 140
    },
    {
      title: '强制报废日期',
      dataIndex: 'expiredTime',
      width: 140
    },
    {
      title: '培训车型',
      width: 90,
      dataIndex: 'perdritype'
    },
    {
      title: '车辆类型',
      width: 80,
      dataIndex: 'type'
    },
    {
      title: '车辆品牌',
      dataIndex: 'brand',
      width: 90
    },
    {
      title: '查看更多',
      width: 120,
      render: (text, record) => {
        return (
          <Popover
            content={
              <div style={{ minWidth: '250px' }}>
                {[
                  {
                    name: '号牌种类',
                    key: 'licenseType'
                  },
                  {
                    name: '创建人',
                    key: 'operator',
                  },
                  {
                    name: '创建时间',
                    key: 'createdTime',
                  },
                  {
                    name: '发证机关',
                    key: 'certifyingAuthority'
                  },
                  {
                    name: '审核人',
                    key: 'approver'
                  }
                ].map(i => (
                  <div>
                    {i.name}: {record[i.key] || ''}
                  </div>
                ))}
              </div>
            }
          >
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>更多信息</span>
          </Popover>
        )
      }
    }
  ]

  // 考场基本信息详情
  const EXAMINATION_ROOM_COLUMNS = [
    {
      title: '驾校地址',
      dataIndex: 'contactAddress', //contactAddress stubDeviceCount
      render: (text, record) => record.contactAddress || record.address
    },
    {
      title: '联系人',
      dataIndex: 'contactUser'
    },
    {
      title: '联系电话',
      dataIndex: 'contactTel'
    },
    {
      title: '可考车型',
      dataIndex: 'perdritypes'
    },
    {
      title: '发证机关',
      dataIndex: 'certifyingAuthority',
      required: true
    },
    {
      title: '管理部门',
      dataIndex: 'managementDepartment'
    },
    {
      title: '验收人',
      dataIndex: 'approver'
    },
    {
      title: '经办人',

      dataIndex: 'operator'
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime'
    },
    {
      title: '更新日期',
      dataIndex: 'updatedTime'
    },
    {
      title: '总队验收日期',
      dataIndex: 'acceptTime'
    },
    {
      title: '考场联网时间',
      dataIndex: 'siteTime'
    },
    {
      title: '科目二预约模式',
      dataIndex: 'k2AppointMode'
    }
  ]
  return (
    <div style={{ display: 'flex', flexDirection: "column" ,height:'100%'}} className="coachCarinformation">
        <div style={{ backgroundColor: '#fff', padding: '12px', marginBottom: '8px', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <span style={{ fontSize: 18, fontWeight: 500, color: '#000', marginRight: '40px' }}>{drivInfo.name}</span>
              {[
                {
                  title: '创建时间',
                  dataIndex: 'createdTime'
                },
                {
                  title: '创建人',
                  dataIndex: 'createdByName'
                },
                {
                  title: '最近更新时间',
                  dataIndex: 'updatedTime'
                },
                {
                  title: '更新人',
                  dataIndex: 'updatedByName'
                }
              ].map(({ title, dataIndex }) => {
                return (
                  <span key={dataIndex} style={{ marginRight: '15px', color: '#666', fontSize: 14, fontWeight: 400 }}>
                    {title}: {drivInfo[dataIndex]}
                  </span>
                )
              })}
            </div>
            <div>
              <Row style={{ display: 'flex', justifyContent: 'space-between' }} align="middle">
                <Button
                  htmlType="submit"
                  onClick={() => {
                    dispatch({
                      type: 'coachCarinformation/save',
                      payload: {
                        isCoachModalVisible: true
                      }
                    })
                    if (edit === '修改考场信息') {
                      form.validateFields().then(e => {
                      })
                    }
                  }}
                >
                  {edit}
                </Button>
              </Row>
            </div>
          </div>
          <InfoCard columns={EXAMINATION_ROOM_COLUMNS} data={drivInfo}/>
        </div>
      <TableView
        style={{ flex: 1 }}
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchCoachCarinformationForm)
        }}
        loading={loading}
        showTitle={false}
        dataSource={coachCarList}
        search={
          <p style={{ marginRight: '8px', fontWeight: 900 }}>教练车信息列表</p>
        }
        columns={columns as any}
        rowKey="id"
      />
      {isCoachModalVisible && <CuCoachCarinforModal id={match.params.id} />}
    </div>
  )
}
export default connect(({ coachCarinformation }) => ({
  coachCarList: coachCarinformation.coachCarList,
  searchCoachCarinformationForm: coachCarinformation.searchCoachCarinformationForm,
  isCoachModalVisible: coachCarinformation.isCoachModalVisible,
  drivInfo: coachCarinformation.drivInfo,
}))(CoachCarinformation)
