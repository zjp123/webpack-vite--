import React, { Fragment, useEffect, useState } from "react"
import { Button,Form, Input, Modal, Select  } from "antd"
import { connect } from "dva"
import {InfoCard, TableView, SearchForm, Images} from "@/components"
import { EXAMINATION_ROOM_COLUMNS } from "./columns"
import CuCoachCarinforModal from "./cuCoachCarinforModal"
import { downloadFileByUrl, getPagation } from "@/utils"
import { STATE } from "@/pages/DrivingTest/examinationRoom/model"
import bejtu from '@/assets/img/bejtu.png'
import {
  COLORFUL_EXAMINATION_STATUS_ARR,
  FORMITEM_LAYOUT,
  NAME_REGEXP,
  ROMM_STATUS,
  TEL_REGEXP
} from "@/utils/constants"
import { downloadAllStudentListApi } from "@/api/drivingTest"
import { openNotification } from "@/components/OpenNotification"
import moment from "moment"
import { store } from "@/store"
import replacementPic from "@/components/Replacement";


const ExaminationRoom = (props) => {
  const { dispatch, match,searchExaminationPlanForm,searchExaminationStudentForm, examinationPlanList,isCoachModalVisible,examinationPlanStudentList, infoCardData }=props
  const id = match?.params?.id
  const [loading, setLoading] = useState(false)
  const [isRenderExaminationPlanList,setIsRenderExaminationPlanList]=useState(true)
  const [form] = Form.useForm()
  const [isShowDownloadModal,setIsShowDownloadModal]= useState(false)
  const [downloadParams,setDownloadParams]= useState<any>()
  const { storeData = {} } = store.getState()
  let { fileDomainUrl } = storeData

  useEffect(() => {
    getInfoCardData()// 获取infoCard详情数据
    getExaminationPlanListData()
  }, [])

  // 考生名单列表查询
  useEffect(()=>{
   if (!isRenderExaminationPlanList) {
     getStudentListData()
   }
    return()=>{
    }
  },[isRenderExaminationPlanList])

  // 获取infoCard 详情数据
  const getInfoCardData = ()=>{
    dispatch({
      type: 'examinationRoom/getInfoCardData',
      payload: {id}
    })
  }

  // 获取考场考试计划列表
  const getExaminationPlanListData = async ()=>{
    await dispatch({
      type: "examinationRoom/getExaminationPlanListData",
      payload: { examSiteId: match.params.id }
    })
  }

  // 获取 考生名单列表
  const getStudentListData = async ()=>{
    setLoading(true)
    await dispatch({
      type: "examinationRoom/getStudentListData",
      payload: { ...downloadParams }
    })
    setLoading(false)
  }

  // 1. 考场名称详情
  const renderInfoCard=()=>{
    return(
      <Fragment>
        <div style={{display:"flex",justifyContent:"space-between",backgroundColor:"#ffffff"}} className="examination_detail_container">
          <div style={{height:"50px", lineHeight:"50px",fontSize:"18px",fontWeight:600}} className="name">
            <span style={{marginLeft:"10px"}}>考场名称: {infoCardData?.name}</span>
          </div>
          <div style={{height:"50px", lineHeight:"50px",fontSize:"18px"}}>
            <Button
              htmlType="submit"
              onClick={() => {
                dispatch({
                  type: "examinationRoom/save",
                  payload: {
                    isCoachModalVisible: true
                  }
                })
              }}
            >
              修改考场信息
            </Button>
            {isCoachModalVisible && <CuCoachCarinforModal id={id}/>}
          </div>
        </div>
        <InfoCard columns={EXAMINATION_ROOM_COLUMNS} data={infoCardData}/>
      </Fragment>
    )
  }

  // 2. 考场考试计划列表
  const renderExaminationPlanList = ()=>{
    // 查询区域
    const searchForm = () => {
      return (
        <SearchForm
          form={form}
          components={[
            {
              key: 'course',
              component: (
                <Input placeholder="请选择考试科目" allowClear />
              )
            },
            {
              key: 'siteStatus',
              component: (
                <Input placeholder="请选择考试科目" allowClear />
              )
            }
          ]}
          actions={
            <>
              <Button
                onClick={() => {
                  form.resetFields()
                  dispatch({
                    type: 'examinationRoom/save',
                    payload: {
                      searExaminationRoomForm: STATE.searExaminationRoomForm
                    }
                  })
                  // getData()
                }}
              >
                重置
              </Button>
              {/*<DownloadButton>导出监考记录</DownloadButton>*/}
            </>
          }
          handleSearch={e => {
            dispatch({
              type: 'examinationRoom/save',
              payload: {
                // searExaminationRoomForm: { ...searExaminationRoomForm, pageNum: 1, ...e }
              }
            })
            // getData()
          }}
        />
      )
    }

    // 翻页改变pagation
    const setPagination = ({ pageNum, pageSize }: Result.pageInfo) => {
      dispatch({
        type: 'examinationRoom/save',
        payload: {
          searchExaminationPlanForm: { ...searchExaminationPlanForm, pageNum, pageSize }
        }
      })
      getStudentListData()
    }

    // 导出 excel
    const handleDownloadExcel = ()=>{
      downloadAllStudentListApi({...downloadParams,...searchExaminationPlanForm}).then((res)=>{
       if (res?.code===0){
         const filename = `${downloadParams?.examSiteName}-${moment(downloadParams?.examDate || "").format("YYYY-MM-DD")}`
         downloadFileByUrl(`${fileDomainUrl}${res?.data?.url}`,{filename})
         setIsShowDownloadModal(false)
       }
      }).catch((err)=>{
        openNotification({message:err?.msg},"error")
      })
    }

    const columns = [
      {
        title: '编号',
        // title: () => <CheckedAllButton list={examinationList} itemName="safetyOfficerId" />,
        dataIndex: 'examPlanId',
        render: (text, record, index) => {
          return <span>{(searchExaminationPlanForm.pageNum - 1) * searchExaminationPlanForm.pageSize + index + 1}</span>
        }
      },
      {
        title: '计划考试日期',
        dataIndex: 'examDate'
      },
      {
        title: '考试场次',
        dataIndex: 'examSession',
      },
      {
        title: '考场考官',
        dataIndex: 'examPlanExaminer',
      },
      {
        title: '考试状态',
        render: (record) => {
          const item = COLORFUL_EXAMINATION_STATUS_ARR.find((item) => item.examStatus === record?.examStatus)
          return <span style={{color:item?.color}}>{record?.examStatusName}</span>
        }
      },
      {
        title: '考试开启方式',
        dataIndex: 'startTypeName',
      },
      {
        title: '开启考试考官照片',
        dataIndex: 'examinerSignphoto',
        width: 160,
        render: text => {
          return text ? (
            replacementPic(text, <Images width={30} height={40} src={text} />, {})
          ) : (
            <img src={bejtu} style={{ marginRight: 0, width: '30px', height: `40px` }} alt="" />
          )
        }
      },
      {
        title: '预约人数/考试人数',
        dataIndex: 'preasignCount',
        width:180,
        render: (text, record, index) => {
          return text + '/' + record?.examCount
        }
      },
      {
        title: '学员预约考试名单',
        dataIndex: 'stubDeviceCount3',
        width: 250,
        render: (text, record) => {
          return (
         <Fragment>
           <Button
             type="link"
             onClick={() => {
               setIsRenderExaminationPlanList(false)
               setDownloadParams({...record})
             }}
           >
             考生名单
           </Button>
           <Button
             type="link"
             onClick={() => {
               setIsShowDownloadModal(true)
               setDownloadParams({...record})
             }}
           >
             导出全部名单
           </Button>
         </Fragment>
          )
        }
      }
    ]

    /** 考场考试计划列表  */
    return (
      <div style={{backgroundColor:"#ffffff",marginTop:"5px"}}>
        <div style={{display:"flex",justifyContent:"space-between"}} className="examination_detail_container">
          <div style={{height:"40px", lineHeight:"40px",fontSize:"18px",fontWeight:600}} className="name">
            <span style={{marginLeft:"10px"}}>考场考试计划 </span>
          </div>
        </div>
        <div style={{marginTop:"-10px"}} className="table_container">
          <TableView
            pageProps={{
              getPageList: setPagination,
              pagination: getPagation(searchExaminationPlanForm)
            }}
            showTitle={false}
            dataSource={examinationPlanList}
            // search={searchForm()}
            columns={columns as any}
            rowKey="examPlanId"
            loading={loading}
          />
        </div>

        <Modal
          title="导出考生名单"
          visible={isShowDownloadModal}
          width={400}
          confirmLoading={loading}
          footer={[
            <Button key="primary" type="primary" onClick={handleDownloadExcel}>导出excel格式</Button>,
            <Button key="default" type="default"  onClick={()=>{ setIsShowDownloadModal(false)}}>取消</Button>,
          ]}
          onCancel={() => {
            setIsShowDownloadModal(false)
          }}
        >
         <div>
           <span style={{fontWeight:600}}> 您确定要导出 </span>
           <span style={{color:"blue",textDecoration:"underline",cursor:"pointer"}} onClick={handleDownloadExcel}>
             {downloadParams?.examSiteName}
             {moment(downloadParams?.examDate || "").format("YYYY-MM-DD")}日
             {downloadParams?.examSession}场的考生名单?
           </span>
         </div>
          <div>导出后请做好考生信息保密工作。</div>
        </Modal>
      </div>
    )
  }

  // 3. 考生名单列表
  const renderStudentList = ()=>{

    // 查询区域
    const searchForm = () => {
      return (
        <SearchForm
          form={form}
          components={[
            {
              key: 'name',
              component: (
                <Input placeholder="姓名/身份证号码" allowClear />
              )
            },
            {
              key: 'isSign',
              component: (
                <Select placeholder="请选择签字状态" allowClear>
                  {[{value: '1', label: '已签名'}, {value: '0', label: '未签名'}]
                    .map(({ value, label }) => {
                    return (
                      <Select.Option value={value} key={value}>
                        {label}
                      </Select.Option>
                    )
                  })}
                </Select>
              )
            }
          ]}
          actions={
            <>
              <Button
                onClick={() => {
                  form.resetFields()
                  dispatch({
                    type: 'examinationRoom/save',
                    payload: {
                      searchExaminationStudentForm: STATE.searchExaminationStudentForm
                    }
                  })
                  getStudentListData()
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsRenderExaminationPlanList(true)
                  dispatch({
                    type: 'examinationRoom/save',
                    payload: {
                      searchExaminationStudentForm: {...STATE.searchExaminationStudentForm}
                    }
                  })
                  form.resetFields()
                }}
              >
                返回
              </Button>
              {/*<DownloadButton>导出监考记录</DownloadButton>*/}
            </>
          }
          handleSearch={e => {
            dispatch({
              type: 'examinationRoom/save',
              payload: {
                searchExaminationStudentForm: { ...searchExaminationStudentForm, pageNum: 1, ...e }
              }
            })
           getStudentListData()
          }}
        />
      )
    }

    // 翻页改变pagation
    const setPagination = ({ pageNum, pageSize }: Result.pageInfo) => {
      dispatch({
        type: 'examinationRoom/save',
        payload: {
          searchExaminationStudentForm: { ...searchExaminationStudentForm, pageNum, pageSize }
        }
      })
      // getData()
    }

    const columns = [
      {
        title: '编号',
        // title: () => <CheckedAllButton list={examinationList} itemName="safetyOfficerId" />,
        dataIndex: 'examPlanId',
        render: (text, record, index) => {
          return <span>{(searchExaminationStudentForm.pageNum - 1) * searchExaminationStudentForm.pageSize + index + 1}</span>
        }
      },
      {
        title: '学员姓名',
        dataIndex: 'name'
      },
      {
        title: '身份证号码',
        dataIndex: 'idcard',
      },
      {
        title: '考试状态',
        render: (record) => {
          const item = COLORFUL_EXAMINATION_STATUS_ARR.find((item) => item.examStatus === record?.examStatus)
          return <span style={{color:item?.color}}>{item?.label}</span>
        }
      },
      {
        title: '报名考试时间',
        dataIndex: 'preasignDate',
      },
      {
        title: '开启考试时间',
        dataIndex: 'startExamTime',
      },
      {
        title: '考试结束时间',
        dataIndex: 'endExamTime',
      },
      {
        title: '考试成绩',
        dataIndex: 'preliminaryScore',
      },
      {
        title: '补考成绩',
        dataIndex: 'reExaminationScore',
      },
      {
        title: '考试结果',
        dataIndex: 'examResultName',
      },
      {
        title: '成绩单是否签字',
        dataIndex: 'isSignName',
        width:150
      },
      {
        title: '成绩单',
        dataIndex: 'url',
        render: text => {
          return text ? (
            replacementPic(text, <Images width={30} height={40} src={text} />, {})
          ) : (
            <img src={bejtu} style={{ marginRight: 0, width: '30px', height: `40px` }} alt="" />
          )
        }
      },
      {
        title: '所属驾校',
        dataIndex: 'schoolName',
      },
    ]

    return (
      <div style={{backgroundColor:"#ffffff",marginTop:"5px"}}>
        <div style={{display:"flex",justifyContent:"space-between"}} className="examination_detail_container">
          <div style={{height:"40px", lineHeight:"40px",fontSize:"18px",fontWeight:600}} className="name">
            <span style={{marginLeft:"10px"}}>考试日期: {} </span>
          </div>
        </div>
        <div style={{marginTop:"-10px"}} className="table_container">
          <TableView
            pageProps={{
              getPageList: setPagination,
              pagination: getPagation(searchExaminationStudentForm)
            }}
            showTitle={false}
            dataSource={examinationPlanStudentList}
            search={searchForm()}
            columns={columns as any}
            rowKey="id"
            loading={loading}
          />
        </div>
      </div>
    )
  }

  return (
  <div style={{height:"100%", backgroundColor:"#f9f9f9"}}>
    {renderInfoCard()}
    { isRenderExaminationPlanList ? renderExaminationPlanList(): renderStudentList()}
  </div>
  )
}
export default connect(({ examinationRoom }) => ({
  searchExaminationPlanForm: examinationRoom.searchExaminationPlanForm,
  isCoachModalVisible: examinationRoom.isCoachModalVisible,
  searchExaminationStudentForm: examinationRoom.searchExaminationStudentForm,
  infoCardData: examinationRoom.infoCardData,
  examinationPlanList: examinationRoom.examinationPlanList,
  examinationPlanStudentList: examinationRoom.examinationPlanStudentList,
}))(ExaminationRoom)


