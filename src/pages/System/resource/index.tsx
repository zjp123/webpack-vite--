import React, { useEffect, useState } from 'react'
import { connect } from 'dva';
import { TableView, WhiteCard, SearchForm } from '@/components'
import { Button, Form, Input, Modal, Space } from 'antd'
import CuResourceModal from './cuResourceModal'
import { STATE } from './model'

const Confirm = Modal.confirm
const muneobj = {
    M: '目录',
    C: '菜单',
    F: '按钮'
}
const Resource = ({ dispatch, resourceList, searchResourceForm, isCuResourceModalVisible }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [id, setId] = useState(0)
    useEffect(() => {
        dispatch({
            type: 'resource/save',
            payload: {
              searchResourceForm: {...STATE.searchResourceForm}
            },
          })
        getData()
    }, [])
    //获取列表数据
    const getData = async () => {
        setLoading(true)
        await dispatch({
            type: 'resource/loadResourceList'
        })
        setLoading(false)
    }

    // 查询区域
    const searchForm = () => {
        return (
            <SearchForm
                form={form}
                components={[{
                    key: 'menuName',
                    component: <Input maxLength={20} placeholder="请输入菜单名称" key="menuName" />
                }]}
                actions={
                    <Space>
                        <Button
                            onClick={() => {
                                form.resetFields()
                                dispatch({
                                    type: 'resource/save',
                                    payload: {
                                        searchResourceForm: STATE.searchResourceForm
                                    }
                                })
                                getData()
                            }}
                        >重置</Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                setId(0)
                                dispatch({
                                    type: 'resource/save',
                                    payload: {
                                        isCuResourceModalVisible: true
                                    }
                                })
                            }}>
                            新增
                        </Button>
                    </Space>
                }
                handleSearch={(e) => {
                    dispatch({
                        type: 'resource/save',
                        payload: {
                            searchResourceForm: { ...searchResourceForm, pageNum: 1, ...e }
                        }
                    })
                    getData()
                }}
            />
        )
    }

    const columns = [
        {
            title: '类型',
            dataIndex: 'menuType',
            width: 100,
            render: (text) => {
                return muneobj[text]
            }
        }, {
            title: '菜单名称',
            width: 140,
            dataIndex: 'menuName',
        },
        {
            title: '上级菜单',
            dataIndex: 'parentName',
            width: 140,
            render: (text) => {
                return text || '一级目录'
            }
        },
        {
            title: '菜单url',
            width: 180,
            dataIndex: 'path',
        },
        {
            title: '创建时间',
            dataIndex: 'createdTime',
            width: 150,
        }, {
            title: '授权标识',
            dataIndex: 'perms',
            width: 80
        }, {
            title: '排序号',
            width: 60,
            dataIndex: 'orderNum',
        }, {
            title: '业务状态',
            dataIndex: 'visible',
            width: 80,
            render: (text) => {
                return +text ? '隐藏' : '显示'
            }
        },
        {
            title: '操作',
            width: 120,
          fixed: "right",
            render: (text, record) => {
                return (
                    <>
                        <Button type='link' onClick={() => {
                            setId(text.menuId)
                            dispatch({
                                type: 'resource/save',
                                payload: {
                                    isCuResourceModalVisible: true
                                }
                            })
                        }}>编辑</Button>
                        <span className='tiny-delimiter'>|</span>
                        <Button type='link' onClick={() => {
                            Confirm({
                                title: '删除',
                                content: '确认删除?',
                                centered: true,
                                onOk: () => {
                                    dispatch({
                                        type: 'resource/deleteResource',
                                        payload: {
                                            menuId: text.menuId
                                        }
                                    })
                                }
                            });
                        }}>删除</Button>
                    </>
                );
            }
        }
    ]

    return (
        <WhiteCard style={{ background: 'transparent' }}>
            <TableView
                // pageProps={{
                //     getPageList: setPagation,
                //     pagination: getPagation(searchResourceForm)
                // }}
                showTitle={false}
                dataSource={resourceList}
                columns={columns as any}
                search={searchForm()}
                rowKey="menuId"
                loading={loading}
                hasPagination={false}
                extraHeight={-80}
            />
            {isCuResourceModalVisible && <CuResourceModal menuId={id} parentForm={form}/>}
        </WhiteCard>
    )
}
export default connect(({ resource }) => ({
    resourceList: resource.resourceList,
    searchResourceForm: resource.searchResourceForm,
    isCuResourceModalVisible: resource.isCuResourceModalVisible
}))(Resource)


