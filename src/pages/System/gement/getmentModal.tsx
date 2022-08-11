import React, { useState,  } from 'react'
import { Form, Modal,  } from 'antd'
import { connect } from 'dva';
interface DepartmentProps {
    id?: number,
    isCuRoleModalVisible: boolean,
    dispatch: Function,
}
const Gement: React.FC<DepartmentProps> = (props) => {
    const { isCuRoleModalVisible, id, dispatch,  } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    return (
        <Modal
        footer={null}
            title={(id ? '' : '更多信息') + ''}
            visible={isCuRoleModalVisible}
            width={800}
            confirmLoading={loading}
            onOk={() => {
                form.validateFields().then(async (res) => {
                    setLoading(true)
                    try {
                        if (id) {
                            res.id = id
                        }
                        setLoading(false)
                    } catch (err) {
                        setLoading(false)
                    }
                })
            }}
            onCancel={() => {
                dispatch({
                    type: 'gement/save',
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
                initialValues={{
                    status: '0'
                }}
            >
            </Form>
        </Modal>
    )
}

export default connect(({ gement }) => ({
    isCuRoleModalVisible: gement.isCuRoleModalVisible,
}))(Gement)