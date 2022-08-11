import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Radio, Modal, InputNumber, Select, DatePicker, message } from 'antd'
import { FORMITEM_LAYOUT, STATUS_STRING } from "@/utils/constants"
import { connect } from 'dva';
import { getExamCarInfo } from '@/api/drivingTest'
import { rulesThreeNumber, rulesFiv } from '@/utils'
import moment from 'moment'
import {getDict} from "@/utils/publicFunc";

const CuVehicleInformation = ({ id, dispatch, examSiteList, searchVehicleInformationForm, isCuVehicleInformationVisible, perdritypeList, examSiteTypeList, carBrandList, certifyingAuthorityList, parentForm }) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(undefined)

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "examSite", { keyword: val })
  }

  // 筛选考场信息
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  //详情接口
    useEffect(() => {
        if (id) {
            ; (async () => {
                let res: any = await getExamCarInfo({ id })
                if (res.code === 0) {
                    form.setFieldsValue({
                        ...res.data,
                        fRegisterTime: res.data?.fRegisterTime && moment(res.data?.fRegisterTime),
                        expiredTime: res.data?.expiredTime && moment(res.data?.expiredTime),
                        licenseNum: res.data?.licenseNum.substring(2)
                    })
                }
            })()
        } else {
            form.resetFields()
        }
    }, [])

    return (
        <Modal
            title={(id ? '编辑' : '新增') + '考试车辆'}
            visible={isCuVehicleInformationVisible}
            width={800}
            confirmLoading={loading}
            onOk={() => {
                form.validateFields().then(async (res) => {
                    if (`${res.carNum}` === '000') {
                        message.warn('车辆编码不能为000')
                        return
                    }

                    if ( res?.expiredTime&&res?.fRegisterTime && moment(res?.fRegisterTime).format('x') > moment(res?.expiredTime).format('x')) {
                        message.warn('报废日期不能在登记日期之前');
                        return
                    }

                    setLoading(true)
                    try {
                        if (id) {
                            res.id = id
                        }
                        await dispatch({
                            type: 'vehicleInformation/addExamCar',
                            payload: {
                                parentForm,
                                postData: {
                                    ...res,
                                    licenseNum: certifyingAuthorityList[0] && certifyingAuthorityList[0].code + res.licenseNum,
                                    certifyingAuthority: certifyingAuthorityList[0] && certifyingAuthorityList[0].code,
                                    fRegisterTime: res?.fRegisterTime ? moment(res?.fRegisterTime).format("YYYY-MM-DD") : undefined,
                                    expiredTime: res?.expiredTime ? moment(res?.expiredTime).format("YYYY-MM-DD") : undefined
                                }
                            }
                        })
                        setLoading(false)
                    } catch (err) {
                        setLoading(false)
                    }
                })
            }}
            onCancel={() => {
                dispatch({
                    type: 'vehicleInformation/save',
                    payload: {
                        isCuVehicleInformationVisible: false
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
                    carStatus: '1',
                    perdritype: 'C1',
                    type: 'K30',
                    brand: '1'
                }}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item rules={rulesFiv(true)} {...FORMITEM_LAYOUT} name="licenseNum" label="车牌号码" >
                            <Input placeholder="车牌号码" addonBefore={certifyingAuthorityList[0] && certifyingAuthorityList[0].code} maxLength={5} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={rulesThreeNumber(true)} {...FORMITEM_LAYOUT} name="carNum" label="车辆编号" >
                            <Input placeholder="车辆编号" maxLength={3} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '请填写所属考场',
                            },
                        ]} {...FORMITEM_LAYOUT} name="examCode" label="所属考场" >
                          <Select
                            showSearch allowClear defaultActiveFirstOption={false} placeholder="请输入考场名称"
                            onSearch={handleSearchExam}
                            filterOption={handleFilterOption}
                          >
                            {examSiteTypeList?.map(({ value, label }) => {
                              return <Select.Option value={value} key={value}>{label}</Select.Option>
                            })
                            }
                          </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '请填写准驾车型',
                            },
                        ]} {...FORMITEM_LAYOUT} name="perdritype" label="准驾车型" >
                            <Select placeholder="请选择准驾车型" allowClear>
                                {(perdritypeList || []).map(({ value, label }) => {
                                    return (
                                        <Select.Option value={value} key={value}>
                                            {label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '请选择车辆类型',
                            },
                        ]} {...FORMITEM_LAYOUT} name="type" label="车辆类型" >
                            <Select placeholder="请选择车辆类型" allowClear>
                                {(carTypeList || []).map(({ value, label }) => {
                                    return (
                                        <Select.Option value={value} key={value}>
                                            {label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col> */}
                    <Col span={24}>
                        <Form.Item {...FORMITEM_LAYOUT} name="brand" label="车牌品牌" >
                            <Select placeholder="请选择车牌品牌" allowClear>
                                {(carBrandList || []).map(({ value, label }) => {
                                    return (
                                        <Select.Option value={value} key={value}>
                                            {label}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item {...FORMITEM_LAYOUT} name="fRegisterTime" label="登记日期" >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder="请选择登记日期" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item {...FORMITEM_LAYOUT} name="expiredTime" label="报废日期" >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" allowClear placeholder="请选择报废日期" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item rules={[
                            {
                                required: true,
                                message: '请填写车辆状态',
                            },
                        ]} {...FORMITEM_LAYOUT} name="carStatus" label="车辆状态" >
                            <Radio.Group>
                                <Radio value={'1'}>正常</Radio>
                                <Radio value={'2'}>维修保养</Radio>
                                <Radio value={'3'}>报废</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default connect(({ vehicleInformation, global }) => ({
    isCuVehicleInformationVisible: vehicleInformation.isCuVehicleInformationVisible,
    perdritypeList: global.perdritypeList,//可培训车型
    examSiteTypeList: global.examSiteList,//考场
    carBrandList: global.carBrandList,//车辆品牌
    certifyingAuthorityList: global.certifyingAuthorityList//发证机关
}))(CuVehicleInformation)
