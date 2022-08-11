import React, { useEffect, useState } from 'react'
import { connect } from 'dva';
import { TableView, Images, WhiteCard, SearchForm } from '@/components'
import { Button, Form, Select, Input, } from 'antd'
import { getPagation, } from '@/utils'
import { STATE } from './model'
import { getDict } from "@/utils/publicFunc"
import { Taskstatus } from '@/utils/constants'
import replacementPic from "@/components/Replacement"
//自动分配考台考车管理
const Sheet = ({ dispatch, sheetList, searcSheetForm, courseList, bizTypeList, perdritypeList }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [id,] = useState(0)
    useEffect(() => {
        dispatch({
            type: 'sheet/save',
            payload: {
                searcSheetForm: { ...STATE.searcSheetForm }
            },
        })
        getData()
        getDict(dispatch, "course")
        getDict(dispatch, "bizType")
        getDict(dispatch, "perdritype")
    }, [])
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
        dispatch({
            type: 'sheet/save',
            payload: {
                searcSheetForm: { ...searcSheetForm, pageNum, pageSize }
            }
        })
        getData()
    }
    //获取列表数据
    const getData = async () => {
        setLoading(true)
        await dispatch({
            type: 'sheet/loadsheetList'
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
                        key: 'name',
                        component: <Input maxLength={20} placeholder="请输入考生姓名" key="name" />
                    },
                    {
                        key: 'course',
                        component: (
                            <Select placeholder="请选择考试科目" allowClear>
                                {courseList.map(({ value, label }) => {
                                    return (
                                        <Select.Option value={value} key={value}>
                                            {label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        )
                    },
                    {
                        key: 'perdritype',
                        component: (
                            <Select placeholder="请选择报考车型" allowClear>
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
                    {
                        key: 'businessStatus',
                        component: (
                            <Select placeholder="请选择业务类型" allowClear>
                                {bizTypeList.map(({ value, label }) => {
                                    return (
                                        <Select.Option value={value} key={value}>
                                            {label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        )
                    },
                    {
                        key: 'assignStatus',
                        component: (
                            <Select placeholder="请选择核验状态" allowClear>
                                {Taskstatus.map(({ value, label }) => {
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
                    <Button
                        onClick={() => {
                            form.resetFields()
                            dispatch({
                                type: 'sheet/save',
                                payload: {
                                    searcSheetForm: STATE.searcSheetForm
                                }
                            })
                            getData()
                        }}
                    >
                        重置
                    </Button>
                }
                handleSearch={e => {
                    dispatch({
                        type: 'sheet/save',
                        payload: {
                            searcSheetForm: { ...searcSheetForm, pageNum: 1, ...e }
                        }
                    })
                    getData()
                }}
            />
        )
    }

    const columns = [
        {
            title: '编号',
            width: 60,
            render: (text, record, index) => {
                return <span>{(searcSheetForm.pageNum - 1) * searcSheetForm.pageSize + index + 1}</span>
            }
        },
        {
            title: '核验照片',
            dataIndex: 'picUrl',
            width: 80,
            render: text => {
                return text ? replacementPic(text, <Images width={30} height={40} src={text} />, {}) : <img src={require('@/assets/img/bejtu.png')} style={{ marginRight: 0, width: "30px", height: `40px` }} alt="" />
            }
        },
        {
            title: '核验时间',
            dataIndex: 'createdTime',
            width: 180,
        }, {
            title: '姓名',
            width: 100,
            dataIndex: 'name',
        }, {
            title: '身份证明号码',
            dataIndex: 'idCard',
            width: 200,
        }, {
            title: '联系方式',
            dataIndex: 'contactPhone',
            width: 120,
        }, {
            title: '考场名称 ',
            dataIndex: 'examSite',
            width: 180,
        },
        {
            title: '预约科目',
            dataIndex: 'course',
            width: 120,
        },
        {
            title: '报考车型',
            dataIndex: 'perdritype',
            width: 80,
        }, {
            title: '考车/考台',
            dataIndex: 'assignSite',
            width: 150,
        }, {
            title: '业务类型',
            dataIndex: 'businessStatus',
            width: 120,
        },
        {
            title: '核验状态',
            width: 100,
            dataIndex: 'assignStatus',
        }
    ]

    return (
        <TableView
            pageProps={{
                getPageList: setPagation,
                pagination: getPagation(searcSheetForm)
            }}
            showTitle={false}
            dataSource={sheetList}
            columns={columns as any}
            search={searchForm()}
            rowKey="createdTime"
            getSelection={getSelection}
            loading={loading}
        />
    )
}
export default connect(({ sheet, global }) => ({
    sheetList: sheet.sheetList,
    searcSheetForm: sheet.searcSheetForm,
    courseList: global.courseList,
    bizTypeList: global.bizTypeList,
    perdritypeList: global.perdritypeList
}))(Sheet)


