import React, { useState, useEffect } from "react"
import { Form, Input, Col, Modal, Select } from "antd"
import { FORMITEM_LAYOUT_NOWRAP, TEL_REGEXP, ACCOUNT_REGEXP, NAME_REGEXP } from "@/utils/constants"
import { connect } from "dva"
import { Upload } from "@/components"
import "./style.less"
import { getHospitalDetailApi } from "@/api/student"
import { getDict } from "@/utils/publicFunc"
import { openNotification } from "@/components/OpenNotification"

const { Option } = Select

interface cuRoleModalProps {
  id?: number
  isShowHospitalModal?:boolean
  setIsShowHospitalModal?:Function
  dispatch: Function
  updateHospitalDetail: Function
  menuList: any
  parentForm: object
}

const HospitalModal: React.FC<cuRoleModalProps> = props => {
  const { isShowHospitalModal,setIsShowHospitalModal, id, dispatch, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [licenceUrl, setLicenceUrl] = useState("") // 医疗机构执业许可证 url
  const [eleSealUrl, setEleSealUrl] = useState("") // 医疗机构电子签章 url
  const [licenceUrlTip,setLicenceUrlTip]=useState({text:"图片格式为 jpg, png",color:"#8c8c8c"})
  const [eleSealUrlTip,setEleSealUrlTip]=useState({text:"图片格式为 jpg, png",color:"#8c8c8c"})
  const [provinceCode, setProvinceCode] = useState([])
  const [cityCode, setCityCode] = useState([])
  const [areaCode, setAreaCode] = useState([])


  //详情接口
  useEffect(() => {
    getDict(dispatch, "city", { level: 1 }).then((res => {
      setProvinceCode(res || [])
    }))
    getHospitalDetail()
  }, [])

  // 获取医院详情
  const getHospitalDetail = async ()=>{
    if (id) {
      let res: any =  await getHospitalDetailApi({ id })
      if (res?.code === 0) {
        const { licenceUrl, eleSealUrl, provinceCode, cityCode } = res.data
        setLicenceUrl(licenceUrl)
        setEleSealUrl(eleSealUrl)
        getDict(dispatch, "city", { level: 2, keyword: provinceCode }).then((res => {
          setCityCode(res || [])
        }))
        getDict(dispatch, "city", { level: 3, keyword: cityCode }).then((res => {
          setAreaCode(res || [])
        }))
        form.setFieldsValue({
          ...res.data
        })
      }
    } else {
      form.resetFields()
    }
  }

  const validateUploadUrl =(licenceUrl,eleSealUrl)=>{
     if (licenceUrl && eleSealUrl){
       setLicenceUrlTip({text:"图片格式为 jpg, png",color:"#8c8c8c"})
       setEleSealUrlTip({text:"图片格式为 jpg, png",color:"#8c8c8c"})
       return true
     } else{
       licenceUrl ?  setLicenceUrlTip({text:"图片格式为 jpg, png",color:"#8c8c8c"}) : setLicenceUrlTip({color:"#ff4d4f",text:"请上传医疗机构执业许可证, 图片格式为 jpg, png"})
       eleSealUrl ? setEleSealUrlTip({text:"图片格式为 jpg, png",color:"#8c8c8c"}) : setEleSealUrlTip({color:"#ff4d4f",text:"请上传医疗机构电子签章, 图片格式为 jpg, png"})
       return false
     }
  }

  // 确定提交
  const handleOnOk=()=>{
    // 校验有没有上传图片
    if (!validateUploadUrl(licenceUrl,eleSealUrl) ) {
      return
    }
    form.validateFields().then(async res => {
      setLoading(true)
      try {
        if (id) {
          res.id = id
        }
        await dispatch({
          type: "hospitalManagement/addOrUpdateHospital",
          payload: {
            parentForm,
            res
          }
        }).then((res)=>{
          if (res?.code===0){
            setLoading(false)
            setIsShowHospitalModal(false)
            // 通过组件属性传递过来的更新方法
            props?.updateHospitalDetail()
          }
        })
      } catch (err) {
        setLoading(false)
      }
    })
  }

  return (
    <Modal
      title={(id ? "编辑" : "创建") + "医院"}
      destroyOnClose
      visible={isShowHospitalModal}
      width="60%"
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={() => {
        setIsShowHospitalModal(false)
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        className="formant"
        colon={false}   
        autoComplete="off"
      >
        <Col span={12} >
          {/* 为方便布局,添加的无用元素, 不要删除, 处理*/}
          <div style={{display:"none"}}>
            <Form.Item {...FORMITEM_LAYOUT_NOWRAP}>
              <Input placeholder="" type="text" />
            </Form.Item>
          </div>
          <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <span style={{marginBottom:"5px"}}> <span style={{color:"red"}}>*</span> 医疗机构执业许可证</span>
            <div><Upload electronicSignImg={licenceUrl} getUploadedRes={(res) => {
              if (res?.code === 0) {
                openNotification({ message: "图片上传成功" }, "success")
                setLicenceUrl(res.data.uri)
                setLicenceUrlTip({text:"图片格式为 jpg, png",color:"#8c8c8c"})
              } else {
                setLicenceUrl("")
                openNotification({ message: "图片上传失败" }, "error")
              }
            }}/></div>
            <span style={{marginTop:"-10px",marginBottom:"5px", color: licenceUrlTip?.color }}>{licenceUrlTip?.text}</span>
          </div>
        </Col>
        <Col span={12} >
          {/* 为方便布局,添加的无用元素, 不要删除, 处理*/}
          <div style={{display:"none"}}>
            <Form.Item {...FORMITEM_LAYOUT_NOWRAP} >
              <Input placeholder="" type="text"/>
            </Form.Item>
          </div>
          <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <span style={{marginBottom:"5px"}}><span style={{color:"red"}}>*</span> 医疗机构电子签章</span>
            <div><Upload electronicSignImg={eleSealUrl} getUploadedRes={(res) => {
                if (res?.code === 0) {
                  openNotification({ message: "图片上传成功" }, "success")
                  setEleSealUrl(res.data.uri)
                  setEleSealUrlTip({text:"图片格式为 jpg, png",color:"#8c8c8c"})
                } else {
                  setEleSealUrl("")
                  openNotification({ message: "图片上传失败" }, "error")
                }
              }}/></div>
            <span style={{marginTop:"-10px",marginBottom:"5px", color: eleSealUrlTip?.color }}>{eleSealUrlTip?.text}</span>
          </div>
        </Col>


       {/* <Row>
          <Col span={12} >
            <Form.Item
              extra={<span style={{ color: "rgba(0 0 0 .45)" }}>图片格式为png,jpg</span>}
              rules={[
                {required: true, message: "上传医疗机构执业许可证"}
              ]} {...FORMITEM_LAYOUT_NOWRAP} name='licenceUrl' label="医疗机构执业许可证">
              <Upload electronicSignImg={licenceUrl} getUploadedRes={(res) => {
                if (res?.code === 0) {
                  openNotification({ message: "图片上传成功" }, "success")
                  form.setFieldsValue({
                    licenceUrl: res?.data?.uri
                  })
                  setLicenceUrl(res.data.uri)
                } else {
                  form.setFieldsValue({
                    licenceUrl: ""
                  })
                  setLicenceUrl("")
                  openNotification({ message: "图片上传失败" }, "error")
                }
              }}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              extra={<span style={{ color: "rgba(0 0 0 .45)" }}>图片格式为png,jpg</span>}
              rules={[{ required: true, message: "上传医疗机构电子签章" }]}
              {...FORMITEM_LAYOUT_NOWRAP} name='eleSealUrl' label="医疗机构电子签章">
              <Upload electronicSignImg={eleSealUrl} getUploadedRes={(res) => {
                if (res?.code === 0) {
                  openNotification({ message: "图片上传成功" }, "success")
                  form.setFieldsValue({
                    eleSealUrl: res?.data?.uri
                  })
                  setEleSealUrl(res.data.uri)
                } else {
                  form.setFieldsValue({
                    eleSealUrl: ""
                  })
                  setEleSealUrl("")
                  openNotification({ message: "图片上传失败" }, "error")
                }
              }}/>
            </Form.Item>
          </Col>
        </Row>*/}


        <Col span={24}>
          <Form.Item
            style={{ marginLeft: "-40%" }}
            // extra='以字母开头，只能包含英文、数字、下划线,不超过30位'
            rules={[
              { required: true, message: "请输入医院账号" },
              { pattern: ACCOUNT_REGEXP, message: "只能以字母开头，包含字母、数字、下划线, 5-30位" }
            ]} {...FORMITEM_LAYOUT_NOWRAP} name="account" label="医院账号">
            <Input placeholder="医院账号" type="text" disabled={!!id} maxLength={30}/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            style={{ marginLeft: "-40%" }}
            rules={[
              { required: true, message: "请输入组织机构代码" },
            ]} {...FORMITEM_LAYOUT_NOWRAP} name="uniformCrediCode" label="组织机构代码">
            <Input placeholder="组织机构代码" type="text" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            style={{ marginLeft: "-40%" }}
            rules={[
              { required: true, message: "请输入发证机关" },
            ]} {...FORMITEM_LAYOUT_NOWRAP} name="issuingAuthority" label="发证机关">
            <Input placeholder="发证机关" type="text" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item rules={[
            {
              required: true,
              message: "请输入医院名称"
            }
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="name" label="医院名称">
            <Input placeholder="请输入医院名称" maxLength={20}/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item rules={[
            {
              required: true,
              message: "请输入联系人姓名"
            },
            { pattern: NAME_REGEXP, message: "姓名要求最少2个汉字；复姓支持“·”隔开，如：爱新觉罗·弘业" }
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="contactName" label="联系人姓名">
            <Input placeholder="请输入姓名" maxLength={20}/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item rules={[
            { required: true, message: "请输入联系人电话" },
            { pattern: TEL_REGEXP, message: "请输入合法电话号码,固话格式 xxx-xxx" }
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="contactPhone" label="联系人电话">
            <Input placeholder="请输入电话"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item rules={[
            {
              required: true,
              message: "请选择省"
            }
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="provinceCode" label="省">
            <Select placeholder="请选择省" onChange={(value) => {
              getDict(dispatch, "city", { level: 2, keyword: value }).then((res => {
                setAreaCode([])
                setCityCode(res || [])
              }))
              form.setFieldsValue({ cityCode: undefined })
              form.setFieldsValue({ areaCode: undefined })
            }}>
              {provinceCode.map((item) => {
                return <Option key={item.value} value={item.value}>{item.label}</Option>
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item rules={[
            {
              required: true,
              message: "请选择城市"
            }
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="cityCode" label="市">
            <Select placeholder="请选择市" onChange={(value) => {
              getDict(dispatch, "city", { level: 3, keyword: value }).then((res => {
                setAreaCode(res || [])
              }))
              form.setFieldsValue({ areaCode: undefined })
            }}>
              {cityCode.map((item) => {
                return <Option key={item.value} value={item.value}>{item.label}</Option>
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item rules={[
            {
              required: true,
              message: "请选择区"
            }
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="areaCode" label="区">
            <Select placeholder="请选择区">
              {areaCode.map((item) => {
                return <Option key={item.value} value={item.value}>{item.label}</Option>
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item style={{ marginLeft: "-40%" }} rules={[
            {required: true, message: "请输入详细地址"}
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="address" label="详细地址">
            <Input placeholder="请输入" maxLength={200}/>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item style={{ marginLeft: "-40%" }} rules={[
            {required: true, message: "请输入医院简介"}
          ]} {...FORMITEM_LAYOUT_NOWRAP} name="introduction" label="医院简介">
            <Input.TextArea showCount maxLength={300}/>
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  )
}

export default connect(({ hospitalManagement }) => ({
  menuList: hospitalManagement.menuList
}))(HospitalModal)
