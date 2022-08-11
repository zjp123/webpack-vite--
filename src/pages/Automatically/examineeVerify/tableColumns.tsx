import React from "react"

export const TABLE_COLUMNS =  [
  {
    title: "考生姓名",
    dataIndex: "name"
  },
  {
    title: "身份证号码",
    dataIndex: "idCard"
  },
  {
    title: "分配考台",
    dataIndex: "assignSite"
  },
  {
    title: "核验状态",
    dataIndex: "assignStatus",
    render: (text) => {
      return text === "通过" ? <span style={{color: "#62BC00"}}>{text}</span> :
      <span style={{color: "red"}}>{text}</span>
    }
  }
]
