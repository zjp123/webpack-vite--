import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, WhiteCard, SearchForm } from '@/components'
import { Button, Form, Input, Modal, message, DatePicker, Select, Switch } from 'antd'
import HospitalModal from './hospitalModal'
import DoctorModal from './doctorModal'
import { changeStatusUser } from '@/api/system'
import { STATE } from './model'
import { getPagation, goto, formatParameters } from '@/utils'
import { getDict } from '@/utils/publicFunc'
const Confirm = Modal.confirm

const HospitalManagement = ({ dispatch, hospitalManagementDataList, searchHospitalManagementForm, cityList }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  const [isShowHospitalModal, setIsShowHospitalModal] = useState(false) // 医院详情
  const [isShowDoctorModal, setIsShowDoctorModal] = useState(false) // 开通医生账号modal

  useEffect(() => {
    form.resetFields()
    dispatch({
      type: 'hospitalManagement/save',
      payload: {
        searchHospitalManagementForm: STATE.searchHospitalManagementForm
      }
    })
    getData()
    getDict(dispatch, 'hospital')
    getDict(dispatch, 'city')
  }, [])

  //获取列表数据
  const getData = async (pageInfo = {}) => {
    setLoading(true)
    await dispatch({
      type: 'hospitalManagement/getHospitalManagementDataList'
    })
    setLoading(false)
  }

  // 改变pagation
  const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
    dispatch({
      type: 'hospitalManagement/save',
      payload: {
        searchHospitalManagementForm: { ...searchHospitalManagementForm, pageNum, pageSize }
      }
    })
    getData()
  }

  // 查询区域
  const searchForm = () => {
    return (
      <SearchForm
        form={form}
        components={[
          {
            key: 'name',
            component: <Input maxLength={20} placeholder="请输入医院名称" key="name" />
          },
          {
            key: 'startTime',
            col: 8,
            component: <DatePicker.RangePicker allowClear placeholder={['创建时间', '结束时间']} />
          },
          {
            key: 'city',
            component: (
              <Select placeholder="请选择所在地区" allowClear>
                {cityList.map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            )
          }
        ]}
        actions={
          <>
            <Button
              onClick={() => {
                form.resetFields()
                dispatch({
                  type: 'hospitalManagement/save',
                  payload: {
                    searchHospitalManagementForm: STATE.searchHospitalManagementForm
                  }
                })
                getData()
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setId(0)
                setIsShowHospitalModal(true)
              }}
            >
              +创建医院
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setIsShowDoctorModal(true)
              }}
            >
              +开通医生账号
            </Button>
          </>
        }
        handleSearch={e => {
          let obj = formatParameters(e, {
            momentTrunString: [
              {
                formNameTime: 'startTime',
                startTime: 'startTime',
                endTime: 'endTime'
              }
            ]
          })
          dispatch({
            type: 'hospitalManagement/save',
            payload: {
              searchHospitalManagementForm: { ...searchHospitalManagementForm, pageNum: 1, name: '', ...e }
            }
          })
          getData()
        }}
      />
    )
  }

  //修改状态
  const switchChange = (checked, userId) => {
    changeStatusUser({
      status: checked ? '0' : '1',
      userId
    }).then(res => {
      if (res.code === 0) {
        message.success(checked ? '已启用' : '已禁用')
        getData()
      }
    })
  }

  const columns = [
    {
      title: '序号',
      width: 60,
      render: (text, record, index) => {
        return <span>{(searchHospitalManagementForm.pageNum - 1) * searchHospitalManagementForm.pageSize + index + 1}</span>
      }
    },
    {
      title: '医院名称',
      dataIndex: 'name'
    },
    {
      title: '医院账号',
      dataIndex: 'account'
    },
    // {
    //   title: '组织机构代码',
    //   dataIndex: 'uniformCrediCode'
    // },
    {
      title: '所在城市/地区',
      dataIndex: 'city'
    },
    {
      title: '联系人姓名',
      dataIndex: 'contactName'
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone'
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime'
    },
    {
      title: '账号状态',
      dataIndex: 'accountStatus',
      render: (text: string, record: Result.ObjectType) => {
        return <Switch checked={!!!Number(text)} onChange={checked => switchChange(checked, record.userId)} />
      }
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setId(record.id)
                setIsShowHospitalModal(true)
              }}
            >
              编辑
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                Confirm({
                  title: '删除',
                  content: '确认删除?',
                  centered: true,
                  onOk: () => {
                    dispatch({
                      type: 'hospitalManagement/deleteHospital',
                      payload: {
                        id: record.id
                      }
                    })
                  }
                })
              }}
            >
              删除
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                Confirm({
                  title: '重置密码',
                  content: '确认重置密码为 123456 ?',
                  onOk: () => {
                    dispatch({
                      type: 'hospitalManagement/resetHospitalPassword',
                      payload: { userId: record.userId }
                    })
                  }
                })
              }}
            >
              重置密码
            </Button>
            <span className="tiny-delimiter">|</span>
            <Button
              type="link"
              onClick={() => {
                setId(text.record)
                goto.push(`/student/hospitalManagement/hospitalDetail/${record.id}`)
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
    <WhiteCard style={{ background: 'transparent' }}>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchHospitalManagementForm)
        }}
        showTitle={false}
        dataSource={hospitalManagementDataList}
        columns={columns as any}
        search={searchForm()}
        rowKey="id"
        loading={loading}
      />
      {isShowHospitalModal && <HospitalModal id={id} parentForm={form} isShowHospitalModal={isShowHospitalModal} setIsShowHospitalModal={setIsShowHospitalModal} />}
      {isShowDoctorModal && <DoctorModal id={id} parentForm={form} isShowDoctorModal={isShowDoctorModal} setIsShowDoctorModal={setIsShowDoctorModal} />}
    </WhiteCard>
  )
}
export default connect(({ hospitalManagement, global }) => ({
  hospitalManagementDataList: hospitalManagement.hospitalManagementDataList,
  searchHospitalManagementForm: hospitalManagement.searchHospitalManagementForm,
  cityList: global.cityList
}))(HospitalManagement)
