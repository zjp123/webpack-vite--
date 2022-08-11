import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Modal, Select } from "antd"
import { FORMITEM_LAYOUT, } from "@/utils/constants"
import { connect } from 'dva';
import { gettimingInfo, } from '@/api/system'
interface cuRoleModalProps {
    jobId?: number
    isCuRoleModalVisible: boolean
    dispatch: Function
    menuList: any
    jobGroupList: any
    parentForm: object
}
const CuRoleModal: React.FC<cuRoleModalProps> = (props) => {
    const { isCuRoleModalVisible, jobId, dispatch, jobGroupList, parentForm } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    //详情接口
    useEffect(() => {
        if (jobId) {
            ; (async () => {
                let res: any = await gettimingInfo({ jobId })
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
            title={(jobId ? '修改定时任务' : '新增定时任务')}
            visible={isCuRoleModalVisible}
            width={800}
            destroyOnClose
            confirmLoading={loading}
            onOk={() => {
                form.validateFields().then(async (res) => {
                    setLoading(true)
                    try {
                        if (jobId) {
                            res.jobId = jobId
                        }
                        await dispatch({
                            type: 'timingtask/addtimingtask',
                            payload: {
                                parentForm,
                                postData: {
                                    ...res,
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
                    type: 'timingtask/save',
                    payload: {
                        isCuRoleModalVisible: false
                    }
                })
            }}
        >
            <Form
                layout='horizontal'
                form={form}
                colon={false}
                autoComplete="off"
            >
                <Row>
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '任务名称',
                            },
                        ]} {...FORMITEM_LAYOUT} name="jobName" label="任务名称" >
                            <Input placeholder="任务名称" maxLength={20} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '任务分组',
                            },
                        ]} {...FORMITEM_LAYOUT} name="jobGroup" label="任务分组" >
                            <Select placeholder="请选择任务分组" allowClear>
                                {jobGroupList.map(({ value, label }) => {
                                    return (
                                        <Select.Option value={value} key={value}>
                                            {label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '调用目标字符串',
                            },
                        ]} {...FORMITEM_LAYOUT} name="invokeTarget" label="调用目标字符串" >
                            <Input placeholder="调用目标字符串" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: 'cron表达式',
                            },
                        ]} {...FORMITEM_LAYOUT} name="cronExpression" label="cron表达式" >
                            <Input placeholder="cron表达式" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}
export default connect(({ timingtask }) => ({
    isCuRoleModalVisible: timingtask.isCuRoleModalVisible,
    menuList: timingtask.menuList
}))(CuRoleModal)
