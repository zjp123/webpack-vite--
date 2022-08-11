import React, { useState, useEffect } from "react"
import { Form, Row, Col, Modal, Select, DatePicker } from "antd"
import { connect } from "dva"
import { FORMITEM_LAYOUT } from "@/utils/constants"
import moment from "moment"
import { getDict } from "@/utils/publicFunc"
import { Images } from "@/components"
import { getExaminerArrangementApi } from "@/api/examiner"

const { Item } = Form
const { Option } = Select

const CuEditExaminerModal = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  // currentRowData 点击本厂考官时, 被点击的那行数据 / planId 排期 的id
  let { dispatch, currentRowData, planId, isShowAddOrEditExaminerModal, title } = props
  let { invList, examSessionList, courseList, perdritypeList, examinationSiteList, examinerList } = props
  let examSiteId = { id: currentRowData?.id, value: currentRowData?.examSiteId, label: currentRowData?.examSiteName }
  const [chiefPhoto, setChiefPhoto] = useState("")
  const [assistPhoto, setAssistPhoto] = useState("")
  let [chiefExaminerDetailId, setChiefExaminerDetailId] = useState({}) // 查询的主考 id
  let [assistExaminerDetailId, setAssistExaminerDetailId] = useState({}) // 查询的副 id

  invList = invList?.map((item) => {
    return {
      ...item,
      id: item?.id,
      value: item?.value,
      label: `${item?.label} (身份证号： ${item?.customData?.idCard}) 监考车型:${item?.customData?.applicableModels}`
    }
  })

  // 新增考官
  useEffect(() => {
    // 根据 id 查询考官信息
    getExaminerDetail()
    getDicts()
  }, [])

  const getExaminerDetail = async () => {
    if (planId) {
      let res: any = await getExaminerArrangementApi({ id: planId })
      const { examiners: examinersArr = [] } = res?.data

      // 主考官
      let chiefExaminer = examinersArr?.find((item) => item.examinerDuty === 0)
      setChiefExaminerDetailId(chiefExaminer?.id) // 查询返回的主考官信息
      // 副考官
      let assistExaminer = examinersArr?.find((item) => item.examinerDuty === 1)
      setAssistExaminerDetailId(assistExaminer?.id) // 查询返回的副考官信息
      const chiefExaminerId = { id: chiefExaminer?.id, value: chiefExaminer?.examinerId }
      const assistExaminerId = { id: assistExaminer?.id, value: assistExaminer?.examinerId }

      chiefExaminerId && handleChiefChange(chiefExaminerId) // 根据值,更新主考官图片
      assistExaminerId && handleAssistChange(assistExaminerId) // 根据值,更新副考官图片

      form.setFieldsValue({
        ...currentRowData,
        examSiteId,
        chiefExaminerId,
        assistExaminerId,
        examDate: moment(currentRowData?.examDate)
      })
    } else {
      form.resetFields()
    }
  }
  const getDicts = () => {
    let dictsArr = ["examSession", "course", "perdritype"]
    dictsArr.forEach((item) => {
      getDict(dispatch, item, {})
    })
  }

  // 主考官发生变化时触发
  const handleChiefChange = async (val) => {
    console.log("主考官 ===>",val);
    const photoUrl = invList.find((item) => item.value === val?.value)?.photoUrl || ""
    setChiefPhoto(photoUrl)
  }

  // 主考官搜索
  const handleChiefSearch = async (val) => {
  }

  // 副考官发生变化时触发
  const handleAssistChange = async (val) => {
    console.log("副考官 ===>",val);
    const photoUrl = invList.find((item) => item.value === val?.value)?.photoUrl || ""
    setAssistPhoto(photoUrl)
  }
  // 副考官搜索
  const handleAssistSearch = async (val) => {
  }

  // 查询考场列表
  const handleSearchExam = async (val) => {
    await dispatch({
      type: "order/getExaminationSite",
      payload: {
        exsName: val
      }
    })
  }

  // 筛选考官
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  const handleOnOk = () => {
    form.validateFields().then(async (res) => {
      let examiners = [
        {
          id: chiefExaminerDetailId,
          examPlanId: planId,
          examinerId: res.chiefExaminerId?.value,
          examinerDuty: 0,
          examinerType: 0
        },
        {
          id: assistExaminerDetailId,
          examPlanId: planId,
          examinerId: res.assistExaminerId?.value,
          examinerDuty: 1,
          examinerType: 0
        }]
        .filter((item) => item.examinerId)
      let data: any = {
        id: planId,
        examiners
      }
      delete data.chiefExaminerId
      delete data.assistExaminerId
      setLoading(true)
      data = title === "新增" ? data : { id: currentRowData?.id, title, ...res }
      setLoading(true)
      try {
        await dispatch({
          type: "order/addArrangement",
          payload: data
        }).then((res) => {
          if (res?.code === 0) { // 更新成功
            handleOnCancel()
            // 更新考官列表
            props.getExaminerList && props.getExaminerList()
          }
        })
      } catch (err) {
        setLoading(false)
      }
    })
  }
  const handleOnCancel = () => {
    dispatch({
      type: "order/save",
      payload: {
        isShowAddOrEditExaminerModal: false
      }
    })
  }
  return (
    <Modal
      title={`${title}考官`}
      visible={isShowAddOrEditExaminerModal}
      width="50%"
      confirmLoading={loading}
      onOk={handleOnOk}
      onCancel={handleOnCancel}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
        initialValues={{}}
      >
        <Row>
          <Col span={12}>
            <Item
              {...FORMITEM_LAYOUT}
              rules={[{ required: true, message: "考场名称" }]}
              name="examSiteId" label="考场名称">
              <Select style={{ width: "220px" }}
                      showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="考场名称"
                      onSearch={handleSearchExam} filterOption={handleFilterOption} disabled
              >
                {examinationSiteList?.map(({ value, label, id }) => {
                  return <Option value={value} key={id}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={12}>
            <Item{...FORMITEM_LAYOUT} name="examDate" label="考试日期">
              <DatePicker style={{ width: "220px" }} disabled/>
            </Item>
          </Col>
          <Col span={12}>
            <Item
              {...FORMITEM_LAYOUT}
              name="examSuject" label="考试科目">
              <Select style={{ width: "220px" }} placeholder="考试科目" allowClear disabled>
                {courseList?.map(({ value, label }) => {
                  return <Option value={value} key={value}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={12}>
            <Item
              {...FORMITEM_LAYOUT}
              name="examSession" label="考试场次">
              <Select style={{ width: "220px" }} placeholder="考试场次" allowClear disabled>
                {examSessionList?.map(({ value, label }) => {
                  return <Option value={value} key={value}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={12}>
            <Item
              {...FORMITEM_LAYOUT}
              name="examType" label="考试车型">
              <Select style={{ width: "220px" }} placeholder="考试车型" allowClear disabled>
                {perdritypeList?.map(({ value, label }) => {
                  return <Option value={value} key={value}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>

        </Row>
        <Row>
          <Col span={12}>
            <Item
              {...FORMITEM_LAYOUT}
              rules={[{ required: true, message: "主考官" }]}
              name="chiefExaminerId" label="主考官">
              <Select style={{ width: "220px" }}
                      showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入"
                      onSearch={handleChiefSearch} filterOption={handleFilterOption} onChange={handleChiefChange}>
                {invList?.map(({ value, label, id }) => {
                  return <Option value={value} key={id}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={12}>
            <Item
              {...FORMITEM_LAYOUT}
              name="assistExaminerId" label="副考官">
              <Select style={{ width: "220px" }} placeholder="请输入"
                      showSearch allowClear labelInValue defaultActiveFirstOption={false}
                      onChange={handleAssistChange}
                      onSearch={handleAssistSearch}
                      filterOption={handleFilterOption}
              >
                {invList?.map(({ value, label, id }) => {
                  return <Option value={value} key={id}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col offset={1} span={11}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
            >
              <div className="chief_pic">
                {/*主考官照片*/}
                {chiefPhoto ? <Images width={180} height={240} src={chiefPhoto}/> : <div style={{
                  display: "inline-block",
                  width: "180px",
                  height: "240px",
                  background: "rgba(255, 255, 255, 0.3)",
                  textAlign: "center",
                  lineHeight: "240px",
                  color: "#006EFF",
                  fontSize: 14,
                  fontWeight: 400
                }}>主考官</div>}
              </div>
            </Item>
          </Col>
          <Col offset={1} span={11}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
            >
              <div className="assist_pic">
                {/* 副考官照片 */}
                {assistPhoto ? <Images width={180} height={240} src={assistPhoto}/> : <div style={{
                  display: "inline-block",
                  width: "180px",
                  height: "240px",
                  background: "rgba(255, 255, 255, 0.3)",
                  textAlign: "center",
                  lineHeight: "240px",
                  color: "#006EFF",
                  fontSize: 14,
                  fontWeight: 400
                }}>副考官</div>}
              </div>
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default connect(({ order, global }) => ({
  cuOrderModalForm: order.cuOrderModalForm,
  isShowAddOrEditExaminerModal: order.isShowAddOrEditExaminerModal,
  examinationSiteList: order.examinationSiteList,
  courseList: global.courseList,
  examSessionList: global.examSessionList,
  perdritypeList: global.perdritypeList
}))(CuEditExaminerModal)
