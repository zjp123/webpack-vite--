import React, { useEffect, useState, useMemo } from 'react'
import { Button, Form, Select, Input, DatePicker } from 'antd'
import { connect } from 'dva';
import { TableView, WhiteCard, SearchForm } from '@/components'
import { STATE } from './model'
import { getDict } from "@/utils/publicFunc"
import { getPagation, goto, formatParameters } from '@/utils'
const Comparison = ({ dispatch, comparisonList, searchComparisonForm, exsList, keepaliveSearchForm }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const setSearchForm = () => {
        if(keepaliveSearchForm) {
          dispatch({
            type: "comparison/save",
            payload: {
                searchComparisonForm: {...keepaliveSearchForm},
              keepaliveSearchForm: null,
            }
          })
        } else {
          dispatch({
            type: "comparison/save",
            payload: {
                searchComparisonForm: {...STATE.searchComparisonForm}
            }
          })
        }
      }
    useEffect(() => {
        form.setFieldsValue({
            startTime: ['', '']
        })
        // dispatch({
        //     type: 'comparison/save',
        //     payload: {
        //       searchComparisonForm: {...STATE.searchComparisonForm}
        //     },
        //   })
        setSearchForm()
        getData()
        getDict(dispatch, "exs")

    }, [])
    // 改变pagation
    const setPagation = (pageInfo: Result.pageInfo) => {
        dispatch({
            type: 'comparison/save',
            payload: {
                searchComparisonForm: {...searchComparisonForm, pageNum: pageInfo.pageNum, pageSize: pageInfo.pageSize }
            }
        })
        getData()
    }
    //获取列表数据
    const getData = async () => {
        setLoading(true)
        await dispatch({
            type: 'comparison/loadComparisonList'
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
                        key: 'idCard',
                        col: 8,
                        component: <Input  maxLength={20} placeholder="请输入姓名/身份号码" key="idCard" />
                    },
                    {
                        key: 'schShortName',
                        component: <Input maxLength={20} placeholder="请输入驾校名称" key="schShortName" />
                    },
                    {
                        key: 'examSite',
                        component: <Select placeholder="请选择考场" allowClear>
                            {
                                exsList.map(({ value, label }) => {
                                    return <Select.Option value={value} key={value}>{label}</Select.Option>
                                })
                            }
                        </Select>
                    }, {
                        key: 'autoResult',
                        component: <Select placeholder="请选择自动比对结果" allowClear>
                            {
                                [{ value: 1, label: '通过' }, { value: 0, label: '不通过' }].map(({ value, label }) => {
                                    return <Select.Option value={value} key={value}>{label}</Select.Option>
                                })
                            }
                        </Select>
                    }, {
                        key: 'manualResult',
                        component: <Select placeholder="请选择人工比对结果" allowClear>
                            {
                                [{ value: 1, label: '通过' }, { value: 0, label: '不通过' }].map(({ value, label }) => {
                                    return <Select.Option value={value} key={value}>{label}</Select.Option>
                                })
                            }
                        </Select>
                    },
                    {
                        key: "startTime",
                        col: 8,
                        component: <DatePicker.RangePicker allowClear placeholder={["开始时间", "结束时间"]}/>
                    }
                ]}
                actions={
                    <Button
                        onClick={() => {
                            form.resetFields()
                            dispatch({
                                type: 'comparison/save',
                                payload: {
                                    searchComparisonForm: { ...STATE.searchComparisonForm }
                                }
                            })
                            getData()
                        }}>
                        重置
                    </Button>
                }
                handleSearch={(e) => {
                    let data = formatParameters(e, {
                        momentTrunString: [
                          {
                            formNameTime: "startTime",
                            startTime: "compareStartTime",
                            endTime: "compareEndTime"
                          }
                        ]
                    })
                    // console.log(e, 'lllll')
                    dispatch({
                        type: 'comparison/save',
                        payload: {
                            searchComparisonForm: { ...searchComparisonForm,pageNum: 1, ...e, ...data}
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
                return <span>{(searchComparisonForm.pageNum - 1) * searchComparisonForm.pageSize + index + 1}</span>
            }
        },
        {
            title: '流水号',
            dataIndex: 'serialNum',
            width: 90,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 80,
        }, {
            title: '身份证号码',
            width: 160,
            dataIndex: 'idCard',
        }, {
            title: '驾校名称',
            dataIndex: 'schShortName',
            width: 160,
        },
     
        {
            title: '科目',
            dataIndex: 'course',
            width: 60,
        },
        {
            title: '相似度',
            dataIndex: 'similarity',
            width: 70,
        },
        {
            title: '自动比对',
            dataIndex: 'autoResult',
            width: 80,
            render: (text) => {
                return text === '不通过' ? <span style={{ color: 'red' }}>{text}</span> : <span style={{ color: '' }}>{text}</span>
            }
        },
        {
            title: '自动比对时间',
            dataIndex: 'compareTime',
            width: 120,
        },
        {
            title: '人工比对',
            dataIndex: 'manualResult',
            width: 80,
            render: (text) => {
                return text === '不通过' ? <span style={{ color: 'red' }}>{text}</span> : <span style={{ color: '' }}>{text}</span>
            }
        }
        , {
            title: '操作',
            width: 60,
            dataIndex: 'id',
            fixed: 'right',
            render: (text, record) => {
                return <Button type='link' onClick={() => {
                    goto.push('/faceRecognition/comparison/checkComparisonPage/'+ text)
                    dispatch({
                        type: "comparison/save",
                        payload: {
                          keepaliveSearchForm: searchComparisonForm
                        }
                      })
                }}>查看详情 </Button>
            }
        }
    ]
    return (
        <WhiteCard style={{ background: 'transparent' }} >
            <TableView
                pageProps={{
                    getPageList: setPagation,
                    pagination: getPagation(searchComparisonForm)
                }}
                showTitle={false}
                dataSource={comparisonList}
                search={searchForm()}
                columns={columns as any}
                rowKey="id"
                loading={loading}
            />
        </WhiteCard>
    )
}
export default connect(({ comparison ,global}) => ({
    comparisonList: comparison.comparisonList,
    searchComparisonForm: comparison.searchComparisonForm,
    exsList:global.exsList,
    keepaliveSearchForm: comparison.keepaliveSearchForm
}))(Comparison)


