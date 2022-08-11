import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { WhiteCard, TableView, SearchForm, AuthedButton } from '@/components'
import { getPagation, goto } from '@/utils'
import { STATE } from './model'
import { Button, Form, Input, Modal, Select } from 'antd'
import { ROMM_STATUS } from '@/utils/constants'
import { getDict } from '@/utils/publicFunc'
import EditModal from '@/pages/DrivingTest/drivingSchool/editModal'
import { getDictApi } from '@/api/common'
const DrivingSchool = ({ dispatch, schoolInfoList, searDrivingSchoolForm, perdritypeList, downloadUrl, fileDomainUrl }) => {
  const [form] = Form.useForm()
  const [id, setId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [driverLevelList, setDriverLevelList] = useState([])

  useEffect(() => {
    dispatch({
      type: 'drivingSchool/save',
      payload: {
        searDrivingSchoolForm: { ...STATE.searDrivingSchoolForm }
      }
    })
    dispatch({
      type: 'global/getFileDomain'
    })
    getUrl()
    getData()
    getDict(dispatch, 'perdritype')
    getDictApi({ type: `驾校级别` }).then(res => {
      setDriverLevelList(res.data.list)
    })
  }, [])
  //获取列表数据
  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: 'drivingSchool/loadDrivingSchoolList'
    })
    setLoading(false)
  }
  const getUrl = () => {
    dispatch({
      type: 'drivingSchool/exportDrivingSchoolList'
    })
  }
  // 翻页改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'drivingSchool/save',
      payload: {
        searDrivingSchoolForm: { ...searDrivingSchoolForm, pageNum, pageSize }
      }
    })
    getData()
    getUrl()
  }
  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'name',
            component: <Input maxLength={20} placeholder="请输入驾校名称" />
          },
          {
            key: 'perdritypes',
            component: (
              <Select placeholder="请选择驾校可培训车型" allowClear>
                {perdritypeList.map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          },
          // {
          //   key: 'schoolStatus',
          //   component: (
          //     <Select placeholder="请选择驾校级别" allowClear>
          //       {driverLevelList.map(({ value, label }) => {
          //         return (
          //           <Select.Option value={value} key={value}>
          //             {label}
          //           </Select.Option>
          //         )
          //       })}
          //     </Select>
          //   )
          // }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'drivingSchool/save',
                  payload: {
                    searDrivingSchoolForm: STATE.searDrivingSchoolForm
                  }
                })
                getData()
                getUrl()
              }}
            >
              重置
            </Button>
            <Button type="primary" disabled={!downloadUrl}>
              <a href={fileDomainUrl + downloadUrl}>下载驾校代码</a>
            </Button>
          </>
        }
        handleSearch={e => {
          dispatch({
            type: 'drivingSchool/save',
            payload: {
              searDrivingSchoolForm: { ...searDrivingSchoolForm, pageNum: 1, ...e, name: (e as any).name }
            }
          })
          getData()
          getUrl()
        }}
      />
    )
  }
  const columns = [
    {
      border: 'none',
      title: '编号',
      dataIndex: 'serialNum',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searDrivingSchoolForm.pageNum - 1) * searDrivingSchoolForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '驾校代码',
      width: 100,
      dataIndex: 'code'
    },
    {
      title: '驾校名称',
      dataIndex: 'name',
      width: 200
    },
    {
      title: '联系人',
      width: 120,
      dataIndex: 'contactUser'
    },
    {
      title: '驾校级别',
      dataIndex: 'level',
      width: 120
    },
    {
      title: '管理部门',
      dataIndex: 'officeName',
      width: 120
    },
    {
      title: '可培训车型',
      dataIndex: 'perdritypes',
      width: 120
    },
    {
      title: '预录入限制周期',
      dataIndex: 'configCleanType',
      width: 120
    },
    {
      title: '预录入次数',
      dataIndex: 'signupCount',
      width: 120
    },
    // {
    //   title: '预录入剩余次数',
    //   dataIndex: 'perdritypes',
    //   width: 120
    // },
    {
      title: '预录入状态',
      dataIndex: 'signupStatusName',
      width: 120,
      render: text => {
        return <span style={{ color: text === '正常' ? 'green' : 'red' }}>{text}</span>
      }
    },
    {
      title: '操作',
      width: 240,
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={async () => {
                await dispatch({
                  type: 'drivingSchool/renewSchoolConfigStatus',
                  payload: {
                    schoolId: record.id,
                    signupStatus: record.signupStatus === '0' ? '1' : '0'
                  }
                })
                getData()
                getUrl()
              }}
            >
              {record.signupStatusName === '正常' ? '停用' : '正常'}
            </Button>
            <Button
              type="link"
              onClick={() => {
                dispatch({
                  type: 'drivingSchool/save',
                  payload: {
                    isEditModalVisible: true,
                    id: record.id
                  }
                })
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => {
                goto.push('/drivingTest/drivingSchool/coachCarinformation/' + record.id)
              }}
            >
              查看详情
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <WhiteCard>
      <EditModal />
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searDrivingSchoolForm)
        }}
        showTitle={false}
        dataSource={schoolInfoList}
        search={searchForm()}
        columns={columns as any}
        rowKey="id"
        loading={loading}
      />
    </WhiteCard>
  )
}
export default connect(({ drivingSchool, global }) => ({
  schoolInfoList: drivingSchool.schoolInfoList,
  searDrivingSchoolForm: drivingSchool.searDrivingSchoolForm,
  downloadUrl: drivingSchool.downloadUrl,
  perdritypeList: global.perdritypeList,
  fileDomainUrl: global.fileDomainUrl
}))(DrivingSchool)
