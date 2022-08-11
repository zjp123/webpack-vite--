import React, { useEffect } from "react"
import { Button, Col, Row } from "antd"
import { connect } from "dva"
import { WhiteCard, InfoCard } from "@/components"
import { goto } from "@/utils"
import { getDict } from "@/utils/publicFunc"


const Schedule = ({ dispatch, match, detailsInfo, examSessionList }) => {
  useEffect(() => {
    getData()
  }, [])
  //获取列表数据
  const getData = async () => {
    await dispatch({
      type: "schedule/details",
      payload: { id: match.params.id }
    })
    getDict(dispatch, "examSession", {})
  }

  // 使用方法
  const infoCardColumns = [
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "性别",
      dataIndex: "sex"
    },
    {
      title: "出生日期",
      dataIndex: "birthday"
    },
    {
      title: "身份证明名称",
      dataIndex: "idCardName"
    },
    {
      title: "身份证明号码",
      dataIndex: "idCardNo"
    },
    {
      title: "国籍",
      dataIndex: "nationality"
    },
    {
      title: "预约日期",
      dataIndex: "appointmentDate"
    },
    {
      title: "预考日期",
      dataIndex: "appointmentExamDate"
    },
    {
      title: "考试车型",
      dataIndex: "examModel"
    },
    {
      title: "考试地点",
      dataIndex: "examSite"
    },
    {
      title: "考试场次",
      dataIndex: "examSession",
      render: (text) => examSessionList?.find((item) => item?.value === text)?.label
    },
    {
      title: "考台考车",
      dataIndex: "examSiteCar"
    },
    {
      title: "管理部门",
      dataIndex: "managementDepartment"
    },
    {
      title: "考试日期",
      dataIndex: "appointmentExamDate"
    },
    {
      title: "考试次数",
      dataIndex: "numberOfExams"
    },
    {
      title: "考试成绩",
      dataIndex: "examScore"
    },
    {
      title: "考试员1",
      dataIndex: "chiefExaminer"
    },
    {
      title: "考试员2",
      dataIndex: "associateExaminer"
    },
    {
      title: "状态",
      dataIndex: "preasignStatus"
    },
    {
      title: "所属驾校",
      dataIndex: "status1"
    },
    {
      title: "准考证编号",
      dataIndex: "admissionCertificateNumber"
    },
    {
      title: "业务办理部门",
      dataIndex: "businessDepartment"
    }
  ]

  return (
    <WhiteCard isPaved={false} title={
      <Row style={{ display: "flex", justifyContent: "space-between" }} align='middle'>
        <Col style={{ fontSize: "14px" }}>考生基本信息</Col>
        <Col>
          <Button
            size='small'
            style={{ margin: "4px" }}
            onClick={() => {
              goto.go(-1)
            }}
            type='primary'
            className='mar-l-4'
          >返回</Button>
        </Col>
      </Row>
    }>
      <Row>
        <Col style={{ fontSize: "14px", marginLeft: "10px", fontWeight: 800 }}>流水号:{detailsInfo?.serialNum}</Col>
      </Row>
      <InfoCard columns={infoCardColumns} data={detailsInfo}/>
    </WhiteCard>
  )
}
export default connect(({ schedule, global }) => ({
  detailsInfo: schedule.detailsInfo,
  examSessionList: global.examSessionList
}))(Schedule)


