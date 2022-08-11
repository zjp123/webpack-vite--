/**
 * @author: Gene
 * @age: 永远18岁的美少年
 * @Email： yangjianyun@58.com
 * @date: 2021-10-28 15:58:43
 * @description: 成功or失败页
 */

import React, {} from "react"
import { connect } from "dva"
import { Card, Button, Result } from "antd"
import Steps from "./Steps"
import { goto } from "@/utils"
import "./index.less"


const Step5Result = ({dispatch, match}) => {
  // 学员 id
  const id = match.params.resultId && parseInt(match.params.resultId)

  // 返回采集页
  const handleGoStartStep = () => {
    goto.push("/student/registration")
  }

  const renderSuccessful = () => {
    return (
      <Card>
        <Result
          style={{height: "500px"}}
          status="success"
          title="学员报名信息已提交!"
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button key="buy" onClick={handleGoStartStep}>返回采集页面</Button>,
          ]}
        />
      </Card>
    )
  }

  const renderFailed = () => {
    return (
      <div>
        失败
      </div>
    )
  }
  return (
    <div className="result_container">
      <Steps currentStep={4}/>
      {id === 0 && renderSuccessful()}
      {id === 1 && renderFailed()}
    </div>
  )
}
export default connect(({registration, global}) => {
  return {
    isShowShootIDCard: registration.isShowShootIDCard,
    isShowInputForm: registration.isShowInputForm,
  }
})(Step5Result)

