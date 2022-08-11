import React, { useState, useEffect, Fragment } from 'react'
import { Form, Input, Row, Col, Modal, Button } from 'antd'
import { connect } from 'dva';
import { Camera, Upload } from '@/components'
import { TEL_REGEXP } from "@/utils/constants"
import Images from "@/components/Images";
import { openNotification } from "@/components/OpenNotification";
import "./index.less"
import clearimg from '@/assets/svg/clearimg.svg'

const {Item} = Form
const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 24,
    style: {
      marginBottom: '0px',
      padding: 0,
    }
  },
  wrapperCol: {
    span: 22
  },
  style: { marginBottom: '4px' }
}

const EditExaminerInfoModal = (props) => {
  const { id, dispatch,isShowEditModal,examinerInfoCardData,setIsShowEditModal } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isShow, setIsShow] = useState('echo') // 回显照片
  const [photoUrl,setPhotoUrl]=useState<any>(examinerInfoCardData?.photo)
  const [echoImg,setEchoImg]= useState(examinerInfoCardData?.photo)

  //详情接口
  useEffect(() => {
    getInfoCardData()
  }, [])

  // 获取 infoCard 详情数据
  const getInfoCardData = ()=>{
    dispatch({
      type: 'examinerInformation/getInfoCardData',
      payload: {id}
    }).then((res)=>{
      form.setFieldsValue({
        ...res?.data
      })
    })
  }


  // 图片显示区域
  const renderImgContent = ()=>{
    if (isShow ==="echo"){
      return (<Fragment>
        {/* 照片回显部分 */}
        <div className="photo_img">
          <img  className="close_icon" src={clearimg} onClick={() => {
            setIsShow("camera")
          }}/>
          <Images width={300} height={250} enlarge={false} src={examinerInfoCardData?.photo} />
          <div className="button_container">
            <Button onClick={() => setIsShow('camera')} type='primary'> 去拍照 </Button>
            <Button onClick={() => setIsShow('upload')} type="primary"> 上传照片 </Button>
          </div>
        </div>
      </Fragment>)
    }else if (isShow ==="camera"){
      /* 打开摄像头拍照 */
      return (
        <div className="camera_container">
          <div className="student_photo_camera">
            <Camera onChange={(imgUrl) => {
              setPhotoUrl(imgUrl)
              form.setFieldsValue({
                photoUrl: imgUrl
              })
            }} />

            <div className="button_center">
              <Button onClick={() => { setIsShow("echo")}} type='primary'> 返回 </Button>
            </div>
          </div>
        </div>
      )
    }else if (isShow==="upload"){
      /* 上传图片 */
      return (
        <Fragment>
          <div className='photo'>
            <Upload electronicSignImg={echoImg} getUploadedRes={(res) => {
              if (res?.code === 0) {
                openNotification({ message: "图片上传成功" }, "success")
                setPhotoUrl( res?.data?.uri)
                setEchoImg(res?.data?.uri)
                form.setFieldsValue({
                  photoUrl: res?.data?.uri
                })
              } else {
                openNotification({ message: "图片上传失败" }, "error")
              }
            }} />
           <div style={{width:"100%",display:"flex",justifyContent:"center"}}>
             <Button onClick={() => setIsShow('echo')} type="primary"> 返回 </Button>
           </div>
          </div>
        </Fragment>
      )
    }
  }

  // 确定
  const handleOnOk = ()=>{
    form.validateFields().then(async (res) => {
      try {
        if (id) {
          res.invigilatorId = id
        }
        await dispatch({
          type: 'examinerInformation/addOrUpdateExaminer',
          payload: {photoUrl, ...res }
        }).then(()=>{
          getInfoCardData()
          setIsShowEditModal(false)
        })
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    })
  }
  return (
    <Modal
      title={(id ? '编辑' : '') + '考官信息'}
      visible={isShowEditModal}
      width={560}
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={() => {
        setIsShowEditModal(false)
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
        initialValues={{
          photoUrl:examinerInfoCardData?.photo
        }}
      >
        <Row >
          <Col span={24}>
            <Item
              rules={[{ required: true, message: "请输入合法手机号" }, { pattern: TEL_REGEXP, message: "请输入合法手机号" }]}
              {...FORM_ITEM_LAYOUT} name="tel" label="联系方式">
              <Input placeholder="联系方式" maxLength={11} />
            </Item>
          </Col>
        </Row>
        <Row >
          <Item  rules={[{ required: true, message: "请上传照片" }]}   {...FORM_ITEM_LAYOUT}  label="上传照片">
          </Item>
        </Row>
        <div className="examiner_photo_container">
          {renderImgContent()}
        </div>
      </Form>
    </Modal>
  )
}

export default connect(({ examinerInformation }) => ({
  examinerInfoCardData: examinerInformation.examinerInfoCardData,
}))(EditExaminerInfoModal)
