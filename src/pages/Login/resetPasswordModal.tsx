import React, { useState, useRef } from 'react'
import { Input, message, Modal } from 'antd'
import { connect } from 'dva';
import { toCode } from "@/utils"
import { firstLoginChangePwd } from '@/api/common'
interface ResetPasswordModalProps {
  isShowResetPassword: boolean
    dispatch: Function
    userId: number
    onCancel: Function
}
const ResetPasswordModal: React.FC<ResetPasswordModalProps> = (props) => {
    const { isShowResetPassword, dispatch, userId } = props
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<any>()
    const inputRefDetermine = useRef<any>()
    const inputOldRef = useRef<any>()
    return (
        <Modal
            title='您的密码为初始密码，请修改后重新登录'
            visible={isShowResetPassword}
            width={500}
            confirmLoading={loading}
            onOk={() => {
                const inputRefValue = inputRef.current.state.value;
                const inputRefDetermineVlaue = inputRefDetermine.current.state.value;
                if (!inputRefValue || !inputRefDetermineVlaue) {
                    message.warn('请补全输入框')
                    return
                } else if (inputRefValue !== inputRefDetermineVlaue) {
                    message.warn('两次秘密不一致,请重新输入')
                    return
                }

                firstLoginChangePwd({
                    userId,
                    password: toCode(inputRefValue),
                }).then((res) => {
                    if (res.code === 0) {
                        message.success('修改密码成功')
                        props.onCancel()
                        //todo 1.判断登录人是不是医生, 1.1是 完善信息  1.2不是 直接到首页
                    }
                })
            }}
            onCancel={() => {
                props.onCancel()
            }}
        >
            <React.Fragment>
                <p>请输入您的新密码</p>
                <Input.Password ref={inputRef} maxLength={20} />
                <p style={{ marginTop: '10px' }}>确认密码</p>
                <Input.Password ref={inputRefDetermine} maxLength={20} />
                <p style={{ marginTop: '10px' }}>用户密码长度8～26位,且必须包含英文字符、数字及特殊符号</p>
            </React.Fragment>
        </Modal>
    )
}

export default connect(({ global }) => ({}))(ResetPasswordModal)
