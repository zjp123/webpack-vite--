import React, { useState, useEffect } from "react"
import { Form, Input, Col, Modal, Select } from "antd"
import { FORMITEM_LAYOUT, ACCOUNT_REGEXP, NAME_REGEXP, TEL_REGEXP, CHINESE_NUM } from "@/utils/constants"
import { connect } from "dva"
import { getDict } from "@/utils/publicFunc"

interface cuRoleModalProps {
  id?: number
  dispatch: Function
  isShowDoctorModal: boolean
  setIsShowDoctorModal:Function
  menuList: any
  hospitalList: any
  parentForm: object
}

const DoctorModal: React.FC<cuRoleModalProps> = props => {
  const {isShowDoctorModal, setIsShowDoctorModal, id, dispatch, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { Option } = Select
  const [hospitalList, setHospitalList] = useState([])

  //详情接口
  useEffect(() => {
    getDict(dispatch, "hospital")
  }, [])

  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  const handleChiefSearch = async (val) => {
    let flag = CHINESE_NUM.test(val)
    if (flag) {
      getDict(dispatch, "hospital", { keyword: val }).then((res => {
        setHospitalList(res)
      }))
    } else {
      setHospitalList([])
    }
  }

  // 确定 提交
  const handleOnOk =() => {
    form.validateFields().then(async res => {
      setLoading(true)
      try {
        if (id) {
          res.id = id
        }
        res.hospitalId = res?.hospitalId?.value
        await dispatch({
          type: "hospitalManagement/createDoctorAccount",
          payload:{
            parentForm,
            res
          }
        }).then(()=>{
          setLoading(false)
          setIsShowDoctorModal(false)
        })
      } catch (err) {
        setLoading(false)
      }
    })
  }

  return (
    <Modal
      title={(id ? "" : "开通医生") + "账号"}
      visible={isShowDoctorModal}
      width="60%"
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={() => {
        console.log("点击cancel了 ===");
        props?.setIsShowDoctorModal(false)
      }}
    >
      <Form layout="horizontal" form={form} colon={false} autoComplete="off">
        <Col span={24}>
          <Form.Item
            rules={[
              {required: true, message: "输入医生账号"},
              { pattern: ACCOUNT_REGEXP, message: "只能以字母开头，包含字母、数字、下划线, 5-30位" }
            ]} {...FORMITEM_LAYOUT}
            label="输入医生账号"
            name="userName">
            <Input placeholder="输入医生账号" disabled={!!id} maxLength={30}/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            rules={[
              { required: true, message: "输入医生姓名" },
              { pattern: NAME_REGEXP, message: "姓名要求最少2个汉字；复姓支持“·”隔开，如：爱新觉罗·弘业" }
            ]}
            {...FORMITEM_LAYOUT}
            name="doctorName"
            label="输入医生姓名"
          >
            <Input placeholder="输入医生姓名" maxLength={20}/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            rules={[
              {required: true, message: "输入医生手机号"},
              { pattern: TEL_REGEXP, message: "请输入合法手机号" }
            ]}
            {...FORMITEM_LAYOUT}
            name="phonenumber"
            label="输入医生手机号"
          >
            <Input placeholder="输入医生手机号" maxLength={11}/>
          </Form.Item>
        </Col>


        <Col span={24}>
          <Form.Item rules={[
            {required: true, message: "选择医院"}
          ]} {...FORMITEM_LAYOUT} label="选择医院" name="hospitalId">
            <Select
              showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入关键字后选择所属医院"
              onSearch={handleChiefSearch}
              filterOption={handleFilterOption}
            >
              {hospitalList?.map(({ value, label, id }) => {
                return <Option value={value} key={id}>{label}</Option>
              })}
            </Select>
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  )
}

export default connect(({ hospitalManagement }) => ({
  menuList: hospitalManagement.menuList,
  hospitalList: hospitalManagement.hospitalList
}))(DoctorModal)
