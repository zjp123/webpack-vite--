import { SEX_NUMBER_ENUM } from "@/utils/constants"
import { moment2String } from "@/utils"
import {copy} from "@/utils/publicFunc";

export const informaEion = [{
  title: "姓名",
  dataIndex: "name"
}, {
  title: "性别",
  dataIndex: "sex",
  render: (text) => {
    return SEX_NUMBER_ENUM.find((item) => item.value === text)?.label || ""
  }
},
  {
    title: "出生日期",
    dataIndex: "birthday",
    render: (text) => {
      return moment2String(text, "YYYY-MM-DD")
    }
  },
  {
    title: "身份证号",
    dataIndex: "idcard"

  },
  {
    title: "民族",
    dataIndex: "ethnic"
  },
  {
    title: "联系方式",
    dataIndex: "mobilePhone"
  },
  {
    title: "报名时间",
    dataIndex: "registrationTime"
  },
  {
    title: "有效日期",
    dataIndex: "expirationDate"
  },
  {
    title: "所属驾校",
    dataIndex: "schName"
  },
  {
    title: "邮寄地址",
    dataIndex: "contactAddress"
  },
  {
    title: "登记住所",
    dataIndex: "registerResidence"
  },
  {
    title: "电子邮箱",
    dataIndex: "eMail"
  }
]


