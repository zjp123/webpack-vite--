import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, WhiteCard, SearchForm, Images } from '@/components'
import { Button, Form, Input, Modal, message, DatePicker, Switch, } from 'antd'
import HospitalModal from './hospitalModal'
import { changeStatusUsert } from '@/api/student'
import { getPagation } from '@/utils'
import { STATE } from './model'
import { resetPwd } from '@/api/common'
import { formatParameters } from '@/utils'

const Confirm = Modal.confirm
const Doctormanagement = ({ dispatch, doctormanagementList, searchMedicalForm, ishospitalModalVisible, isCuRoleModalVisible }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState(0)
    useEffect(() => {
      form.resetFields()
      dispatch({
        type: 'doctormanagement/save',
        payload: {
          searchMedicalForm: {...STATE.searchMedicalForm}
        }
      })
      getData()
    }, [])
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
        dispatch({
            type: 'doctormanagement/save',
            payload: {
                searchMedicalForm: { ...searchMedicalForm,pageNum, pageSize }
            }
        })
        getData()
    }
    //获取列表数据
    const getData = async () => {
        setLoading(true)
        await dispatch({
            type: 'doctormanagement/loadDoctormanagementList'
        })
        setLoading(false)
    }
    // 查询区域
    const searchForm = () => {
        return (
            <SearchForm
                form={form}
                components={[
                    {
                        key: 'doctorName',
                        component: <Input key="doctorName" placeholder="请输入医生姓名"/>
                    },
                    {
                        key: 'createTime',
                        col:8,
                        component: <DatePicker.RangePicker allowClear placeholder={['创建时间', '结束时间']} />
                    },
                    {
                        key: 'hospitalName',
                        component:  <Input key="hospitalName" placeholder="请输入所在医院"/>
                    }
                ]}
                actions={
                    <>
                        <Button
                            onClick={() => {
                                form.resetFields()
                                dispatch({
                                    type: 'doctormanagement/save',
                                    payload: {
                                        searchMedicalForm: STATE.searchMedicalForm
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
                                dispatch({
                                    type: 'doctormanagement/save',
                                    payload: {
                                        ishospitalModalVisible: true
                                    }
                                })
                            }}
                        >
                            +增加医生
                        </Button>
                    </>
                }
                handleSearch={e => {
                    let obj = formatParameters(e, {
                        momentTrunString: [{
                            formNameTime: 'createTime',
                            startTime: 'beginTime',
                            endTime: 'endTime',
                        }],
                    })
                    if(obj.hospitalName){
                        obj.hospital_id=obj.hospitalName.key
                    }
                    delete obj.createTime
                    delete obj.hospitalName
                    dispatch({
                        type: 'doctormanagement/save',
                        payload: {
                            searchMedicalForm: { ...searchMedicalForm, pageNum: 1, doctorName: '', startTime: '', endTime: '', hospitalName: '', ...obj }
                        }
                    })
                    getData()
                }}
            />
        )
    }
    //修改状态
    const switchChange = (checked, userId) => {
        changeStatusUsert({
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
                return <span>{(searchMedicalForm.pageNum - 1) * searchMedicalForm.pageSize + index + 1}</span>
            }
        },
        {
            title: '医生姓名',
            dataIndex: 'doctorName',
            width: 100
        },
        {
            title: '所属医院',
            width: 100,
            dataIndex: 'hospitalName'
        },
        {
            title: '账号',
            dataIndex: 'userName',
            width: 150
        },
        {
            title: '手机号',
            dataIndex: 'phonenumber',
            width: 120
        },
        {
            title: '电子签名',
            dataIndex: 'electronicSign',
            width: 100,
            render: (text) => {
                return <Images width={40} src={text} />
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            width: 180
        },
        {
            title: '账号状态 ',
            dataIndex: 'status',
            width: 80,
            render: (text: string, record: Result.ObjectType) => {
                return <Switch
                    checked={!(!!(Number(text)))}
                    onChange={(checked) => switchChange(checked, record.userId)}
                />
            }
        },
        {
            title: '操作',
            width: 230,
            render: (text, record) => {
                return (
                    <>
                        <Button
                            type="link"
                            onClick={() => {
                                setId(text.userId)
                                dispatch({
                                    type: 'doctormanagement/save',
                                    payload: {
                                        ishospitalModalVisible: true
                                    }
                                })
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
                                            type: 'doctormanagement/addoctorman',
                                            payload: {
                                                doctorId: text.doctorId,
                                                userId: text.userId
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
                                    content: '确认重置密码为123456?',
                                    onOk: () => {
                                        resetPwd({
                                            userId: record.userId,
                                        }).then((res) => {
                                            if (res.code === 0) {
                                                message.success('重置密码成功为123456')
                                            }
                                        })
                                    }
                                });
                            }}
                        >
                            重置密码
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
                    pagination: getPagation(searchMedicalForm)
                }}
                showTitle={false}
                dataSource={doctormanagementList}
                columns={columns}
                search={searchForm()}
                rowKey="doctorId"
                loading={loading}
            />
            {ishospitalModalVisible && <HospitalModal userId={id} parentForm={form}/>}
        </WhiteCard>
    )
}
export default connect(({ doctormanagement }) => ({
    doctormanagementList: doctormanagement.doctormanagementList,
    searchMedicalForm: doctormanagement.searchMedicalForm,
    isCuRoleModalVisible: doctormanagement.isCuRoleModalVisible,
    ishospitalModalVisible: doctormanagement.ishospitalModalVisible,
}))(Doctormanagement)
