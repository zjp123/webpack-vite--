/**
 * 新增身份证信息
 */
import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Modal, Radio, DatePicker, Select } from 'antd'
import { FORMITEM_LAYOUT, ID_REGEXP, SEX_NUMBER_ENUM, NAME_REGEXP } from '@/utils/constants'
import { connect } from 'dva'
import { getDict } from '@/utils/publicFunc'

const { Item } = Form

const AddIDNo = props => {
  const { dispatch, isShowWriting, nationList } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    getDict(dispatch, 'nation')
  }, [])

  // 确认身份证信息
  const handleOnOk = () => {
    form.validateFields().then(async res => {
      props?.getInputInfo(res)
      handleOnCancel()
    })
  }

  // 取消弹框
  const handleOnCancel = ()=>{
    dispatch({
      type: 'physical/save',
      payload: {
        isShowWriting: false
      }
    })
  }

  return (
    <Modal
      title="输入考生身份证信息 "
      visible={isShowWriting}
      width="70%"
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={handleOnCancel}
    >
      <Form layout="horizontal" form={form} colon={false} autoComplete="off" initialValues={{}}>
        <Row>
          <Col span={12}>
            <Item
              label="姓名"
              name="name"
              labelCol={12}
              {...FORMITEM_LAYOUT}
              rules={[{ required: true, message: '请输入正确姓名' }, { pattern: NAME_REGEXP, message: '姓名要求最少2个汉字；复姓支持“·”隔开，如：爱新觉罗·弘业' }]}
            >
              <Input placeholder="请输入姓名" allowClear />
            </Item>
          </Col>
          <Col span={12}>
            <Item rules={[{ required: true, message: '请选择性别' }]} {...FORMITEM_LAYOUT} name="sex" label="性别">
              <Radio.Group>
                {SEX_NUMBER_ENUM.map(({ value, sex }) => {
                  return (
                    <Radio value={value} key={value}>
                      {sex}
                    </Radio>
                  )
                })}
              </Radio.Group>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item {...FORMITEM_LAYOUT} rules={[{ required: true, message: '出生日期' }]} label="出生日期" name="birthday">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder="请选择出生日期" />
            </Item>
          </Col>
          <Col span={12}>
            <Item {...FORMITEM_LAYOUT} rules={[{ required: true, message: '请输入身份证号' }, { pattern: ID_REGEXP, message: '请输入合法身份证号码' }]} label="身份证号" name="idcard">
              <Input placeholder="请输入身份证号" maxLength={18} allowClear />
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item {...FORMITEM_LAYOUT} rules={[{ required: true, message: '签发机关' }]} label="签发机关" name="idCardIssuingAuthority">
              <Input placeholder="请输入发证机关" maxLength={200} allowClear />
            </Item>
          </Col>
          <Col span={12}>
            <Item {...FORMITEM_LAYOUT} rules={[{ required: true, message: '民族' }]} label="民族" name="ethnic">
              <Select placeholder="请选择民族" allowClear>
                {nationList.map(({ value, label }) => {
                  return (
                    <Select.Option value={value} key={value}>
                      {label}
                    </Select.Option>
                  )
                })}
              </Select>
            </Item>
          </Col>
          <Col span={12}>
            <Item {...FORMITEM_LAYOUT} rules={[{ required: true, message: '失效日期' }]} label="失效日期" name="idCardExpirationDate">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder="请选择失效日期" />
            </Item>
          </Col>
          <Col span={12}>
            <Item {...FORMITEM_LAYOUT} rules={[{ required: true, message: '请输入住址' }]} label="住址" name="registerAddress">
              <Input.TextArea placeholder="请输入住址" autoSize={{minRows:2, maxRows:4}} maxLength={200} allowClear />
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ physical, global }) => ({
  isShowWriting: physical.isShowWriting,
  nationList: global.nationList
}))(AddIDNo)
