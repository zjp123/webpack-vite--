import React, { useState, useRef } from 'react'
import { Input, message, Modal, Form, Col } from 'antd'
import { connect } from 'dva'
import { changePwd } from '@/api/common'
import { toCode } from '@/utils'
import { FORMITEM_LAYOUT_NOWRAP } from '@/utils/constants'
const { Item } = Form
interface ResetPasswordModalPropsProps {
  isCuresetPasswordlVisible: boolean
  dispatch: Function
  userName: string
  userId: number
  onCancel: Function
}

const ResetPasswordModalProps: React.FC<ResetPasswordModalPropsProps> = props => {
  const { isCuresetPasswordlVisible, dispatch, userName, userId } = props
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<any>()    
  const inputRefDetermine = useRef<any>()
  const inputOldRef = useRef<any>()
  const [form] = Form.useForm()

  return (
    <Modal
      title="修改密码"
      visible={isCuresetPasswordlVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        const inputRefValue = inputRef.current.state.value
        const inputRefDetermineVlaue = inputRefDetermine.current.state.value
        const inputOldRefVlaue = inputOldRef.current.state.value
        if (!inputRefValue || !inputRefDetermineVlaue) {
          message.warn('请补全输入框')
          return
        } else if (inputRefValue !== inputRefDetermineVlaue) {
          message.warn('两次秘密不一致,请重新输入')
          return
        }
        changePwd({
          userId,
          password: toCode(inputRefValue),
          params: {
            oldPassword: toCode(inputOldRefVlaue)
          }
        }).then(res => {
          if (res.code === 0) {
            message.success('修改密码成功')
            props.onCancel()
          }
        })
      }}
      onCancel={() => {
        props.onCancel()
      }}
    >   
      <Form layout="horizontal" form={form} className="formant" colon={false} autoComplete="off" style={{ width: '750px' }}>
        <Col span={14}>
          <Item {...FORMITEM_LAYOUT_NOWRAP} rules={[{ required: true, message: '请输入密码' }]} name="oldpassword" label={`请输入${userName}的旧密码`}>
            <Input.Password ref={inputOldRef} maxLength={20} placeholder='请输入密码' />
          </Item>
        </Col>
        <Col span={14}>
          <Item {...FORMITEM_LAYOUT_NOWRAP} rules={[{ required: true, message: '请输入密码' }]} name="newpassword" label={`请输入${userName}的新密码`}>
            <Input.Password ref={inputRef} maxLength={20} placeholder='请输入密码'/>
          </Item>
        </Col>
        <Col span={12}>
          <Item {...FORMITEM_LAYOUT_NOWRAP} rules={[{ required: true, message: '请输入密码' }]} name="confirm" label="确认密码">
            <Input.Password ref={inputRefDetermine} maxLength={20} placeholder='请确认密码' />
          </Item>
        </Col>
      </Form>
      <p style={{ marginTop: '10px' ,textAlign:'center'}}>用户密码长度8～26位,且必须包含英文字符、数字及特殊符号</p>
    </Modal>
  )
}

export default connect(({ global }) => ({}))(ResetPasswordModalProps)
