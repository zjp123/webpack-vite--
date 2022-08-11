import React, { useEffect, useState } from 'react'
import { connect } from 'dva';
import { TableView, WhiteCard, SearchForm } from '@/components'
import { Button, Form, Select, Input, } from 'antd'
import { getPagation } from '@/utils'
import { STATE } from './model'
import { getDict } from "@/utils/publicFunc";

const LackoFinfor = ({ dispatch, searchLackofinforForm, lackofinforList, courseList }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        dispatch({
            type: 'lackoFinfor/save',
            payload: {
              searchLackofinforForm: {...STATE.searchLackofinforForm}
            },
          })
        getData()
        getDict(dispatch, "course")
    }, [])
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
        dispatch({
            type: 'lackoFinfor/save',
            payload: {
                searchLackofinforForm: { ...searchLackofinforForm,pageNum, pageSize }
            }
        })
        getData()
    }
    //获取列表数据
    const getData = async () => {
        setLoading(true)
        await dispatch({
            type: 'lackoFinfor/loadLackofinforList'
        })
        setLoading(false)
    }
    // 查询区域
    const searchForm = () => {
        return (
            <SearchForm
                form={form}
                components={[{
                    key: 'schName',
                    component: <Input maxLength={20} placeholder="请输入驾校名称" key="schName" />
                },
                {
                    key: 'idCard',
                    component: <Input maxLength={20} placeholder="请输入学员姓名/身份证号" key="idCard" />
                }, {
                    key: 'course',
                    component: <Select placeholder="请选择考试科目" allowClear>
                        {
                            courseList.map(({ value, label }) => {
                                return <Select.Option value={value} key={value}>{label}</Select.Option>
                            })
                        }
                    </Select>
                },
                ]}
                actions={
                    <Button
                        onClick={() => {
                            form.resetFields()
                            dispatch({
                                type: 'lackoFinfor/save',
                                payload: {
                                    searchLackofinforForm: STATE.searchLackofinforForm
                                }
                            })
                            getData()
                        }}>
                        重置
                    </Button>
                }
                handleSearch={(e) => {
                    dispatch({
                        type: 'lackoFinfor/save',
                        payload: {
                            searchLackofinforForm: { ...searchLackofinforForm,pageNum: 1, ...e }
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
            flex: 'left',
            render: (text, record, index) => {
                return <span>{(searchLackofinforForm.pageNum - 1) * searchLackofinforForm.pageSize + index + 1}</span>
            }
        },
        {
            title: '流水号',
            dataIndex: 'serialNum',
            width: 90,
        }, {
            title: '欠费学员姓名',
            width: 100,
            dataIndex: 'name',
        },
        {
            title: '身份证号码',
            dataIndex: 'idCard',
            width: 200,
        },
        {
            title: '驾校名称',
            dataIndex: 'schName',
            width: 190,
        },
        {
            title: '考场名称',
            dataIndex: 'examSiteName',
            width: 120,
        },
        {
            title: '欠费科目',
            dataIndex: 'course',
            width: 100,
        },
        {
            title: '核验时间',
            dataIndex: 'checkTime',
            width: 170,
        },
        {
            title: '欠费金额',
            dataIndex: 'amount',
            width: 120,
        },
    ]
    return (
        <WhiteCard>
            <TableView
                pageProps={{
                    getPageList: setPagation,
                    pagination: getPagation(searchLackofinforForm)
                }}
                showTitle={false}
                dataSource={lackofinforList}
                columns={columns}
                search={searchForm()}
                rowKey="lackoFinfor"
                loading={loading}
            />
        </WhiteCard>
    )
}
export default connect(({ lackoFinfor, global }) => ({
    lackofinforList: lackoFinfor.lackofinforList,
    searchLackofinforForm: lackoFinfor.searchLackofinforForm,
    courseList: global.courseList
}))(LackoFinfor)


