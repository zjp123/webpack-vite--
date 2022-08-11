import React, {Fragment, useEffect, useState} from "react"
import {Form, Button, Input, Modal, Select} from "antd"
import {connect} from "dva"
import {InfoCard, Images, SearchForm, TableView} from "@/components"
import {EXAMINER_DETAIL_COLUMNS} from "./columns"
import CuExaminerModal from "./cuExaminerModal"
import "./index.less"
import replacementPic from "@/components/Replacement"
import {STATE} from "./model"
import {downloadAllStudentListApi} from "@/api/drivingTest"
import {openNotification} from "@/components/OpenNotification"
import {download, downloadFile, getPagation} from "@/utils"
import moment from "moment"
import {COLORFUL_EXAMINATION_STATUS_ARR, IS_SIG_STATUS} from "@/utils/constants"
import bejtu from '@/assets/img/bejtu.png'
import fallback from "@/components/Images/fallback.png"

const ExaminerDetail = ({
                          dispatch,
                          match,
                          examinerInfoCardData,
                          examinerDetailForm,
                          examinerDetailList,
                          searchExaminerStudentForm,
                          examinerStudentList
                        }) => {
  const [form] = Form.useForm()
  const id = match?.params?.id
  const [loading, setLoading] = useState(false)
  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [isRenderExaminerList, setIsRenderExaminerList] = useState(true)
  const [isShowDownloadModal, setIsShowDownloadModal] = useState(false)
  const [downloadParams, setDownloadParams] = useState<any>()

  useEffect(() => {
    getInfoCardData()// 获取infoCard详情数据
    getExaminerListData()
  }, [])

  // 考生名单列表查询
  useEffect(() => {
    if (!isRenderExaminerList) {
      getStudentListData()
    }
    return () => {
    }
  }, [isRenderExaminerList])

  // 获取学员名单列表
  const getStudentListData = async () => {
    setLoading(true)
    await dispatch({
      type: "examinerInformation/getStudentListData",
      payload: {...downloadParams}
    })
    setLoading(false)
  }

  // 获取 infoCard 详情数据
  const getInfoCardData = () => {
    dispatch({
      type: 'examinerInformation/getInfoCardData',
      payload: {id}
    })
  }
  // 获取 考官排期列表数据
  const getExaminerListData = () => {
    dispatch({
      type: 'examinerInformation/getExaminerListData',
      payload: {examinerId: id}
    })
  }

  // 1. 渲染 infocard
  const renderInfoCard = () => {
    return (
      <Fragment>
        <div style={{display: "flex", justifyContent: "space-between", backgroundColor: "#ffffff"}}
             className="examination_detail_container">
          <div style={{height: "50px", lineHeight: "50px", fontSize: "18px", fontWeight: 600}} className="name">
            <span
              style={{marginLeft: "10px"}}>考官信息: {examinerInfoCardData?.name} / 联系方式: {examinerInfoCardData?.tel}</span>
          </div>
        </div>
        <div style={{display: "flex"}}>
          <div style={{flexGrow: 1}} className="left"><InfoCard columns={EXAMINER_DETAIL_COLUMNS}
                                                                data={examinerInfoCardData}/></div>
          <div style={{width: "200px", marginLeft: "5px"}}>
            <div style={{marginLeft: "5px",}}>
              {
                examinerInfoCardData.photo ?
                  replacementPic(examinerInfoCardData?.photo,<Images src={examinerInfoCardData?.photo} enlarge={false} width={200} height={220}/>, {})
                  : <img src={fallback} width={200} height={220}/>
              }
              <div style={{marginTop: "20px"}}>
                <Button type="primary" style={{width: '200px'}}
                        onClick={() => {
                          setIsShowEditModal(true)
                        }}
                >
                  修改考官信息
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isShowEditModal &&
        <CuExaminerModal id={id} isShowEditModal={isShowEditModal} setIsShowEditModal={setIsShowEditModal}/>}
      </Fragment>
    )
  }

  // 2. 监考列表
  const renderExaminerList = () => {
    // 查询区域
    const searchForm = () => {
      return (
        <SearchForm
          form={form}
          components={[
            {
              key: 'course',
              component: (
                <Input placeholder="请选择考试科目" allowClear/>
              )
            },
            {
              key: 'siteStatus',
              component: (
                <Input placeholder="请选择考试科目" allowClear/>
              )
            }
          ]}
          actions={
            <>
              <Button
                onClick={() => {
                  form.resetFields()
                  dispatch({
                    type: 'examinerInformation/save',
                    payload: {
                      examinerDetailForm: STATE.examinerDetailForm
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
              type: 'examinerInformation/save',
              payload: {
                examinerDetailForm: {...examinerDetailForm, pageNum: 1, ...e}
              }
            })
            // getData()
          }}
        />
      )
    }
    // 翻页改变 pagation
    const setPagination = ({pageNum, pageSize}: Result.pageInfo) => {
      dispatch({
        type: 'examinerInformation/save',
        payload: {
          examinerDetailForm: {...examinerDetailForm, pageNum, pageSize}
        }
      })
      getExaminerListData()
    }

    // 导出 excel
    const handleDownloadExcel = () => {
      downloadAllStudentListApi({...downloadParams, ...examinerDetailForm}).then((res) => {
        if (res?.code === 0) {
          openNotification({message: "正在下载,请稍后... ..."}, "info")
          downloadFile(res?.data?.url, {extension: ".xls"})
        }
      })
    }

    const columns = [
      {
        title: '编号',
        // title: () => <CheckedAllButton list={examinationList} itemName="safetyOfficerId" />,
        dataIndex: 'examPlanId',
        render: (text, record, index) => {
          return <span>{(examinerDetailForm.pageNum - 1) * examinerDetailForm.pageSize + index + 1}</span>
        }
      },
      {
        title: '监考日期',
        render: (record) => {
          return moment(record?.examDate).format("YYYY-MM-DD")
        }
      },
      {
        title: '考场名称',
        dataIndex: 'examSiteName',
      },
      {
        title: '监考场次',
        dataIndex: 'examSession',
      },
      {
        title: '监考科目',
        dataIndex: 'examSubject',
      },
      {
        title: '考试状态',
        render: (record) => {
          const item = COLORFUL_EXAMINATION_STATUS_ARR.find((item) => item.examStatus === record?.examStatus)
          return <span style={{color: item?.color}}>{record?.examStatusName}</span>
        }
      },
      {
        title: '考试开启方式',
        dataIndex: 'startTypeName',
      },
      // {
      //   title: '开启考试照片',
      //   dataIndex: 'carTypes1',
      //   render: text => {
      //     return text ? (
      //       replacementPic(text, <Images width={30} height={40} src={text} />, {})
      //     ) : (
      //       <img src={require('@/assets/img/bejtu.png')} style={{ marginRight: 0, width: '30px', height: `40px` }} alt="" />
      //     )
      //   }
      // },
      {
        title: '考官签字',
        dataIndex: 'examinerSignUrl',
        render: text => {
          return text ? (
            replacementPic(text, <Images width={30} height={40} src={text}/>, {})
          ) : (
            <img src={bejtu} style={{marginRight: 0, width: '30px', height: `40px`}}
                 alt=""/>
          )
        }
      },
      {
        title: '预约人数/考试人数',
        dataIndex: 'preasignCount',
        width: 180,
        render: (text, record) => {
          return text + '/' + record?.examCount
        }
      },
      {
        title: '学员预约考试名单',
        dataIndex: 'stubDeviceCount3',
        width: 220,
        // fixed:"right",
        render: (text, record) => {
          return (
            <Fragment>
              <Button
                type="link"
                onClick={() => {
                  setIsRenderExaminerList(false)
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

    return (
      <div style={{backgroundColor: "#ffffff", marginTop: "5px"}}>
        <div style={{display: "flex", justifyContent: "space-between"}} className="examination_detail_container">
          <div style={{height: "40px", lineHeight: "40px", fontSize: "18px", fontWeight: 600}} className="name">
            <span style={{marginLeft: "10px"}}>监考列表 </span>
          </div>
        </div>
        <div style={{marginTop: "-10px"}} className="table_container">
          <TableView
            pageProps={{
              getPageList: setPagination,
              pagination: getPagation(examinerDetailForm)
            }}
            showTitle={false}
            dataSource={examinerDetailList}
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
            <Button key="default" type="default" onClick={() => {
              setIsShowDownloadModal(false)
            }}>取消</Button>,
          ]}
          onCancel={() => {
            setIsShowDownloadModal(false)
          }}
        >
          <div>
            <span style={{fontWeight: 600}}> 您确定要导出 </span>
            <span style={{color: "blue", textDecoration: "underline", cursor: "pointer"}} onClick={handleDownloadExcel}>
             五八驾考科目一考场 2022-01-18 上午场的考生名单?
           </span>
          </div>
          <div>导出后请做好考生信息保密工作。</div>
        </Modal>
      </div>
    )
  }

  // 3. 考生名单列表
  const renderStudentList = () => {
    // 查询区域
    const searchForm = () => {
      return (
        <SearchForm
          form={form}
          components={[
            {
              key: 'name',
              component: (
                <Input placeholder="姓名/身份证号码" allowClear/>
              )
            },
            {
              key: 'isSign',
              component: (
                <Select placeholder="请选择签字状态" allowClear>
                  {IS_SIG_STATUS.map(({value, label}) => {
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
                    type: 'examinerInformation/save',
                    payload: {
                      searchExaminerStudentForm: STATE.searchExaminerStudentForm
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
                  setIsRenderExaminerList(true)
                  dispatch({
                    type: 'examinerInformation/save',
                    payload: {
                      searchExaminerStudentForm: {...STATE.searchExaminerStudentForm}
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
              type: 'examinerInformation/save',
              payload: {
                searchExaminerStudentForm: {...searchExaminerStudentForm, pageNum: 1, ...e}
              }
            })
            getStudentListData()
          }}
        />
      )
    }

    // 翻页改变 pagation
    const setPagination = ({pageNum, pageSize}: Result.pageInfo) => {
      dispatch({
        type: 'examinerInformation/save',
        payload: {
          searchExaminerStudentForm: {...searchExaminerStudentForm, pageNum, pageSize}
        }
      })
      getStudentListData()
    }

    const columns = [
      {
        title: '编号',
        // title: () => <CheckedAllButton list={examinationList} itemName="safetyOfficerId" />,
        dataIndex: 'examPlanId',
        render: (text, record, index) => {
          return <span>{(searchExaminerStudentForm.pageNum - 1) * searchExaminerStudentForm.pageSize + index + 1}</span>
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
          return <span style={{color: item?.color}}>{record?.examStatusName}</span>
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
        width: 150
      },
      {
        title: '成绩单',
        dataIndex: 'url',
        render: text => {
          return text ? (
            replacementPic(text, <Images width={30} height={40} src={text}/>, {})
          ) : (
            <img src={bejtu} style={{marginRight: 0, width: '30px', height: `40px`}}
                 alt=""/>
          )
        }
      },
      {
        title: '所属驾校',
        dataIndex: 'schoolName',
      },
    ]

    return (
      <div style={{backgroundColor: "#ffffff", marginTop: "5px"}}>
        <div style={{display: "flex", justifyContent: "space-between"}} className="examination_detail_container">
          <div style={{height: "40px", lineHeight: "40px", fontSize: "18px", fontWeight: 600}} className="name">
            <span style={{marginLeft: "10px"}}>考场名称: {downloadParams?.examSiteName} </span>
            <span style={{marginLeft: "10px"}}>考试日期: {moment(downloadParams?.examDate).format("YYYY-MM-DD")} </span>
            <span style={{marginLeft: "10px"}}>考试车型: {downloadParams?.examType} </span>
          </div>
        </div>
        <div style={{marginTop: "-10px"}} className="table_container">
          <TableView
            pageProps={{
              getPageList: setPagination,
              pagination: getPagation(searchExaminerStudentForm)
            }}
            showTitle={false}
            dataSource={examinerStudentList}
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
    <div style={{height: "100%", backgroundColor: "#f9f9f9"}}>
      {renderInfoCard()}
      {isRenderExaminerList ? renderExaminerList() : renderStudentList()}
    </div>
  )
}
export default connect(({examinerInformation}) => ({
  examinerInfoCardData: examinerInformation.examinerInfoCardData, // 考官详情 数据
  examinerDetailForm: examinerInformation.examinerDetailForm,
  examinerDetailList: examinerInformation.examinerDetailList,
  searchExaminerStudentForm: examinerInformation.searchExaminerStudentForm,
  examinerStudentList: examinerInformation.examinerStudentList,
}))(ExaminerDetail)


