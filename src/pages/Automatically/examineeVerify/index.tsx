import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react"
import {connect} from "dva"
import {ControlledCamera, Camera, IDCardReader,  TableView, FaceMask} from "@/components"
import {saveExamineeCheckApi, getListDataApi} from "@/api/automatically"
import "./index.less"
import {openNotification} from "@/components/OpenNotification"
import { Spin } from "antd"
import { TABLE_COLUMNS } from "@/pages/Automatically/examineeVerify/tableColumns"

const RefedControlledCamera = forwardRef(ControlledCamera)
// 考生核验
let previousCachedIdNo
const ExamineeVerify = () => {
  const childRef = useRef();
  let initialBtnDesc = {userInfo:{}, result:{}}
  const [tableList, setTableList] = useState([]) // 底部表格数据
  const [idCardInfo, setIdCardInfo] = useState<any>() // 身份证信息
  const [checkedInfo,setCheckedInfo]=useState<any>(initialBtnDesc) // 核验结果信息
  const [noInformation,setNoInformation] = useState(true)
  const [isChecked,setIsChecked]= useState(false) // 是否已经成功核验过一次
  const [isShowShoting] = useState(true)
  const [imgUrl,setImgUrl] = useState()

  useEffect(() => {
    getListData({})
  }, [])

  // 监听拍照照片结果
  useEffect(()=>{
    const data = {
      idCard: idCardInfo?.certNumber,/* 考生*/ userType: 3, imgUrl
    }
    if (imgUrl) {
      // 如果拍照成功, 保存提交核验信息
      saveExamineeCheck(data)
    }
    return ()=>{
    }
  },[imgUrl])

  // 获取列表数据
  const getListData = (data) => {
    getListDataApi(data).then((res) => {
      const list = res?.data?.list?.map((item, index) => ({id: index, ...item})) || []
      setTableList(list)
    })
  }

  // 提交核验信息
  const saveExamineeCheck = (data)=>{
    openNotification({message: "拍照成功,正在上传核验"}, "success", false)
    saveExamineeCheckApi(data).then((res) => {
      const { data={}} = res
      if (res?.code === 0) {
        if (data?.userInfo?.userName===""){
          setNoInformation(true)
        } else{
          setNoInformation(false)
        }
        setCheckedInfo({...data})
        setIsChecked(true) // 已经核验成功
        // 重新获取列表数据
        getListData({idCard:idCardInfo?.certNumber})
        // 如果核验成功,  ====>> 倒计时完毕后 打开读卡器, 关闭摄像头,  清空数据
      } else {
        getListData({idCard:idCardInfo?.certNumber})
      }
    })
  }

  // 1. 左侧 视频抓拍区域
  const renderLeftVision = () => {
    let currentIdNo = idCardInfo?.certNumber // 本次读取身份号码
    // 如果身份证号码存在,  并且与上一次号码不同, 则开始拍照
    if (currentIdNo && currentIdNo!==previousCachedIdNo){
      previousCachedIdNo = idCardInfo?.certNumber
      // @ts-ignore 抓拍照片
      childRef && childRef.current && childRef.current.capturePicture()
    }

    // 身份证 读取结果
    const getReadResult = (res)=>{
      const data = {...res?.data}
      setIdCardInfo(data)
      if (res?.data?.errorMsg){
        // 如果身份证移开过一次, 那么表示,已经没有核验过, 并且如果身份证移开过一次, 把缓存的身份证号也置为 undefined
        setIsChecked(false)
        previousCachedIdNo=undefined
      }
    }

    // 获取拍照返回的结果
    const handleGetCameraResult = (imgUrl) => {
      if (imgUrl){
        setImgUrl(imgUrl)
      }
    }

    // 未查询到考生信息
    const renderNoInformation = ()=>{
      if (isChecked && idCardInfo?.certNumber === previousCachedIdNo) {
      return <div className="no_information_container">
        <div className="no_information_text">未查询到您的考试预约信息</div>
      </div>
      }else {// 否则不显示结果弹框
        return <Fragment></Fragment>
      }
    }

    const renderDialog = ()=>{
      // 如果已经核验成功一次, 并且当前在读的身份证没有移开, 身份证号与缓存号码想通, 那么展示弹框
      if (isChecked && idCardInfo?.certNumber === previousCachedIdNo) {
        return (
          <div style={{zIndex:99999,width:"500px",height:"200px",backgroundColor:`${checkedInfo?.result?.color}`}} className="checked_result">
            <div className="result">
              <div className="top_title">{checkedInfo?.result?.text}</div>
              <div style={{marginTop:"20px"}} className="bottom_text">{checkedInfo?.result?.subText}</div>
            </div>
          </div>
        )
      }else {// 否则不显示结果弹框
        return <Fragment></Fragment>
      }
    }
    // 考生信息结果
    const renderInfomation = ()=>{
      return (
        <div className="information_desc_container" >
          <div className="desc_row">
            <div className="desc_col_left">考生姓名: {checkedInfo?.userInfo?.userName}</div>
            <div className="desc_col_right">预约科目: {checkedInfo?.userInfo?.course}</div>
          </div>
          <div className="desc_row">
            <div className="desc_col_left">报考车型: {checkedInfo?.userInfo?.carType}</div>
            <div className="desc_col_right">业务类型: {checkedInfo?.userInfo?.bizType}</div>
          </div>
          <div className="desc_row">
            <div className="desc_col_full">考场名称: {checkedInfo?.userInfo?.examSite}</div>
          </div>
          <div className="desc_row">
            <div className="desc_col_full">身份证号: {idCardInfo?.certNumber}</div>
          </div>
        </div>
      )
    }
    return (
      <div className="left_vision_container">
        <div className="left_vision_inner">
          <div className="left_vision_camera">
            {/*<FaceMask>*/}
              {!isShowShoting
                ? <div style={{height:"70%",display:"flex",justifyContent:"center",alignItems:"center"}}><Spin spinning={true} tip="正在获取身份信息,请稍后..."></Spin></div>
                : <div style={{position:'relative'}}>
                    <RefedControlledCamera
                      ref={childRef} width={400} height={350} optionProps={idCardInfo}
                      onChange={handleGetCameraResult} >
                      <FaceMask width={250} height={250}></FaceMask>
                    </RefedControlledCamera>
                  {/* 如果核验结果有 text, 并且当前身份证号码扔存在, 显示提示信息 */}
                  {renderDialog()}
                </div> }
            {/*</FaceMask >*/}
          </div>
          <div className="left_vision_desc">
            {noInformation ? renderNoInformation() :renderInfomation()}
          </div>
        </div>
        <IDCardReader initConnect={true} getReadResult={getReadResult}/>
      </div>
    )
  }

  // 2. 右侧列表区域
  const renderRightTable = () => {
    return (
      <div className="right_table_container">
        <TableView
          showTitle={false}
          dataSource={tableList}
          hasPagination={false}
          columns={TABLE_COLUMNS}
          rowKey="createdTime"
        />
      </div>
    )
  }
  // 主渲染逻辑
  return (
    <div className="check_examinee_container">
      {/* 左侧拍照区域*/}
      {renderLeftVision()}
      {/* 右侧列表 */}
      {renderRightTable()}
    </div>
  )
}
export default connect(({}) => ({}))(ExamineeVerify)
