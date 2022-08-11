/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 14:41:06
 * @description: 身份证照片采集 ---> 身份证采集的信息
 */

import React, {  useEffect, useState } from "react"
import { connect } from "dva"
import {  Images } from "@/components"
import Steps from "./Steps"
import { goto } from "@/utils"
import { Form, Select, Row, Col, Input, DatePicker } from "antd"
import "./index.less"
import { FORMITEM_LAYOUT, SEX_NUMBER_ENUM } from "@/utils/constants"
import { getSessionItem, setSessionItem } from "@/utils/publicFunc"
import { getRegistrationInfoApi, saveRegistrationApi } from "@/api/student"
import { openNotification } from "@/components/OpenNotification"

const {Item} = Form
const {Option} = Select

const Step1 = ({match}) => {
  const [form] = Form.useForm()

  const idCardArr = getSessionItem("registration/idCardUrlArr") // 身份证url
  const idIdentificationInfo = getSessionItem("registration/idIdentificationInfo") //识别结果

  // 获取预录入信息接口 返回 id, 用于验证之前是否有报名
  const [idB, setIdB] = useState()
  // 预录入基础信息接口 返回 id, 用于验证是否有证件照
  const [idC, setIdC] = useState()

  const id = match.params.id && parseInt(match.params.id)
  useEffect(() => {
    getRegistrationInfo()
    setFormValue()
  }, [])

  // 获取预录入信息 验证学员是否之前有报名信息
  const getRegistrationInfo = () => {
    getRegistrationInfoApi({idcard: idIdentificationInfo?.face?.idnum}).then((res) => {
      if (res?.code === 0) {
        setIdB(res?.data?.id)
      }
    })
  }

  // 设置身份证识别的值
  const setFormValue = () => {

    // const data = {
    //   name: idIdentificationInfo?.face?.name,
    //   sex: idIdentificationInfo?.face?.gender,
    //   idcard: idIdentificationInfo?.face?.idnum,
    //   idCardExpirationDate: idIdentificationInfo?.back?.time,
    //   ethnic: idIdentificationInfo?.face?.nation,
    //   birthday: idIdentificationInfo?.face?.birth,
    //   registerAddress: idIdentificationInfo?.face?.addr,
    //   idCardIssuingAuthority: idIdentificationInfo?.back?.location,
    // }
    const data = {
      id: idB,
      name: "张盈棒",
      sex: 0,
      idcard: 411381200404298439,
      // idCardExpirationDate: "2024.12.02",
      ethnic: "汉",
      // birthday: "2004-04-29",
      registerAddress: "河南省邓州市九龙镇后王村吴楼8 6 号",
      idCardIssuingAuthority: "邓州市公安局",
    }
    form.setFieldsValue(data)
  }


  // 保存 下一步
  const handleClick2IDCardInfo = () => {
    form.validateFields().then((res) => {
      const formVal = { // TODO 写死的字段 后续需要跟设计和需求商量如何更改
        ...res,
        idcardName: "身份证",
        nationality: "中国",
        perdritype: "C1",
        businessType: 0,
      }
      goto.push(`/student/photo-input/${id}`)
      // b.预录入基础信息接口
      saveRegistrationApi(formVal).then((res) => {
        if (res?.code === 0) {
          openNotification({message: "录入成功... ..."}, "success")
          setIdC(res?.data?.id)
          goto.push(`/student/photo-input/${res?.data?.id}`)
        }
      })
    })
  }
  return (
    <div className="registration_container" style={{background: "#FFFFFF"}}>
      <div className="id_info_container">
        { /* 头部进度条*/}
        <Steps currentStep={0}/>
        <div className="id_card_pic">
          <div className="id_front_side">
            <Images width={300} height={225} src={idCardArr && idCardArr[0] && idCardArr[0].url}/>
          </div>
          <div className="id_reverse_side">
            <Images width={300} height={225} src={idCardArr && idCardArr[1] && idCardArr[1].url}/>
          </div>
        </div>
        <div className="form_info">
          <Form
            layout='horizontal'
            form={form}
            colon={false}
            autoComplete="off"
            initialValues={{}}
          >
            <Row>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请输入姓名"}]}
                  name="name" label="姓名123">
                  <Input placeholder="请输入"/>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请选择性别"}]}
                  name="sex" label="性别">
                  <Select placeholder="请选择">
                    {SEX_NUMBER_ENUM.map((item) => {
                      return <Option key={item.id} value={item.value}>{item.label}</Option>
                    })}
                  </Select>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请输入身份证号码"}]}
                  name="idcard" label="身份证号码">
                  <Input placeholder="请输入">
                  </Input>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请输入身份证失效日期"}]}
                  name="idCardExpirationDate" label="身份证失效日期">
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" allowClear placeholder="身份证失效日期"/>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  name="ethnic" label="民族">
                  <Input placeholder="请输入"/>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请输入出生日期"}]}
                  name="birthday" label="出生日期">
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" allowClear placeholder="请输入"/>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请输入地址"}]}
                  name="registerAddress" label="地址">
                  <Input placeholder="请输入">
                  </Input>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  rules={[{required: true, message: "请输入发证机关"}]}
                  name="idCardIssuingAuthority" label="发证机关">
                  <Input placeholder="请输入"/>
                </Item>
              </Col>

            </Row>
            <Row>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  initialValue="15369666842"
                  rules={[{required: true, message: "请输入发证机关"}]}
                  name="mobilePhone" label="学员手机号">
                  <Input placeholder="请输入"/>
                </Item>
              </Col>
              {/*<Col span={6}>*/}
              {/*  <Item*/}
              {/*    {...FORMITEM_LAYOUT}*/}
              {/*    labelCol={{span: 24}}*/}
              {/*    initialValue="010-8801627"*/}
              {/*    name="landline" label="固定电话">*/}
              {/*    <Input placeholder="请输入"/>*/}
              {/*  </Item>*/}
              {/*</Col>*/}
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  initialValue="Genejob@164.com"
                  rules={[{required: true, message: "请输入电子邮箱"}]}
                  name="eMail" label="电子邮箱">
                  <Input placeholder="请输入"/>
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...FORMITEM_LAYOUT}
                  labelCol={{span: 24}}
                  initialValue="河北省邯郸市曲周县曲周镇"
                  name="mailingAddress" label="邮寄地址">
                  <Input placeholder="请输入"/>
                </Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="footer_content">
          <div className="footer_btn">
            <div className="footer_btn_left" onClick={() => {
              goto.go(-1)
            }}>
              返回上一步
            </div>
            <div className="footer_btn_right" onClick={handleClick2IDCardInfo}>
              信息确认无误, 下一步
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default connect(({registration, global}) => {
  return {
    isShowShootIDCard: registration.isShowShootIDCard,
    isShowInputForm: registration.isShowInputForm,
  }
})(Step1)

