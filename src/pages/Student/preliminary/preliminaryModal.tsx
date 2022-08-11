import React, { useState, useEffect } from 'react'
import { Form, Modal } from 'antd'
// import { FORMITEM_LAYOUT,  } from "@/utils/constants"
import { connect } from 'dva';
import { Images } from '@/components'
// import { getprelInfo,  } from '@/api/student'
// const { TextArea } = Input
interface cuRoleModalProps {
    id?: number
    isCuRoleModalVisible: boolean
    dispatch: Function
    menuList: any
}
const CuRoleModal: React.FC<cuRoleModalProps> = (props) => {
    const { isCuRoleModalVisible, id, dispatch,  } = props
    const [form] = Form.useForm()
    const [loading] = useState(false)
    const [res] = useState({})


    //详情接口
    useEffect(() => {
        if (id) {
            ; (async () => {
                // let res: any = await getprelInfo({ id })


            })()
        } else {
            form.resetFields()
        }
    }, [])




    return (
        <Modal
            title={(id ? '报名信息表' : '') + ''}
            visible={isCuRoleModalVisible}
            width={800}
            footer={null}
            confirmLoading={loading}

            onCancel={() => {
                dispatch({
                    type: 'preliminary/save',
                    payload: {
                        isCuRoleModalVisible: false
                    }
                })
            }}
        >

                <div className="flex-center-column">
                <Images src={res['singUpUrl']} enlarge={true} />
            </div>
        </Modal>
    )
}

export default connect(({ preliminary }) => ({
    isCuRoleModalVisible: preliminary.isCuRoleModalVisible,
    menuList: preliminary.menuList
}))(CuRoleModal)
