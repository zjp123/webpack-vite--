import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Radio, Modal, TreeSelect, message } from 'antd'
import { FORMITEM_LAYOUT } from "@/utils/constants"
import { getResourceInfo } from '@/api/system'
import { connect } from 'dva'
const { TreeNode } = TreeSelect

interface cuResourceModalProps {
    menuId?: number
    isCuResourceModalVisible: boolean
    dispatch: Function
    menuList: any
    parentForm: object
}

const CuResourceModal: React.FC<cuResourceModalProps> = (props) => {
    const { isCuResourceModalVisible, menuId, dispatch, menuList, parentForm } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('')
    const [menuTypevalue, setMenuTypeValue] = useState('C')

    useEffect(() => {
        dispatch({
            type: 'global/menuList'
        })
        //详情接口
        if (menuId) {
            ; (async () => {
                let res: any = await getResourceInfo({ menuId })
                if (res.code === 0) {
                    form.setFieldsValue({
                        ...res.data,
                        parentId: res.data.parentName
                    })
                    setValue(res.data.parentId + '_' + res.data.parentName)
                    setMenuTypeValue(res.data.menuType)
                }
            })()
        } else {
            form.resetFields()
        }
    }, [])
    // 生成子节点
    const getNode = (list) => {
        return (list || []).map((data) => {
            return (
                <TreeNode title={data.title} key={data.key} value={`${data.key}`}>
                    {
                        data.children && getNode(data.children)
                    }
                </TreeNode>
            );
        });
    }
    const onChange = (value, res) => {
        let str = value + '_' + res[0]
        setValue(str)
        form.setFieldsValue({
            parentId: res[0]
        })
    };
    return (
        <Modal
            title={(menuId ? '编辑' : '新增') + '菜单'}
            visible={isCuResourceModalVisible}
            width={800}
            confirmLoading={loading}
            onOk={() => {
                form.validateFields().then(async res => {
                    setLoading(true)
                    try {
                        if(res.path.length===1){
                           message.warn('菜单url格式输入错误')
                        }
                        if (menuId) {
                            res.menuId = menuId
                        }
                        await dispatch({
                            type: 'resource/addResource',
                            payload: {
                                parentForm,
                                postData:{
                                    ...res,
                                    parentId:res.menuType === 'M' ? 0 : value.split('_')[0],
                                }
                            }
                        })
                        setLoading(false)
                    } catch (err) {
                        setLoading(false)
                    }
                })
            }}
            onCancel={() => {
                dispatch({
                    type: 'resource/save',
                    payload: {
                        isCuResourceModalVisible: false
                    }
                })
            }}
        >
            <Form
                layout="horizontal"
                form={form}
                colon={false}
                autoComplete="off"
                initialValues={{
                    menuType: 'C',
                    visible: '0'
                }}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: '请选择类型'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="menuType"
                            label="类型"
                        >
                            <Radio.Group>
                                {[{ label: '目录', value: 'M' }, { label: '菜单', value: 'C' }, { label: '按钮', value: 'F'} ].map(({ value, label }) => {
                                    return (
                                        <Radio value={value} key={value} onChange={(e)=>{
                                            setMenuTypeValue(e.target.value)
                                        }}>
                                            {label}
                                        </Radio>
                                    )
                                })}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写菜单名称'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="menuName"
                            label="菜单名称"
                        >
                            <Input placeholder="菜单名称" maxLength={20} />
                        </Form.Item>
                    </Col>
                    {
                        menuTypevalue !== 'M'?  <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '请选择上级菜单',
                            },
                        ]} {...FORMITEM_LAYOUT} name="parentId" label="上级菜单" >
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                // value={value}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择"
                                allowClear
                                treeDefaultExpandAll
                                onChange={onChange}
                            >
                                {
                                    getNode(menuList)
                                }
                            </TreeSelect>
                        </Form.Item>
                    </Col>:null
                    }
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '请填写菜单url',
                            },
                        ]} {...FORMITEM_LAYOUT} name="path" label="菜单url" >
                            <Input placeholder="菜单url" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item {...FORMITEM_LAYOUT} name="perms" label="授权标识">
                            <Input placeholder="授权标识" disabled={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写排序号'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="orderNum"
                            label="排序号"
                        >
                            <Input placeholder="排序号" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: '请选择显示状态'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="visible"
                            label="显示状态"
                        >
                            <Radio.Group>
                                {[{ label: '显示', value: '0' }, { label: '隐藏', value: '1' }].map(({ value, label }) => {
                                    return (
                                        <Radio value={value} key={value}>
                                            {label}
                                        </Radio>
                                    )
                                })}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {/* <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写图标'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="icon"
                            label="图标"
                        >
                            <Input placeholder="图标" />
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </Modal>
    )
}

export default connect(({ resource, global }) => ({
    isCuResourceModalVisible: resource.isCuResourceModalVisible,
    menuList: global.menuList,
}))(CuResourceModal)
