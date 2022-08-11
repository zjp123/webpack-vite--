import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Radio, Modal, Tree, } from 'antd'
import { FORMITEM_LAYOUT, } from '@/utils/constants'
import { connect } from 'dva'
import { getRoleInfo, roleMenuTreeselect } from '@/api/system'
import {CustomTree} from "@/components"
interface cuRoleModalProps {
    roleId?: number
    isCuRoleModalVisible: boolean
    dispatch: Function
    menuList: any
    parentForm: object
}

const CuRoleModal: React.FC<cuRoleModalProps> = props => {
    const { isCuRoleModalVisible, roleId, dispatch, menuList, parentForm } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

    //详情接口
    useEffect(() => {
        dispatch({
            type: 'global/menuList'
        })
        if (roleId) {
            ; (async () => {
                let res: any = await getRoleInfo({ roleId })
                let resRole: any = await roleMenuTreeselect({ roleId })
                if (resRole.code === 0) {
                    form.setFieldsValue({
                        ...res.data
                    })
                }
                if (res.code === 0) {
                    if (resRole.code === 0) {
                        const array=resRole.checkedKeys&&resRole.checkedKeys.length&&resRole.checkedKeys.map((item)=> `${item}` )||[]
                        res.data.menuIds = array
                        setCheckedKeys(array)
                        console.log(array,'array')
                    }
                    form.setFieldsValue({
                        ...res.data,
                        deptCheckStrictly: res.data.deptCheckStrictly ? 1 : 0,
                        menuCheckStrictly: res.data.menuCheckStrictly ? 1 : 0
                    })
                }
            })()
        } else {
            form.resetFields()
        }
    }, [])

    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue)
        setAutoExpandParent(false)
    }

    const onCheck = (checkedKeysValue, e: any) => {
      console.log("checkedKeysValue", checkedKeysValue)
      console.log("e", e)
        // let arr = checkedKeysValue.concat(e.halfCheckedKeys)
        setAutoExpandParent(false)
        setCheckedKeys(checkedKeysValue)
        form.setFieldsValue({
            menuIds: checkedKeysValue
        })
    }

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        setSelectedKeys(selectedKeysValue)
    }
    return (
        <Modal
            title={(roleId ? '编辑' : '新增') + '角色'}
            visible={isCuRoleModalVisible}
            width={800}
            confirmLoading={loading}
            onOk={() => {
                form.validateFields().then(async res => {
                    setLoading(true)
                    try {
                        if (roleId) {
                            res.roleId = roleId
                        }
                        await dispatch({
                            type: 'role/addRole',
                            payload: {
                                parentForm,
                                res
                            }
                        })
                        // setLoading(false)
                    } catch (err) {
                        setLoading(false)
                    }
                })
            }}
            onCancel={() => {
                dispatch({
                    type: 'role/save',
                    payload: {
                        isCuRoleModalVisible: false
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
                    status: '1',
                    menuCheckStrictly: 1,
                    deptCheckStrictly: 1
                }}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: '请填写角色名称'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="roleName"
                            label="角色名称"
                        >
                            <Input placeholder="角色名称" maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item {...FORMITEM_LAYOUT} name="policeOfficerMark" label="角色类型">
                            <Radio.Group>
                                <Radio value={0} key={0}>
                                    警员
                                </Radio>
                                <Radio value={1} key={1}>
                                    非警员
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            {...FORMITEM_LAYOUT}
                            label="菜单组"
                            name="menuIds"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择菜单组'
                                }
                            ]}
                        >
                            <CustomTree
                              setCheckedKeys={setCheckedKeys}
                                onExpand={onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onCheck={onCheck}
                                checkedKeys={checkedKeys}
                                onSelect={onSelect}
                                selectedKeys={selectedKeys}
                                treeData={menuList}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    // required: true,
                                    message: '请填写备注'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="remark"
                            label="备注"
                        >
                                  <Input.TextArea showCount maxLength={100}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default connect(({ role, global }) => ({
    isCuRoleModalVisible: role.isCuRoleModalVisible,
    menuList: global.menuList
}))(CuRoleModal)
