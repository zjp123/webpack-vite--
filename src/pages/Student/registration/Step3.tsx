/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 15:28:05
 * @description: 体检信息预录入页
 */

import React, { useState } from "react"
import { connect } from "dva"
import Steps from "./Steps"
import { goto } from "@/utils"
import { saveHealthExaminationApi } from "@/api/student"
import { Form, Select, Row, Col, Input, Card, Divider, Checkbox } from "antd"
import "./index.less"
import {
  COLOR_VISION,
  FORMITEM_LAYOUT,
  HEARING,
  LEFT_LOWERLIMB, RIGHT_LOWERLIMB,
  UPPER_LIMB,
  VISUAL_DISTURBANCE,
} from "@/utils/constants"
import { HWHttpSignature } from "@/components"
import { openNotification } from "@/components/OpenNotification"

const {Item} = Form
const {Option} = Select

const Step3 = ({dispatch, match}) => {
  const [form] = Form.useForm()
  // 学员 id
  const id = match.params.id
  const [currentStep] = useState(2) // 当前步骤
  // 病理
  const [disease, setDisease] = useState()
  // 学员签名
  const [applySign, setApplySign] = useState()

  const saveHealthExamination = (data) => {
    saveHealthExaminationApi(data).then((res) => {
      if (res?.code === 0) {
        openNotification({message: "体检信息提交成功"}, "success")
        goto.push(`/student/vehicle/${id}`)
      }
    })
  }
  // 下一步
  const handle2NextStepViaPhysicalExamination = () => {
    // 保存体检信息 ==> f. 医院直接录入体检信息接口
    form.validateFields().then((formVal) => {
      let data = {
        id: id && parseInt(id),
        ...formVal,
        applySign,
        disease,
        //   写死的数据 // TODO 后期沟通需求 和 设计怎么修改
        trunkNeck: "1", // 躯干
        description: "良好", //
      }
      saveHealthExamination(data)
    })
  }

  const options = [
    {label: "气质型心脏病", value: 2},
    {label: "癫痫", value: 4},
    {label: "美尼尔氏症", value: 8},
    {label: "眩晕", value: 16},
    {label: "癔症", value: 32},
    {label: "震颤麻痹", value: 64},
    {label: "精神病", value: 128},
    {label: "痴呆", value: 256},
    {label: "影响肢体活动的神经系统疾病等妨碍安全驾驶疾病", value: 512},
    {label: "三年内有吸食、注射毒品行为或者解除强制隔离戒毒措施未满三年，或者长期服用依，赖性精神药品成瘾尚未戒除", value: 1024},
  ]

  function onChange(checkedValues) {
    let disease = checkedValues.reduce((prev, current) => {
      return prev + current
    }, 0)
    setDisease(disease)
  }

  return (
    <div className="registration_container" style={{background: "#FFFFFF"}}>
      <Steps currentStep={currentStep}/>
      <div className="replace_physical_examination">
        <Card className="first_card">
          <span className="physical_examination_title">体检信息预录入</span>
        </Card>
        <Card className="second_card">
          <div className="physical_examination_input">
            <div className="input_title">
              <span>*</span>
              本人如实申告是否具有以下疾病或情况
            </div>
            <div className="input_desc">以下申告为本人真实情况和真实意思表示，如果不属实本人自愿承担相应的法律责任。</div>
            <div className="input_form">
              <Form
                layout='horizontal'
                form={form}
                colon={false}
                autoComplete="off"
                initialValues={{}}
              >
                <Divider/>
                <Row>
                  <Checkbox.Group options={options} onChange={onChange}/>
                </Row>
                <Divider/>
                <div>
                  <Row>
                    <Col span={24}>
                      <div className="input_title">
                        <span>*</span>
                        体检信息
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={186}
                        name="height" label="身高">
                        <Input placeholder="请输入"/>
                      </Item>
                    </Col>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={0}
                        name="colorVision" label="红绿色盲">
                        <Select placeholder="请输入">
                          {COLOR_VISION.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={0}
                        name="visualDisturbance" label="单眼视力障碍">
                        <Select placeholder="请输入">
                          {VISUAL_DISTURBANCE.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={5.2}
                        name="leftVision" label="左眼视力">
                        <Input placeholder="请输入"/>
                      </Item>
                    </Col>
                    {/* <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{ span: 24 }}
                        name="sex" label="左眼矫正">
                        <Select placeholder="请输入" defaultValue={0}>
                          {SEX_STATIC.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>*/}
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={5.4}
                        name="rightVision" label="右眼视力">
                        <Input placeholder="请输入"/>
                      </Item>
                    </Col>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={0}
                        name="hearing" label="听力">
                        <Select placeholder="请输入">
                          {HEARING.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    {/* <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{ span: 24 }}
                        name="name" label="右眼矫正">
                        <Input placeholder="请输入" defaultValue="Gene">
                        </Input>
                      </Item>
                    </Col>*/}

                    {/* <Col span={6}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{ span: 24 }}
                        name="idcard" label="右耳听力">
                        <Input placeholder="请输入" defaultValue="130435199302010071">
                        </Input>
                      </Item>
                    </Col>*/}
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={0}
                        name="upperLimb" label="上肢">
                        <Select placeholder="请输入">
                          {UPPER_LIMB.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>

                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={0}
                        name="leftLowerLimb" label="左下肢">
                        <Select placeholder="请输入">
                          {LEFT_LOWERLIMB.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>
                    <Col span={8}>
                      <Item
                        {...FORMITEM_LAYOUT}
                        labelCol={{span: 24}}
                        initialValue={0}
                        name="rightLowerLimb" label="右下肢">
                        <Select placeholder="请输入">
                          {RIGHT_LOWERLIMB.map((item) => {
                            return <Option key={item.id} value={item.value}>{item.label}</Option>
                          })}
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                  <Row>
                    {/*<Col span={8}>*/}
                    {/*  <Item*/}
                    {/*    {...FORMITEM_LAYOUT}*/}
                    {/*    labelCol={{ span: 24 }}*/}
                    {/*    name="name" label="右下肢">*/}
                    {/*    <Input placeholder="请输入" defaultValue="Gene">*/}
                    {/*    </Input>*/}
                    {/*  </Item>*/}
                    {/*</Col>*/}
                    {/*<Col span={8}>*/}
                    {/*  <Item*/}
                    {/*    {...FORMITEM_LAYOUT}*/}
                    {/*    labelCol={{ span: 24 }}*/}
                    {/*    name="sex" label="运动功能障碍">*/}
                    {/*    <Select placeholder="请输入" defaultValue={0}>*/}
                    {/*      {SEX_STATIC.map((item) => {*/}
                    {/*        return <Option key={item.id} value={item.value}>{item.label}</Option>*/}
                    {/*      })}*/}
                    {/*    </Select>*/}
                    {/*  </Item>*/}
                    {/*</Col>*/}
                  </Row>
                </div>
              </Form>
            </div>
          </div>

          <Row>
            <div style={{margin: "0 auto"}} className="sign_pic">
              申请人签字... ...
              <HWHttpSignature width={700} height={120} getSignedResult={(imageBase64) => {
                setApplySign(imageBase64)
              }}></HWHttpSignature>
            </div>
          </Row>
        </Card>
        <div className="footer_content">
          <div className="footer_btn">
            <div className="footer_btn_left" onClick={() => {
              goto.go(-1)
            }}>
              返回上一步
            </div>
            <div className="footer_btn_right" onClick={handle2NextStepViaPhysicalExamination}>
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
})(Step3)

