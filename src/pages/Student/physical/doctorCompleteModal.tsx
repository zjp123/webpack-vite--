import React, { useEffect, useState } from "react"
import { Input, Modal, Form, Row, Col, Select } from "antd"
import { connect } from "dva"
import { HWHttpSignature } from "@/components"
import { FORMITEM_LAYOUT, NAME_REGEXP, SEX_NUMBER_ENUM } from "@/utils/constants"
import { doctorCompleteApi, getDoctorDetailApi, uploadBase64Api } from "@/api/common"
import { openNotification } from "@/components/OpenNotification"

interface ResetPasswordModalProps {
  isShowDoctorModal: boolean
  dispatch: Function
  userId: number
  onCancel: Function
  setRenamedCompleteInformation: Function
}

// 医生完善信息
const DoctorCompleteModal: React.FC<ResetPasswordModalProps> = (props) => {
  const { isShowDoctorModal, userId } = props
  const [loading] = useState(false)
  const [signatureResult, setSignatureResult] = useState()
  const [form] = Form.useForm()
  const [doctorId, setDoctorId] = useState(0)
  const [phonenumber, setPhonenumber] = useState(0)

  useEffect(() => {
    getDoctorDetail()
  }, [])
  // 获取医生信息
  const getDoctorDetail = () => {
    getDoctorDetailApi({ userId }).then((res) => {
      setDoctorId(res?.data?.doctorId)
      setPhonenumber(res?.data?.phonenumber)
      form.setFieldsValue({
        doctorName: res?.data?.doctorName,
        sex: parseInt(res?.data?.sex)
      })
    })
  }

  // 提交
  const handleOnOk = () => {
    form.validateFields().then(async (res) => {
      const data = {
        ...res,
        doctorId,
        userId,
        phonenumber,
        electronicSign: signatureResult
      }
      if (!data.electronicSign) {
        openNotification({ message: "医生签名不能为空", duration: 3 }, "error", false)
        return
      } else {
        // 完善信息
        const completeRes = await doctorCompleteApi(data)
        if (completeRes.code === 0) {
          openNotification({ message: "完善信息成功", duration: 3 }, "success", false)
          props?.onCancel()
          props?.setRenamedCompleteInformation(0)
        } else {
          openNotification({ message: completeRes.msg }, "error", false)
        }
      }
    })
  }

  return (
    <Modal
      title="请完善医生个人信息"
      visible={isShowDoctorModal}
      width={600}
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={() => {
        props.onCancel()
      }}
    >
      <React.Fragment>
        <h3 style={{ color: "red" }}>请完善医生个人信息后才可以使用!</h3>
        <h4><span style={{ color: "red" }}>*</span> 请添加医生签名!</h4>
        <HWHttpSignature initialImmediately={true} prompt="请您在签字版上签字确认" height={200} getSignedResult={(imgBase64) => {
          uploadBase64Api({ imgBase64 }).then((res) => {
            res && setSignatureResult(res?.data?.uri)
          })
        }}/>
        <Form
          layout='horizontal'
          form={form}
          colon={false}
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <Form.Item
                rules={
                  [
                    { required: true, message: "医生姓名" },
                    { pattern: NAME_REGEXP, message: "姓名要求最少2个汉字；复姓支持“·”隔开，如：爱新觉罗·弘业" }
                  ]
                }
                {...FORMITEM_LAYOUT} name="doctorName" label="医生姓名">
                <Input placeholder="医生姓名" maxLength={20}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true, message: "性别" }]} {...FORMITEM_LAYOUT} name="sex" label="性别">
                <Select placeholder="性别" allowClear>
                  {
                    SEX_NUMBER_ENUM.map(({ id, value, label }) => {
                      return <Select.Option value={value} key={id}>{label}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    </Modal>
  )
}

export default connect(({}) => ({}))(DoctorCompleteModal)
