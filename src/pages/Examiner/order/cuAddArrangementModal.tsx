import React, { useState, useEffect } from "react"
import { Form, Row, Col, DatePicker, Modal, Select, message } from "antd"
import moment from "moment"
import "./index.less"
import { getExaminerArrangementApi } from "@/api/examiner"
import { Images } from "@/components"
import { FORMITEM_LAYOUT } from "@/utils/constants"
import { connect } from "dva"
import { getDict } from "@/utils/publicFunc"

// 考官inv  考试场次examSession 考试科目course  考试车型perdritype
let dictsArr = ["inv", "exs", "examSession", "course", "perdritype"]
const { Item } = Form
const { Option } = Select

const CuAddArrangementModal = (props) => {
  const { arrangeId, isShowAddModal, dispatch } = props
  let { invList, exsList, examSessionList, courseList, perdritypeList, parentForm } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [chiefKey,setChiefKey]=useState()
  let [chiefPhoto, setChiefPhoto] = useState("")
  const [assistKey,setAssistKey]=useState()
  let [assistPhoto, setAssistPhoto] = useState("")
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

  useEffect(() => {
    getDicts()
    // 查询编辑详情
    getEditDetail()
  }, [])

  const getDicts = () => {
    // 查询下拉框内容
    dictsArr.forEach(async (item) => {
      await getDict(dispatch, item, {})
    })
  }
  // 获取编辑详情
  const getEditDetail = async () => {
    if (arrangeId) { // 排期这条数据 id
      let res: any = await getExaminerArrangementApi({ id: arrangeId })
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

      let formVal = {
        ...res?.data,
        chiefExaminerId,
        assistExaminerId,
        examDate: moment(res?.data?.examDate)
      }
      form.setFieldsValue({
        ...formVal
      })
    } else {
      form.resetFields()
    }
  }

  function onChangeDate(date, dateString) {
    // console.log(date, dateString)
  }

  // 主考官发生变化时触发
  const handleChiefChange = async (val) => {
    const photoUrl = invList?.find((item) => item.value === val?.value)?.photoUrl || ""
    setChiefKey(val?.key)
    setChiefPhoto(photoUrl)
  }
  // 主考官搜索
  const handleChiefSearch = async (val) => {
  }


  // 副考官发生变化时触发
  const handleAssistChange = async (val) => {
    const photoUrl = invList?.find((item) => item.value === val?.value)?.photoUrl || ""
    setAssistKey(val?.key)
    setAssistPhoto(photoUrl)
  }
  // 副考官搜索
  const handleAssistSearch = async (val) => {
  }

  // 筛选
  const handleFilterOption = (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  // 动态查询考场下拉
  const handleSearchExam = async (val) => {
    getDict(dispatch, "exs", { keyword: val })
  }

  const handleOnOk = () => {
    form.validateFields().then(async (res) => {
      let examiners = [
        { id: chiefExaminerDetailId, examinerId: res.chiefExaminerId?.value, examinerDuty: 0, examinerType: 0 },
        { id: assistExaminerDetailId, examinerId: res.assistExaminerId?.value, examinerDuty: 1, examinerType: 0 }
      ]
      examiners = examiners?.filter((item) => item.examinerId !== undefined)
      const data: any = {
        ...res,
        id: arrangeId,
        examiners
      }
      delete data.chiefExaminerId
      delete data.assistExaminerId
      setLoading(true)
      try {
        await dispatch({
          type: "order/addArrangement",
          payload: {
            parentForm,
            data
          }
        })
        // setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    })
  }
  return (
    <Modal
      title={(arrangeId ? "编辑" : "新增") + "考官排班"}
      visible={isShowAddModal}
      width={764}
      confirmLoading={loading}
      okText='提交'
      onOk={handleOnOk}
      onCancel={() => {
        dispatch({
          type: "order/save",
          payload: {
            isShowAddModal: false
          }
        })
      }}
    >
      <Form
        layout='horizontal'
        form={form}
        colon={false}
        autoComplete="off"
        initialValues={{}}
      >
        <Row>
          <Col span={11} offset={1}>
            <Item
              {...FORMITEM_LAYOUT}
              rules={[{ required: true, message: "考场名称" }]}
              name="examSiteId" label="考场名称" labelCol={{ span: 24 }}>
              <Select
                showSearch allowClear
                style={{ width: "294px" }}
                placeholder="考场名称"
                onSearch={handleSearchExam}
                filterOption={handleFilterOption}
              >
                {exsList?.map(({ value, label, id }) => {
                  return <Option value={value} key={id}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={11} offset={1}>
            <Item{...FORMITEM_LAYOUT} name="examDate" labelCol={{ span: 24 }} label="考试日期"
                 rules={[{ required: true, message: "考试日期" }]}>
              <DatePicker style={{ width: "294px" }} disabledDate={(current)=>{ return current && current <moment().subtract(1, "days");}} onChange={onChangeDate}/>
            </Item>
          </Col>
          <Col span={11} offset={1}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "考试科目" }]}
              name="examSuject" label="考试科目">
              <Select style={{ width: "294px" }} placeholder="考试科目" allowClear>
                {courseList?.map(({ value, label }) => {
                  return <Option value={value} key={value}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={11} offset={1}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "考试场次" }]}
              name="examSession" label="考试场次">
              <Select style={{ width: "294px" }} placeholder="考试场次" allowClear>
                {examSessionList?.map(({ value, label }) => {
                  return <Option value={value} key={value}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={12} offset={1}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "考试车型" }]}
              name="examType" label="考试车型">
              <Select style={{ width: "294px" }} placeholder="考试车型" allowClear>
                {perdritypeList?.map(({ value, label }) => {
                  return <Option value={value} key={value}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={1}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: "主考官" }]}
              name="chiefExaminerId" label="主考官">
              <Select style={{ width: "294px" }}
                      showSearch allowClear labelInValue defaultActiveFirstOption={false} placeholder="请输入"
                      onSearch={handleChiefSearch}
                      filterOption={handleFilterOption}
                      onChange={handleChiefChange}>
                {invList?.map(({ value, label, id }) => {
                  return <Option value={value} key={id}>{label}</Option>
                })}
              </Select>
            </Item>
          </Col>
          <Col span={11} offset={1}>
            <Item
              {...FORMITEM_LAYOUT}
              labelCol={{ span: 24 }}
              name="assistExaminerId" label="副考官">
              <Select style={{ width: "294px" }} placeholder="请输入"
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
                {/* 主考官照片 */}
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
  isShowAddModal: order.isShowAddModal,
  exsList: global.exsList,
  examSessionList: global.examSessionList,
  courseList: global.courseList,
  perdritypeList: global.perdritypeList
}))(CuAddArrangementModal)
