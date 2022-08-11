import React, {  useEffect } from 'react'
import { Form,  Modal } from 'antd'
import { connect } from 'dva';
import { getInformationInfo } from '@/api/electronic'
interface checkInformationModalProps {
    id?: number,
    isCheckInformationModalVisible: boolean,
    dispatch: Function
}
const CheckInformationModal: React.FC<checkInformationModalProps> = (props) => {
    const {  id, dispatch } = props
    const [form] = Form.useForm()
    //详情接口
    useEffect(() => {
        if (id) {
            ; (async () => {
                let res: any = await getInformationInfo({ id })
                if (res.code === 0) {
                    form.setFieldsValue(res.data)
                }
            })()
        } else {
            form.resetFields()
        }
    }, [])

    return (
        <Modal
            title='机动车驾驶证业务清单'
            visible={true}
            width={800}
            onOk={() => {
            }}
            onCancel={() => {
                dispatch({
                    type: 'information/save',
                    payload: {
                        isCheckInformationModalVisible: false
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
            </Form>
        </Modal>
    )
}

export default connect(({ information }) => ({
    isCheckInformationModalVisible: information.isCheckInformationModalVisible
}))(CheckInformationModal)