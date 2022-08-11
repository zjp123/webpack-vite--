/**
 * 体检信息预录入页面
 */
import React, { Fragment, useEffect, useState } from 'react'
import {Col, Form, Checkbox, Button,Radio,Select, Input,InputNumber, Divider, Row} from 'antd'
import {connect} from 'dva';
import {goto} from '@/utils'
import GoBackSvg from "@/assets/svg/go_back.svg"
import "./physic.less"
import {COLOR_VISION, FORMITEM_LAYOUT, HEARING, LEFT_LOWERLIMB, UPPER_LIMB, VISUAL_DISTURBANCE,heightReg,visionReg} from "@/utils/constants"

const {Item} = Form
const CheckboxGroup = Checkbox.Group

// 体检信息预录入
const MedicalPage = ({dispatch, match}) => {
  const [form] = Form.useForm()
  const id = match?.params?.userId // 前一步,保存数据,接口返回的学员id
  const [checkedList, setCheckedList] = useState([]);
  const [exist, setExist] = useState(0); // 具有与否
  const [disease, setDisease] = useState([]) // 疾病相加
  const [visualDisturbance,setVisualDisturbance]=useState("2")
  const [colorVision,setColorVision]=useState("1")
  const [hearing,setHearing]=useState("1")
  const [leftLowerLimb,setLeftLowerLimb]=useState("1")
  const [rightLowerLimb,setRightLowerLimb]=useState("1")
  const [upperLimb,setUpperLimb]=useState("1")

  useEffect(() => {
    if (checkedList?.length===0){
      setExist(0) // 不具有病种
    }else{
      setExist(1) // 具有病种
    }
  }, [checkedList])

  // 体检检查项
  const renderPhysicalExamination = ()=>{
    // 具有与否
    const handleIsExist = e => {
      if (e.target.value===0){ // 选择不具有的时候,情况列表
        setCheckedList([])
      }
      setExist(e.target.value);
    };

    // 器质性心脏病
    const handleDiseaseChange = checkedValues => {
      let disease = checkedValues.reduce((prev, current) => {
        return prev + current
      }, 0)
      setCheckedList(checkedValues)
      setDisease(disease)
    };
    const handleVisualDisturbanceChange = e => {
      setVisualDisturbance(e?.target?.value)
    };
    const handleColorVisionChage = e => {
      setColorVision(e?.target?.value)
    };
    const handleHearingonChange = e => {
      setHearing(e?.target?.value)
    };
    const handleLeftLowerLimbChange = e => {
      setLeftLowerLimb(e?.target?.value)
    };
    const handleRightLowerLimbChange = e => {
      setRightLowerLimb(e?.target?.value)
    };
    const handleUpperLimbChange = e => {
      setUpperLimb(e?.target?.value)
    };


    const handleSavePhysicalExamine2Next = () => {
      form.validateFields().then(async (res) => {
        let data = {
          id,
          ...res,
          disease: disease instanceof Array ? 0 : disease,
          visualDisturbance,
          colorVision,
          hearing,
          leftLowerLimb,
          rightLowerLimb,
          upperLimb,
          //  下面是写死的数据
          trunkNeck: 1,
        }
        dispatch({
          type: "physical/savePhysicalInfo",
          payload: data,
        }).then((res) => {
          if (res?.code === 0) {
            goto.push(`/student/physical/medicalExaminationReport/${id}`)
          }
        })
      })
    }

    return(
     <div className="physical_check_list_container">
       <div className="physical_check_title">
         <div
           className="previous"
           onClick={()=>{
             goto.go(-1)
           }}
         >
           <img src={GoBackSvg}/>
           <span>返回</span>
         </div>
         <div className="title">体检信息预录入</div>
       </div>
       <div className="physical_check_notify_container">
         <div className="notify_title_container">
          <div className="notify_title">
            <span className="warning_icon"> * </span>
            <span className="warning_desc">本人如实申告是否具有以下疾病或情况</span>
            <div>
              <Radio.Group onChange={handleIsExist} value={exist}>
                <Radio value={1}>具有</Radio>
                <Radio value={0}>不具有</Radio>
              </Radio.Group>
            </div>
          </div>
         </div>
         <div className="notify_list_container">
           <div style={{borderTop:"1px solid #e9e9e9",marginBottom:"10px"}}></div>
           <CheckboxGroup  value={checkedList} onChange={handleDiseaseChange} >
             <Row>
               <Col span={3}>
                 <Checkbox value={2}>器质性心脏病</Checkbox>
               </Col>
               <Col span={3}>
                 <Checkbox value={8}>美尼尔氏症</Checkbox>
               </Col>
               <Col span={3}>
                 <Checkbox value={64}>震颤麻痹</Checkbox>
               </Col>
               <Col span={2}>
                 <Checkbox value={4}>癫痫</Checkbox>
               </Col>
               <Col span={2}>
                 <Checkbox value={16}>眩晕</Checkbox>
               </Col>
               <Col span={2}>
                 <Checkbox value={32}>癔病</Checkbox>
               </Col>
               <Col span={2}>
                 <Checkbox value={128}>精神病</Checkbox>
               </Col>
               <Col span={2}>
                 <Checkbox value={256}>痴呆</Checkbox>
               </Col>
             </Row>
             <Row style={{margin:"15px 0"}}>
               <Col span={24}>
                 <Checkbox value={512}>影响肢体活动的神经系统疾病等妨碍安全驾驶疾病</Checkbox>
               </Col>
             </Row>
             <Row>
               <Col span={24}>
                 <Checkbox value={1024}>三年内有吸食、注射毒品行为或者解除强制隔离戒毒措施未满三年，或者长期服用依赖性精神药品成瘾尚未解除</Checkbox>
               </Col>
             </Row>
           </CheckboxGroup>
           <div className="legal_duty">上述申告为本人真实情况和真实意思表示，如果不属实本人自愿承担相应的法律责任。</div>
         </div>
       </div>
       <div className="physical_check_form_container">
         <div className="form_title"> <span> * </span> 体检信息 </div>
         <div className="form_inner">
           <Form
             layout='horizontal'
             form={form}
             colon={false}
             autoComplete="off"
             initialValues={{}}
           >
             <div>
               <Row>
                 <Col span={8}>
                   <Item
                     {...FORMITEM_LAYOUT}
                     labelCol={{span: 24}}
                     rules={[
                       {required:true,message:"请输入身高"},
                       { pattern: heightReg, message: "请输入正确得身高" }
                     ]}
                     name="height" label="身高/cm">
                     <InputNumber style={{width:"240px"}} placeholder="请输入身高" />
                   </Item>
                 </Col>
                 <Col span={8}>
                   <Item
                     {...FORMITEM_LAYOUT}
                     labelCol={{span: 24}}
                     rules={[
                       {required:true,message:"请输入左眼视力"},
                       { pattern: visionReg, message: "请输入正确的左眼视力" }
                     ]}
                     name="leftVision" label="左眼视力">
                     <InputNumber step={0.1} style={{width:"240px"}} placeholder="请输入左眼视力" />
                   </Item>
                 </Col>
                 <Col span={8}>
                   <Item
                     {...FORMITEM_LAYOUT}
                     labelCol={{span: 24}}
                     rules={[
                       {required:true,message:"请输入右眼视力"},
                       { pattern: visionReg, message: "请输入正确的右眼视力" }
                     ]}
                     name="rightVision" label="右眼视力">
                     <InputNumber step={0.1} style={{width:"240px"}} placeholder="请输入右眼视力" />
                   </Item>
                 </Col>
               </Row>
               <Row>
                 <Col span={8}>
                    <span className="ratio_desc">单眼视力障碍</span>
                    <Radio.Group onChange={handleVisualDisturbanceChange} value={visualDisturbance}>
                      <Radio value={"1"}>是</Radio>
                      <Radio value={"2"}>否</Radio>
                    </Radio.Group>
                 </Col>
                 <Col span={8}>
                    <span className="ratio_desc">红绿色盲</span>
                    <Radio.Group onChange={handleColorVisionChage} value={colorVision}>
                      <Radio value={"1"}>合格</Radio>
                      <Radio value={"0"}>不合格</Radio>
                    </Radio.Group>
                 </Col>
                 <Col span={8}>
                    <span className="ratio_desc">听力</span>
                    <Radio.Group onChange={handleHearingonChange} value={hearing}>
                      <Radio value={"1"}>合格</Radio>
                      <Radio value={"0"}>不合格</Radio>
                      <Radio value={"2"}>需带助听器</Radio>
                    </Radio.Group>
                 </Col>
               </Row>
               <Row style={{margin:"15px 0"}}>
                 <Col span={8}>
                   <span className="ratio_desc">左下肢</span>
                   <Radio.Group onChange={handleLeftLowerLimbChange} value={leftLowerLimb}>
                     <Radio value={"1"}>合格</Radio>
                     <Radio value={"0"}>不合格</Radio>
                   </Radio.Group>
                 </Col>
                 <Col span={12}>
                   <span className="ratio_desc">右下肢</span>
                   <Radio.Group onChange={handleRightLowerLimbChange} value={rightLowerLimb}>
                     <Radio value={"1"}>合格</Radio>
                     <Radio value={"0"}>不合格</Radio>
                     <Radio value={"2"}>不合格但可自主坐立</Radio>
                   </Radio.Group>
                 </Col>
               </Row>
               <Row>
                 <Col span={24}>
                   <span className="ratio_desc">上肢</span>
                   <Radio.Group onChange={handleUpperLimbChange} value={upperLimb}>
                     <Radio value={"1"}>合格</Radio>
                     <Radio value={"0"}>不合格</Radio>
                     <Radio value={"2"}>手指末端残缺</Radio>
                     <Radio value={"4"}>左手三指健全,双手手掌完整</Radio>
                     <Radio value={"5"}>符合申请C5条件</Radio>
                   </Radio.Group>
                 </Col>
               </Row>
             </div>
           </Form>
         </div>
         <div className="next_step_button"  onClick={handleSavePhysicalExamine2Next}>
           下一步
         </div>
       </div>
     </div>
    )
  }

  //1. 体检信息病情录入
  return (
   <Fragment>
     { renderPhysicalExamination() }
   </Fragment>
  )
}
export default connect(({physical}) => ({
  preliList: physical.preliList,
  searchphysicalForm: physical.searchphysicalForm,
  getanquanyuanList: physical.getanquanyuanList,
}))(MedicalPage)

