/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-26 10:29:02
 * @description: 体检信息采集... ...
 *
 *  第一页体检
 */
import React, {  Fragment, useEffect,  useState } from "react"
import { connect } from "dva"
import { WhiteCard,ControlledCamera, IDCardReader, InfoCard } from "@/components"
import "./physic.less"
import PhysicalInfoCollectMonitor from "@/assets/img/physical_info_collect.png"
import CuAddIDNo from "./cuAddIDNo"
import { goto } from "@/utils"
import { getDict } from "@/utils/publicFunc"
import { store } from "@/store"
import DoctorCompleteModal from "./doctorCompleteModal"
import { getUserInfoApi } from "@/api/common"
import { EMAIL_REGEXP, FORMITEM_LAYOUT, ID_REGEXP, NAME_REGEXP, SEX_NUMBER_ENUM, TEL_REGEXP } from "@/utils/constants"
import { Form, Col, DatePicker, Input, Modal, Radio, Row, Select, Button } from "antd"
import moment from "moment"
import { PHYSICAL_INFO_CARD_COLUMNS } from "@/pages/Student/physical/columns"
import { openNotification } from "@/components/OpenNotification"

const { Item } = Form
const { Option } = Select
const {TextArea} = Input

let timerId
const PhysicalCheckInfoCollect = ({dispatch, isShowWriting, perdritypeList, bizTypeList}) => {
  const [form] = Form.useForm()
  const {storeData = {}} = store.getState()
  const userid = storeData?.userInfo?.userid
  const [isShowDoctorModal, setIsShowDoctorModal] = useState<boolean>(true)
  let [completeInformation, setCompleteInformation] = useState<number | undefined>()
  const [isReadingIdCard,setIsReadingIdCard]= useState(true)
  let [idCardInfo,setIdCardInfo] = useState<any>({})
  const [isShowCameraModal,setIsShowCameraModal]=useState(false)
  const [inchPhotoBase64,setInchPhotoBase64]=useState<any>()
  const [inchPhoto,setInchPhoto]=useState<any>() // 拍照 URL

  // 完善信息 completeInformation
  useEffect(() => {
    // 获取用户信息,验证用户是否是第一次登录
    getUserInfoApi({}).then((res) => {
      setCompleteInformation(res?.completeInformation)
    })
    getDict(dispatch, "perdritype")
    getDict(dispatch, "bizType")
  }, [])

  // 读取身份证之后的逻辑
  const getReadResult = (res) => {
    setIdCardInfo({
      name:res?.data?.partyName || "-",
      sex:res?.data?.gender,
      ethnic:res?.data?.nation || "-",
      birthday:res?.data?.bornDay || "-",
      registerAddress:res?.data?.certAddress || "-",
      idcard: res?.data?.certNumber || "-",
      idCardIssuingAuthority: res?.data?.certOrg || "-",
      idCardExpirationDate: res?.data?.expDate ? moment(res?.data?.expDate).format("YYYY-MM-DD") : "-", // 身份证失效日期 expDate: "20410425"
      source: res?.data?.source || "-",
      contactAddress: res?.data?.contactAddress || "-",
      certAddress:res?.data?.certAddress || "-",// 身份证地址
      inchPhotoBase64: `data:image/jpeg;base64,${res?.data?.identityPic}`, // 身份证上照片
    })
    form.setFieldsValue({mailingAddress:res?.data?.certAddress})
  }

  // 1.1. 默认读取身份证显示器 信息读取采集
  const renderInfoCollect=()=>{
    return(
      <Fragment>
        <div className="physical_info_reading">
          <div className="card_monitor_container">
            <div className="pic_and_desc">
                <div className="img">
                  <img src={PhysicalInfoCollectMonitor} style={{width: "297px", height: "210px"}}/>
                </div>
                <div className="desc_top">请将学员身份证放于读卡器上, 系统将自动识别学员信息.</div>
                <div className="desc_bottom"> 或
                  <span className="manual_write_button" onClick={() => {
                    clearInterval(timerId)
                    dispatch({
                      type: "physical/save",
                      payload: {
                        isShowWriting: true,
                      },
                    })
                  }}> 手动输入 </span>考生信息
                </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  //1.2 渲染读取到的信息详情
  const renderInfoDetail = ()=>{
    return(
      <Fragment>
        <div className="info_detail_container">
          <div className="top_title">学员身份证信息</div>
          <div className="bottom_info_container">
            <div className="bottom_info_detail">
              <div className="left_detail" >
                <div  className="info_card">
                  <InfoCard column={3} columns={PHYSICAL_INFO_CARD_COLUMNS} data={idCardInfo}/>
                </div>
              </div>
              <div className="right_card_pic" >
                {idCardInfo?.inchPhotoBase64?
                  <div className="physical_face_pic">
                    <img src={idCardInfo?.inchPhotoBase64}/>
                  </div>
                  :(
                  <div className="no_data_icon">
                    <div className="head"></div>
                    <div className="body"></div>
                  </div>
                  )
                }
              </div>
              {/* 上传证件照 */}
              <div className="upload_pic" onClick={()=>{
                setIsShowCameraModal(true)
              }}>
                {/* 拍证件照 */}
                {inchPhotoBase64 ? <img style={{width:"100%",height:"141px"}} src={inchPhotoBase64} /> : (
                  <Fragment>
                    <div className="cross_icon">
                      <div className="horizontal_bar"></div>
                      <div className="vertical_bar"></div>
                    </div>
                    <div className="sub_title">上传证件照</div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }

  //1.3 渲染Form
  const renderFormCollect = ()=>{
    const handleToNextStep = () => {
      if (!inchPhotoBase64){
        openNotification({message:"请上传证件照"},"warning")
        setTimeout(()=>{
          setIsShowCameraModal(true)
        })
        return
      }else {
        form.validateFields().then((formValue) => {
          let data = {
            ...idCardInfo,
            ...formValue,
            idcardName: "身份证",
            nationality: "中国",
            birthday:new Date(moment(idCardInfo?.birthday).format("YYYY-MM-DD HH:mm:ss")),
            idCardExpirationDate:moment(idCardInfo?.idCardExpirationDate),
            inchPhoto:inchPhoto
          }
          delete data?.inchPhotoBase64
          dispatch({
            type: "physical/addStudentBasicInfo",
            payload: data
          }).then((res) => {
            if (res?.code === 0) {
              // 保存成功 下一步
              openNotification({ message: "信息保存成功" }, "success")
              setTimeout(() => {
                goto.push(`/student/physical/medicalPage/${res?.data?.id}`)
              }, 1000)
            }
          }).catch(() => {
          })
        })
      }
    }
    return (
     <Fragment>
       <div className="info_form_container">
         <Form
           layout='horizontal'
           form={form}
           colon={false}
           autoComplete="off"
           initialValues={{perdritype:"C1",businessType:0,mailingAddress:idCardInfo?.registerAddress}}
           style={{marginTop:"20px"}}
         >
           <Row>
             <Col span={6}>
               <Item
                 {...FORMITEM_LAYOUT}
                 rules={[
                   { required: true, message: "请输入手机号" },
                   { pattern: TEL_REGEXP, message: "请输入正确的输入手机号" }
                 ]}
                 name="mobilePhone" label="手机号">
                 <Input placeholder="请输入" maxLength={15}/>
               </Item>
             </Col>
             <Col span={6}>
               <Item
                 {...FORMITEM_LAYOUT}
                 labelCol={{ span: 6 }}
                 rules={[
                   { required: true, message: "请选择报考车型" }
                 ]}
                 name="perdritype" label="报考车型">
                 <Select placeholder="请选择">
                   {perdritypeList.map((item) => {
                     return <Option key={item.id} value={item.value}>{item.label}</Option>
                   })}
                 </Select>
               </Item>
             </Col>
             <Col span={6}>
               <Item
                 {...FORMITEM_LAYOUT}
                 rules={[{required: true}]}
                 name="businessType" label="申请类型">
                 <Select placeholder="请选择业务类型">
                   {bizTypeList.map((item) => {
                     return <Option key={item.id} value={item.value}>{item.label}</Option>
                   })}
                 </Select>
               </Item>
             </Col>
             <Col span={6}>
               <Item
                 {...FORMITEM_LAYOUT}
                 rules={[
                   { pattern: EMAIL_REGEXP, message: "请输入正确的邮箱格式" }
                 ]}
                 name="eMail" label="电子邮箱">
                 <Input placeholder="请输入"/>
               </Item>
             </Col>
           </Row>
           <Row>
             <Col span={6}>
               <Item
                 {...FORMITEM_LAYOUT}
                 rules={[{required: true}]}
                 name="mailingAddress" label="邮寄地址">
                 <TextArea placeholder="请输入邮寄地址" allowClear maxLength={200}/>
               </Item>
             </Col>
           </Row>
         </Form>
       </div>
       <div className="next_step_button"   onClick={handleToNextStep}>
        <span >
          下一步
        </span>
       </div>
     </Fragment>
    )
  }


  //1. 渲染优化后的体检信息采集
  const renderOptimizedPhysicalInformationCollect = ()=>{
    // completeInformation === 1， 表示该医生第一次登录,需要完善签名
    if (completeInformation === 1) {
      const onCancel = () => {
        setIsShowDoctorModal(false)
      }
      return (
        <DoctorCompleteModal
          userId={userid} setRenamedCompleteInformation={setCompleteInformation} isShowDoctorModal={isShowDoctorModal} onCancel={onCancel}/>
      )
    } else {
      // 该医生不是第一次登录, 不需要完善签名 可以直接执行体检
      // 获取手动输入的信息
      const getInputInfo = (res)=>{
        setIdCardInfo({
          ...res,
          birthday:(res?.birthday).format("YYYY-MM-DD"),
          idCardExpirationDate:moment(res?.idCardExpirationDate).format("YYYY-MM-DD")
        })
        setIsShowDoctorModal(false)
      }

      // 获取 base64 结果
      const getBase64Result = (base64Result)=>{
        if (base64Result){
          setInchPhotoBase64( `data:image/jpeg;base64,${base64Result}`)
        }
      }

      // 获取 Url的结果
      const getUrlResult = (imgUrl)=>{
        // console.log("imgUrl ====>>>",imgUrl);
        setInchPhoto(imgUrl)
        setIsShowCameraModal(false)
      }

      return (
        <Fragment>
          {renderInfoCollect()}
          {renderInfoDetail()}
          {renderFormCollect()}
          {isShowWriting && <CuAddIDNo getInputInfo={getInputInfo}  setIdCardInfo={setIdCardInfo} />}
         { isReadingIdCard && <IDCardReader initConnect={true} getReadResult={getReadResult}/>}
          {/* 摄像机拍照框 */}
          {isShowCameraModal && <Modal
            title="采集证件照"
            destroyOnClose
            visible={isShowCameraModal}
            closable
            width="40%"
            onOk={()=>{}}
            onCancel={()=>{
              setIsShowCameraModal(false)
            }}
            footer={null}
          >
            <ControlledCamera renderIndex={2} width={250} height={300} onChange={getUrlResult} getBase64Result={getBase64Result} >
            </ControlledCamera>
          </Modal> }
        </Fragment>
      )
    }
  }

  return (
    <WhiteCard isPaved={false} className="physical_info_collect_container">
      {renderOptimizedPhysicalInformationCollect()}
    </WhiteCard>
  )
}

export default connect(({physical,global}) => ({
  isShowWriting: physical.isShowWriting,
  perdritypeList: global.perdritypeList,
  bizTypeList: global.bizTypeList
}))(PhysicalCheckInfoCollect)

