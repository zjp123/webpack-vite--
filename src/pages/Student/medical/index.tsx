import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { TableView, WhiteCard, SearchForm, Images } from '@/components'
import { Button, Form, Input, DatePicker, Select } from 'antd'
import CuInforMatoneModal from './cuInforMatoneModal'
import { AMEDICAL } from '@/utils/constants'
import { getPagation, formatParameters } from '@/utils'
import { STATE } from './model'
import './style.less'
import replacementPic from "@/components/Replacement"
const Medical = ({ dispatch, medicalList, searchMedicalForm,  isCuInformationModalVisible }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState<any>()
    useEffect(() => {
        dispatch({
            type: 'medical/save',
            payload: {
              searchMedicalForm: {...STATE.searchMedicalForm}
            },
          })
        getData()
    }, [])
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
        dispatch({
            type: 'medical/save',
            payload: {
                searchMedicalForm: { ...searchMedicalForm, pageNum, pageSize }
            }
        })
        getData()
    }
    //获取列表数据
    const getData = async () => {
        setLoading(true)
        await dispatch({
            type: 'medical/loadMedicalList'
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
                        key: 'seach',
                        component: <Input maxLength={20} placeholder="请输入输入姓名/身份证号 " key="seach" />
                    },
                    {
                        key: 'settime',
                        col:8,
                        component: <DatePicker.RangePicker allowClear placeholder={['创建时间', '结束时间']} />
                    },
                    {
                        key: 'healthResult',
                        component: (
                            <Select placeholder="请选择体检结果" allowClear>
                                {[{ value: 0, label: '不合格' }, { value: 1, label: '合格' }].map(({ value, label }) => {
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
                                    type: 'medical/save',
                                    payload: {
                                        searchMedicalForm: STATE.searchMedicalForm
                                    }
                                })
                                getData()

                            }}
                        >
                            重置
                        </Button>
                    </>
                }
                handleSearch={e => {
                    let obj = formatParameters(e, {
                        momentTrunString: [
                            {
                                formNameTime: 'settime',
                                startTime: 'physicalTimeStart',
                                endTime: 'physicalTimeEnd',
                            }
                        ]
                    })
                    dispatch({
                        type: 'medical/save',
                        payload: {
                            searchMedicalForm: { ...searchMedicalForm, pageNum: 1, seach: '', startTime: '', endTime: '', healthResult: '', ...e }
                        }
                    })
                    getData()
                }}
            />
        )
    }

    const columns = [
        {
            title: '序号',
            width: 60,
            render: (text, record, index) => {
                return <span>{(searchMedicalForm.pageNum - 1) * searchMedicalForm.pageSize + index + 1}</span>
            }
        },
        // {
        //     title: '档案编号',
        //     width: 185,
        //     dataIndex: 'fileNum'
        // },
        {
            title: '姓名',
            width: 100,
            dataIndex: 'name'
        },
        {
            title: '身份证号',
            dataIndex: 'idcard',
            width: 200
        },
        {
            title: '准驾车型',
            dataIndex: 'perdritype',
            width: 120
        },
        {
            title: '体检日期',
            dataIndex: 'physicalTime',
            width: 190
        },

        {
            title: '体检结果',
            dataIndex: 'healthResult',
            width: 100,
            render: text => {
                const ITEM = AMEDICAL.find(({ value }) => +value === text)
                if (!ITEM) {
                    return '-'
                }
                return <span>{ITEM.used_label}</span>
            }
        },
        {
            title: '体检医院',
            dataIndex: 'hospitalName',
            width: 120
        },
        {
            title: '责任医生',
            dataIndex: 'doctorName',
            width: 100
        },
        {
            title: '详细信息',
            width: 120,
            fixed: 'right',
            render: (text, record) => {
                return (
                    <>
                        <Button
                            type="link"
                            disabled={!record?.stuId}
                            onClick={() => {
                                setId(record.stuId)
                                dispatch({
                                    type: 'medical/save',
                                    payload: {
                                        isCuInformationModalVisible: true
                                    }
                                })
                            }}
                        >
                            查看
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
                dataSource={medicalList}
                columns={columns as any}
                search={searchForm()}
                rowKey="medical"
                loading={loading}
            />
            {isCuInformationModalVisible && <CuInforMatoneModal id={id} />}
        </WhiteCard>
    )
}
export default connect(({ medical }) => ({
    medicalList: medical.medicalList,
    searchMedicalForm: medical.searchMedicalForm,
    isCuInformationModalVisible: medical.isCuInformationModalVisible
}))(Medical)
