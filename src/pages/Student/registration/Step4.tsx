/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 15:32:53
 * @description: 机动车驾驶证申请表 页
 */

import React, { Fragment, useEffect, useState } from "react"
import { connect } from "dva"
import Steps from "./Steps"
import { Form, Select, Row, Col, Card, Divider, Radio, Space, Input } from "antd"
import { goto } from "@/utils"
import { saveVehicleLicenseApplyApi } from "@/api/student"
import "./index.less"
import { FORMITEM_LAYOUT } from "@/utils/constants"
import { HWHttpSignature } from "@/components"
import { getDict } from "@/utils/publicFunc"

const {Item} = Form
const {Option} = Select

const Step4 = ({match, dispatch, perdritypeList}) => {
  const [form] = Form.useForm()
  // 学员 id
  const id = match.params.id && parseInt(match.params.id)

  const [currentStep, setCurrentStep] = useState(3) // 当前步骤
  // ==== 申请类型 =====
  const [businessType, setBusinessType] = useState(0) // 机动车驾驶 申请表 申请类型
  const [apply, setApply] = useState(0) // 机动车驾驶 初领类型
  const [increase, setIncrease] = useState(0) // 机动车驾驶 增驾类型
  const [army, setArmy] = useState(0) // 机动车驾驶 持军警驾驶证申请
  const [abroad, setAbroad] = useState(0) // 机动车驾驶 持境外驾驶证申请
  // ==== 申请方式 =====
  const [way, setWay] = useState(1) // 机动车驾驶 申请方式
  const [signUrl, setSignUrl] = useState("")

  useEffect(() => {
    getDict(dispatch, "perdritype", {})
  }, [])
  // 机动车驾驶证申请表保存  ==> 保存报名附加信息接口
  const saveVehicleLicenseApply = (data) => {
    saveVehicleLicenseApplyApi(data).then((res) => {
      if (res?.code === 0) {
        // openNotification({message: "机动车驾驶证申请表录入成功"})
        // 去成功页
        goto.push(`/student/result/${0}`)
      } else {
        // 去失败结果页
        goto.push(`/student/result/${1}`)
      }
    })
  }

  // 保存 下一步
  const handle2NextStepViaVehicleLicense = () => {
    form.validateFields().then((res) => {
      const data = {
        id,
        businessType,
        abroad,
        army,
        increase,
        apply,
        way,
        signUrl,
        ...res,
      }
      saveVehicleLicenseApply(data)
    })
  }

  // 申请类型 change
  const handleBusinessTypeChange = e => {
    setBusinessType(e.target.value)
  }

  // 申请方式 change
  const handleWayChange = e => {
    setWay(e.target.value)
  }

  // 申请类型
  const renderDifferentBusinessTypeContent = () => {
    // 初次申领
    const renderBusinessType0 = () => {
      const onChange = e => {
        setApply(e.target.value)
      }
      return (
        <Radio.Group onChange={onChange} value={apply}>
          <Space direction="vertical">
            <Radio value={0}>驾校培训</Radio>
            <Radio value={1}>有驾驶经历</Radio>
            <Radio value={2}>自学直考</Radio>
          </Space>
        </Radio.Group>)
    }

    // 增驾准驾类型
    const renderBusinessType1 = () => {
      const onChange = e => {
        setIncrease(e.target.value)
      }
      return (
        <Radio.Group onChange={onChange} value={increase}>
          <Space direction="vertical">
            <Radio value={0}>驾校培训</Radio>
            <Radio value={1}>有驾驶经历</Radio>
            <Radio value={2}>最高准驾车型注销</Radio>
            <Radio value={3}>自学直考</Radio>
          </Space>
        </Radio.Group>
      )
    }
    // 持军警驾驶证申领
    const renderBusinessType2 = () => {
      const onChange = e => {
        setArmy(e.target.value)
      }
      return (
        <Radio.Group onChange={onChange} value={army}>
          <Space direction="vertical">
            <Radio value={0}>军队驾驶证</Radio>
            <Radio value={1}>武警驾驶证</Radio>
          </Space>
        </Radio.Group>
      )
    }
    const renderBusinessType3 = () => {
      const onChange = e => {
        setAbroad(e.target.value)
      }
      return (
        <Radio.Group onChange={onChange} value={abroad}>
          <Space direction="vertical">
            <Radio value={0}>香港驾驶证</Radio>
            <Radio value={1}>澳门驾驶证</Radio>
            <Radio value={2}>台湾驾驶证</Radio>
            <Radio value={3}>外国驾驶证</Radio>
          </Space>
        </Radio.Group>
      )
    }
    const contentArr = [renderBusinessType0, renderBusinessType1, renderBusinessType2, renderBusinessType3]

    return (
      <Fragment>
        {
          contentArr.find((item, index) => index === businessType)
            ? contentArr.find((item, index) => index === businessType)()
            : null
        }
      </Fragment>
    )
  }

  // 申请方式
  const renderDifferentApplyWay = () => {
    // 本人申请
    const renderWay0 = () => {
      return (
        <div style={{}} className="sign_pic">
          <div className="input_title">
            <span>*</span>
            申请人签字......
          </div>
          <div style={{marginTop: "5px"}}>
            <HWHttpSignature width={700} height={120} getSignedResult={(imageBase64) => {
              setSignUrl(imageBase64)
            }}></HWHttpSignature>
          </div>
        </div>
      )
    }
    // 监护人申请
    const renderWay1 = () => {
      return (
        <div>
          <Divider/>
          <Row>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianName" label="监护人姓名">
                <Input placeholder="请输入监护人姓名"/>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianPhone" label="联系电话">
                <Input placeholder="请输入联系电话"/>
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianIdcard" label="身份证号码">
                <Input placeholder="请输入身份证号码"/>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianAddress" label="联系地址">
                <Input placeholder="请输入联系地址"/>
              </Item>
            </Col>
          </Row>
          <Divider/>
          <div style={{}} className="sign_pic">
            <div className="input_title">
              <span>*</span>
              监护人签字......
            </div>
            <div style={{marginTop: "5px"}}>
              <HWHttpSignature width={700} height={120} getSignedResult={(imageBase64) => {
                setSignUrl(imageBase64)
              }}></HWHttpSignature>
            </div>
          </div>
        </div>
      )
    }

    // 委托人代理申请
    const renderWay2 = () => {
      return (
        <div>
          <Divider/>
          <Row>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianName" label="监护人姓名">
                <Input placeholder="请输入监护人姓名"/>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianPhone" label="联系电话">
                <Input placeholder="请输入联系电话"/>
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianIdcard" label="身份证号码">
                <Input placeholder="请输入身份证号码"/>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                {...FORMITEM_LAYOUT}
                labelCol={{span: 6}}
                name="guardianAddress" label="联系地址">
                <Input placeholder="请输入联系地址"/>
              </Item>
            </Col>
          </Row>
          <Divider/>
          <div style={{}} className="sign_pic">
            <div className="input_title">
              <span>*</span>
              委托人签字......
            </div>
            <div style={{marginTop: "5px"}}>
              <HWHttpSignature width={700} height={120} getSignedResult={(imageBase64) => {
                setSignUrl(imageBase64)
              }}></HWHttpSignature>
            </div>
          </div>
        </div>
      )
    }
    // 渲染不同申请方式
    const arrWay = [renderWay0, renderWay1, renderWay2]

    return (
      <Fragment>
        {
          arrWay.find((item, index) => index === way)
            ? arrWay.find((item, index) => index === way)()
            : null
        }
      </Fragment>
    )
  }

  return (
    <div className="registration_container" style={{background: "#FFFFFF"}}>
      <Steps currentStep={currentStep}/>
      <div className="vehicle_container">
        <Card className="first_card">
          <span className="physical_examination_title">机动车驾驶证申请表</span>
        </Card>
        <Card className="second_card">
          <div className="vehicle_input">
            <div className="input_title">
              <span>*</span>
              申请人业务种类
            </div>
            <div className="input_form">
              <Form layout='horizontal' form={form} colon={false} autoComplete="off" initialValues={{}}>
                <Row>
                  <Col span={12}>
                    <Item
                      {...FORMITEM_LAYOUT}
                      labelCol={{span: 6}}
                      initialValue="C1"
                      name="perdritype" label="申请准驾车型">
                      <Select placeholder="请输入">
                        {perdritypeList.map((item) => {
                          return <Option key={item.id} value={item.value}>{item.label}</Option>
                        })}
                      </Select>
                    </Item>
                  </Col>
                </Row>
                <Divider/>
                <Row>
                  <Col span={24}>
                    <div className="input_title">
                      <span>*</span>
                      申请类型
                    </div>
                  </Col>
                  <Radio.Group onChange={handleBusinessTypeChange} value={businessType}>
                    <Space direction="horizontal">
                      <Radio value={0}>初次申请</Radio>
                      <Radio value={1}>增驾准驾车型</Radio>
                      <Radio value={2}>持军警驾驶证申领</Radio>
                      <Radio value={3}>持境外驾驶证申领</Radio>
                    </Space>
                  </Radio.Group>
                </Row>
                <Divider/>
                <Row>
                  {/* 不同报名方式 => 渲染不同内容*/}
                  {renderDifferentBusinessTypeContent()}
                </Row>
                <Divider/>
                <Row>
                  <Col span={24}>
                    <div className="input_title">
                      <span>*</span>
                      申请方式
                    </div>
                  </Col>
                  <Col span={24}>
                    <div>
                      <Radio.Group onChange={handleWayChange} value={way}>
                        <Space direction="horizontal">
                          <Radio value={0}>本人申请</Radio>
                          <Radio value={1}>监护人申请</Radio>
                          <Radio value={2}>委托人代理申请</Radio>
                        </Space>
                      </Radio.Group>
                    </div>
                  </Col>
                  <Col span={24}>
                    {renderDifferentApplyWay()}
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Card>
      </div>
      <div className="footer_content">
        <div className="footer_btn">
          <div className="footer_btn_left" onClick={() => {
            goto.go(-1)
          }}>
            返回上一步
          </div>
          <div className="footer_btn_right" onClick={handle2NextStepViaVehicleLicense}>
            信息确认无误, 下一步
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
    perdritypeList: global.perdritypeList,
  }
})(Step4)

