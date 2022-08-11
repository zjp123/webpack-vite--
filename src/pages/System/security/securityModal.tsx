import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Modal,  } from 'antd'
import { FORMITEM_LAYOUT } from '@/utils/constants'
import { connect } from 'dva'
import { getpolicysmodifiedInfo } from '@/api/system'
import { rulesNumber } from '@/utils'
interface DepartmentProps {
    id?: number
    isDepartmentVisible: boolean
    dispatch: Function
}
const Security: React.FC<DepartmentProps> = props => {
    const { isDepartmentVisible, id, dispatch,  } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    //详情接口
    useEffect(() => {
        if (id) {
            ;(async () => {
                let res: any = await getpolicysmodifiedInfo({ id })
                if (res.code === 0) {
                    form.setFieldsValue({
                        ...res.data
                    })
                }
            })()
        } else {
            form.resetFields()
        }
    }, [])

    return (
        <Modal
            title={(id ? '修改安全策略' : '') + ''}
            visible={isDepartmentVisible}
            width={800}
            confirmLoading={loading}
            onOk={() => {
                form.validateFields().then(async res => {
                    setLoading(true)
                    try {
                        if (id) {
                            res.id = id
                        }
                        await dispatch({
                            type: 'security/addDepartment',
                            payload: res
                        })
                        setLoading(false)
                    } catch (err) {
                        setLoading(false)
                    }
                })
            }}
            onCancel={() => {
                dispatch({
                    type: 'security/save',
                    payload: {
                        isDepartmentVisible: false
                    }
                })
            }}
        >
            <Form layout="horizontal" form={form} colon={false}>
                <Row>
                    {
                        <Col span={24}>
                            <Form.Item
                                rules={[
                                    {
                                        message: '参数名称'
                                    }
                                ]}
                                {...FORMITEM_LAYOUT}
                                name="configName"
                                label="参数名称"
                            >
                                <Input placeholder="参数名称" disabled />
                            </Form.Item>
                        </Col>
                    }
                    <Col span={24}>
                        <Form.Item
                            rules={[
                                {
                                    message: '参数键值'
                                }
                            ]}
                            {...FORMITEM_LAYOUT}
                            name="configKey"
                            label="参数键值"
                        >
                            <Input placeholder="参数键值" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={rulesNumber()} {...FORMITEM_LAYOUT} name="configValue" label="参数值">
                            <Input placeholder="参数值" maxLength={6} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item {...FORMITEM_LAYOUT} name="remark" label="备注">
                            <Input placeholder="备注" disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default connect(({ security, global }) => ({
    isDepartmentVisible: security.isDepartmentVisible,
}))(Security)
