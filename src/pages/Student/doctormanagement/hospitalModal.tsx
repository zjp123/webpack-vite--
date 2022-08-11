import React, { useState, useEffect } from "react"
import { Form, Input, Col, Modal, Select } from "antd"
import { FORMITEM_LAYOUT, ACCOUNT_REGEXP, NAME_REGEXP, TEL_REGEXP, CHINESE_NUM } from "@/utils/constants"
import { connect } from "dva"
import { getDoctorDetailApi } from "@/api/common"
import "./style.less"
import { getDict } from "@/utils/publicFunc"
import { store } from "@/store"

const { storeData = {} } = store.getState()
const { Option } = Select

interface cuRoleModalProps {
  userId?: number
  ishospitalModalVisible: boolean
  dispatch: Function
  menuList: any
  parentForm: object
}

const CuRoleModal: React.FC<cuRoleModalProps> = props => {
  const { ishospitalModalVisible, userId, dispatch, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [doctorId, setDoctorId] = useState(0)
  const [hospitalList, setHospitalList] = useState([])

  //详情接口
  useEffect(() => {
    if (userId) {
      ; (async () => {
        let res: any = await getDoctorDetailApi({ userId })
        if (res.code === 0) {
          setDoctorId(res.data.doctorId)
          getDict(dispatch, "hospital", { keyword: res.data.hospitalName }).then((res => {
            setHospitalList(res)
          }))
          form.setFieldsValue({
            ...res.data
          })
        }
      })()
    } else {
      form.resetFields()
    }
  }, [])
  // 主考官搜索
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

  return (
    <Modal
      title={(userId ? "编辑" : "创建") + "医生账号"}
      visible={ishospitalModalVisible}
      width={800}
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(async res => {
          setLoading(true)
          try {
            if (userId) {
              res.userId = userId
              res.doctorId = doctorId
            }
            await dispatch({
              type: "doctormanagement/addctorman",
              payload: {
                parentForm,
                postData: {
                  ...res, hospitalId: storeData.hospitalId || res.hospitalId
                }
              }
            })
            // setLoading(false)
          } catch (err) {
            setLoading(false)
          }
        })
      }}
      onCancel={() => {
        dispatch({
          type: "doctormanagement/save",
          payload: {
            ishospitalModalVisible: false
          }
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        className="formant"
        colon={false}
        autoComplete="off"
        initialValues={{
          status: "1"
        }}
      >
        <Col span={24}>
          <Form.Item
            // extra='以字母开头，只能包含英文、数字、下划线,不超过30位'
            rules={[
              { required: true, message: "输入医生账号" },
              { pattern: ACCOUNT_REGEXP, message: "只能以字母开头，包含字母、数字、下划线, 5-30位" }
            ]} {...FORMITEM_LAYOUT} name="userName" label="医生账号">
            <Input placeholder="请输入" disabled={!!userId} maxLength={30} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item rules={[
            { required: true, message: "医生姓名" },
            { pattern: NAME_REGEXP, message: "姓名要求最少2个汉字；复姓支持“·”隔开，如：爱新觉罗·弘业" }
          ]} {...FORMITEM_LAYOUT} name="doctorName" label="医生姓名">
            <Input placeholder="请输入" maxLength={20} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item rules={[
            { required: true, message: "医生手机号" },
            { pattern: TEL_REGEXP, message: "请输入合法手机号" }
          ]} {...FORMITEM_LAYOUT} name="phonenumber" label="医生手机号">
            <Input placeholder="请输入" maxLength={15} />
          </Form.Item>
        </Col>
        {
          storeData.hospitalId ? null : <Col span={24}>
            <Form.Item rules={[
              {
                required: true,
                message: "选择医院"
              }
            ]} {...FORMITEM_LAYOUT} name="hospitalId" label="选择医院">
              <Select
                showSearch defaultActiveFirstOption={false} placeholder="请输入关键字后选择所属医院"
                onSearch={handleChiefSearch}
                filterOption={handleFilterOption}
              >
                {hospitalList?.map(({ value, label, id }) => {
                  return <Option value={value} key={id}>{label}</Option>
                })}
              </Select>
            </Form.Item>
          </Col>
        }
      </Form>
    </Modal>
  )
}

export default connect(({ doctormanagement }) => ({
  ishospitalModalVisible: doctormanagement.ishospitalModalVisible
}))(CuRoleModal)
