import React, { useState, useEffect } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'dva'
import { Images } from '@/components'
import { getComparisonInfo } from '@/api/electronic'

interface CuInforMatoneModalProps {
    id?: number
    isCuInformationModalVisible: boolean
    infoCardInfo?:any
    dispatch: Function
    imgsrcInfo: any
}
const CuInforMatoneModal: React.FC<CuInforMatoneModalProps> = props => {
    const { isCuInformationModalVisible, id, dispatch, imgsrcInfo,infoCardInfo } = props
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    //详情接口
    useEffect(() => {
        if (id) {
            ;(async () => {
                let res: any = await getComparisonInfo({ id })
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
            visible={isCuInformationModalVisible}
                     title={`${infoCardInfo?.name} - ${imgsrcInfo.archivesTypeName}`}
            confirmLoading={loading}
            footer={null}
            onOk={() => {}}
            onCancel={() => {
                dispatch({
                    type: 'information/save',
                    payload: {
                        isCuInformationModalVisible: false
                    }
                })
            }}
        >
            <section className="flex-center">
                <Images src={imgsrcInfo.archivesPdfPhoto} width={300} />
            </section>
        </Modal>
    )
}
export default connect(({ information }) => ({
    isCuInformationModalVisible: information.isCuInformationModalVisible
}))(CuInforMatoneModal)
