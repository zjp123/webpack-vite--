import React, { Fragment, useEffect, useState } from "react"
import { connect } from "dva"
import { TableView, WhiteCard, FaceRecognition, HWHttpSignature } from "@/components"
import { Button, Col, Form, Input, message, Modal, Row } from "antd"
import { getPagation, moment2String } from "@/utils"
import { COLORFUL_EXAMINATION_STATUS_ARR, FORMITEM_LAYOUT } from "@/utils/constants"
import SuccessModal from "./cuSuccessModal"
import "./index.less"
import { getRandomUniqueId } from "@/utils/publicFunc"

const { Item } = Form
const Confirm = Modal.confirm

const Manage = ({ dispatch, isShowCurrentContent, manageList, isShowFailedModal, isShowSuccessModal, isShowFaceRecognition, isShowSignature, searchmanageForm }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 当前要开启考试的记录 id examId
  const [startId, setStartId] = useState()
  // 人脸认证成功后返回的 signId
  const [signId, setSignId] = useState()
  // 签完字的 signPic 图片
  const [signPic, setSignPic] = useState("")
  // 考试开启方式
  const [startType, setStartType] = useState(0)
  // 是否通过人脸识别方式 打开认证成功列表
  const [openSuccessModalByFaceRecognition] = useState(true)

  useEffect(() => {
    getData()
    return () => {
      dispatch({
        type: "manage/save",
        payload: {
          searchmanageForm: { // 考生管理form
            pageNum: 1,
            pageSize: 10
          },
          isShowCurrentContent: true, // 考官管理表格列表
          isShowFaceRecognition: false, // 是否显示人脸识别框
          isShowSignature: false, // 是否显示签字框
          isShowFailedModal: false, // 是否显示认证失败对话框
          isShowSignModal: false, // 密码验证成功后,显示签名板
          isShowSuccessModal: false // 认证成功对话框
        }
      })
    }
  }, [])

  //获取考试管理列表数据
  const getData = async () => {
    setLoading(true)
    await dispatch({
      type: "manage/loadManageList"
    })
    setLoading(false)
  }


  // 当前 考试管理列表
  const renderExaminationContent = () => {
    // 改变pagation
    const setPagation = ({ pageNum, pageSize }: Result.pageInfo) => {
      dispatch({
        type: "manage/save",
        payload: {
          searchmanageForm: { ...searchmanageForm, pageNum, pageSize }
        }
      })
      getData()
    }

    const columns = [
      {
        title: "序号",
        width: 60,
        render: (text, record, index) => {
          return <span>{(searchmanageForm.pageNum - 1) * searchmanageForm.pageSize + index + 1}</span>
        }
      },
      {
        title: "监考时间",
        width: 120,
        dataIndex: "examDate",
        render: (text) => moment2String(text, "YYYY-MM-DD")
      },
      {
        title: "考试开启时间",
        width: 120,
        dataIndex: "examStartTime"
      },
      {
        title: "考试结束时间",
        width: 120,
        dataIndex: "examEndTime"
      },
      {
        title: "考试状态",
        width: 80,
        render: (record) => {
          const item = COLORFUL_EXAMINATION_STATUS_ARR.find((item) => item.examStatus === (record?.examStatus).toString())
          return <span style={{color:item?.color}}>{item?.label}</span>
        }
      },
      {
        title: "考官姓名",
        dataIndex: "examinerName",
        width: 100
      },
      {
        title: "考场身份",
        dataIndex: "examinerDuty",
        width: 80
      },
      {
        title: "考场名称",
        dataIndex: "examSiteName",
        width: 140
      },
      {
        title: "考试车型",
        dataIndex: "examType",
        width: 100
      },
      {
        title: "考试场次",
        dataIndex: "examSession",
        width: 80
      },
      {
        title: "开启/结束考试",
        width: 200,
        render: (text, record) => {
          return (
            <Fragment>
              <Button
                type="link"
                disabled={!(record?.examStatus === 0)}
                onClick={() => {
                  setStartId(text?.id)
                  dispatch({
                    type: "manage/save",
                    payload: {
                      isShowCurrentContent: false, // 隐藏表格列表
                      isShowFaceRecognition: true, // 打开人脸识别框
                      examinationSiteList: [{
                        id: text?.id,
                        examSiteName: text?.examSiteName,
                        examDate: text?.examDate,
                        examinerName: text?.examinerName
                      }],
                      startOrCloseData: {
                        id: text?.id
                      }
                    }
                  })
                }}>开启考试</Button>
              <Button
                type="link"
                disabled={!(record?.examStatus === 1)}
                onClick={() => {
                  Confirm({
                    title: "关闭考试!",
                    content: "是否确认关闭当前记录考试?",
                    okText: "确认",
                    cancelText: "取消",
                    onOk: () => {
                      dispatch({
                        type: "manage/startOrCloseExamination",
                        payload: {
                          id: text?.id,
                          examStatus: 0  // 开启或关闭考试, 1 用来开启,  0 用来结束
                        }
                      }).then((res) => {
                        message.success(res?.msg)
                      })
                    }
                  })

                }}>结束考试</Button>
            </Fragment>
          )
        }
      }
    ]

    return <Fragment>
      <TableView
        pageProps={{
          getPageList: setPagation,
          pagination: getPagation(searchmanageForm)
        }}
        showTitle={false}
        dataSource={manageList}
        columns={columns as any}
        rowKey={getRandomUniqueId(16)}
        loading={loading}
      />
    </Fragment>
  }

  // 人脸识别拍照
  const renderFaceRecognition = () => {
    // 注意!! 点击输入密码查询的时候, 应该关闭摄像头 认证流程...
    const handleInputPwd = () => {
      dispatch({
        type: "manage/save",
        payload: {
          isShowCurrentContent: false, // 关闭列表
          isShowFaceRecognition: false, // 关闭摄像头页
          isShowFailedModal: true // 打开输入身份证框
        }
      })
    }

    // 通过人脸识别的方式 打开认证成功列表
    const showSuccessModalByFaceRecognition = () => {
      dispatch({
        type: "manage/save",
        payload: {
          isShowSuccessModal: true
        }
      })
    }
    return <Fragment>
      <div className="face_recognize_container" style={{ textAlign: "center" }}>
        {/*<img style={{ display: "inline-block" }} src={FaceMask} alt=""/>*/}
        <div className="face_recognize_camera">
          {/*人脸识别结果 框 */}
          <FaceRecognition isShowCountDown={true} examId={startId} onChange={(res) => {
            // res {currectFaceUri: '/file/5a10cac8c0c94ed1983308cfa82aa5e8.jpeg', result: 1, signId: 92}
            // signId 人脸对比结果返回的 id, 作为签字时的 参数
            setSignId(res?.signId)
            setStartType(0) // 考试开启方式 人脸开启
            if (res?.result === 1) { // 人脸认证成功
              showSuccessModalByFaceRecognition()
            } else if (res?.result === 0) { // 人脸认证失败
              dispatch({
                type: "manage/save",
                payload: {
                  isShowCurrentContent: false, // 关闭列表
                  isShowFaceRecognition: false, // 关闭摄像头页
                  isShowFailedModal: true // 打开输入身份证框
                }
              })
            }
          }}/>
          <div className="face_recognize_desc">
            <div className="face_recognize_suggest">请正对摄像头,确保采集照片面部清晰,</div>
            <div className="face_recognize_finish">摄像头完成抓拍采集, 完成拍照</div>
            <span className="face_recognize_pwd" onClick={handleInputPwd}> 拍照并输入密码解锁  </span>
          </div>
        </div>
      </div>
    </Fragment>
  }

  //  签字页
  const renderSignature = () => {

    // 1. 签字保存
    const handleSaveSignature = (res) => {

    }
    // 确认签字 开启考试
    // 确认签字 1. 保存签字 2. 然后开启考试
    const handleConfirmSignature = () => {

      // id 排期id examStatus : 考试开启状态 1开启，0关闭 // startType 考试开启方式 0人像，1密码  考试状态为 1 时必传
      // 1. 保存签字
      dispatch({ // 考官签字保存
        type: "manage/saveSigned",
        payload: {
          signId, // 人脸识别返回的 id, 必传
          signPic: signPic
        }
      }).then((res) => {
        if (res.code === 0) {
          // 2. 开启考试
          startOrCloseExamination()
        } else {
          message.error(res?.msg)
        }
      })

      const startOrCloseExamination = () => {
        dispatch({
          type: "manage/startOrCloseExamination",
          payload: {
            id: startId, // 当前要开启的考试id
            examStatus: 1,
            startType
          }
        }).then((res) => {
          if (res?.code === 0) {// 最终成功开启考试
            dispatch({
              type: "manage/save",
              payload: {
                isShowSignature: false, // 关闭签字页面
                isShowCurrentContent: true // 打开列表页
              }
            })
          }
        })
      }
    }
    return (
      <div className="manage_signature_container">
        <div className="signature_machine">
          <HWHttpSignature
            delay={1500}
            getSignedResult={(res) => {
              res && setSignPic(res) // 签字图片的结果
            }}
          >
            <div
              style={{
                width: "250px",
                height: "40px",
                lineHeight: "40px",
                fontSize: "30px",
                backgroundColor: "green",
                color: "#ffffff",
                margin: "0 auto",
                cursor: "pointer",
                textAlign: "center"
              }}
              onClick={handleConfirmSignature}
            >
              确认签字
            </div>
          </HWHttpSignature>
        </div>
      </div>
    )
  }

  // 人脸认证失败 输入身份证号
  const renderFailedInput = () => {
    // 验证密码确认
    const handleFailedOk = () => {
      form.validateFields().then(async (res) => {
        setStartType(1) // 考试开启方式 密码开启
        dispatch({
          type: "manage/checkPwd",
          payload: {
            ...res,
            examId: startId
          }
        }).then((res) => {  // 验证密码成功 查看考试列表
          if (res?.code === 0) {
            dispatch({
              type: "manage/save",
              payload: {
                isShowFailedModal: false,
                isShowSuccessModal: true
              }
            })
          }
        })
      })
    }

    // 取消验证密码
    const handleFailedCancel = () => {
      // console.log("取消验证密码")
      dispatch({
        type: "manage/save",
        payload: {
          isShowCurrentContent: true, // 打开列表
          isShowFaceRecognition: false, // 关闭摄像头页
          isShowFailedModal: false // 关闭输入身份证框
        }
      })
    }

    return (
      <Modal
        title=''
        visible={isShowFailedModal}
        destroyOnClose
        width="30%"
        onOk={handleFailedOk}
        onCancel={handleFailedCancel}
      >
        <Fragment>
          <div className="failed_conatiner">
            <div className="i_failed">
              !
            </div>
            <div className="description">
              <p>人脸识别失败,抱歉没有认出您来</p>
              <p>刷脸登录只能由本人操作，您可以尝试输入账号登录密码解锁</p>
            </div>
            <div className="form_container">
              <Form
                layout='horizontal'
                form={form}
                colon={false}
                autoComplete="off"
                initialValues={{}}
              >
                <Row>
                  <Col span={24}>
                    <Item  {...FORMITEM_LAYOUT} name="password" label=""
                           rules={[{ required: true, message: "请输入密码" }]}
                    >
                      <Input style={{ width: "220px" }} type="password" className="form_container_input"
                             placeholder="请输入密码"
                             maxLength={11}/>
                    </Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Fragment>
      </Modal>
    )
  }
  return (
    <WhiteCard>
      <div className="examination_manage_container">
        {/* 1. 考试管理列表 */}
        {isShowCurrentContent && renderExaminationContent()}

        {/* 2.人脸识别内容区域 */}
        {isShowFaceRecognition && renderFaceRecognition()}

        {/* 3. 认证成功框  */}
        {isShowSuccessModal && <SuccessModal startId={startId}/>}

        {/* 4. 认证成功 去签字*/}
        {isShowSignature && renderSignature()}

        {/* 5. 人脸识别失败 输入身份证号*/}
        {isShowFailedModal && renderFailedInput()}
      </div>
    </WhiteCard>
  )
}
export default connect(({ manage }) => ({
  manageList: manage.manageList,
  searchmanageForm: manage.searchmanageForm,
  isShowFaceRecognition: manage.isShowFaceRecognition,
  isShowFailedModal: manage.isShowFailedModal,
  isShowSuccessModal: manage.isShowSuccessModal,
  isShowSignModal: manage.isShowSignModal,
  isShowCurrentContent: manage.isShowCurrentContent,
  isShowSignature: manage.isShowSignature
}))(Manage)


